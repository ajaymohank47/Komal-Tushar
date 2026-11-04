import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ImageContext = createContext({
  images: {},
  galleryPhotos: [],
  setImage: async () => {},
  removeImage: async () => {},
  addGalleryPhoto: async () => {},
  deleteGalleryPhoto: async () => {},
  loading: false,
  refetch: async () => {},
  refetchGallery: async () => {}
});

export function ImageProvider({ children }) {
  const [images, setImages] = useState({});
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all uploaded image URLs from wedding_images
  const fetchImages = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('wedding_images')
        .select('slot, image_url');
      if (error) {
        console.error('[ImageContext] Fetch error:', error.message);
      }
      if (data && data.length > 0) {
        const map = {};
        data.forEach(row => {
          map[row.slot] = row.image_url;
        });
        setImages(map);
      }
    } catch (e) {
      console.error('[ImageContext] Unexpected error loading images:', e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch additional gallery photos from wedding_gallery_photos
  const fetchGalleryPhotos = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('wedding_gallery_photos')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) {
        console.error('[ImageContext] Gallery fetch error:', error.message);
      } else if (data) {
        setGalleryPhotos(data);
      }
    } catch (e) {
      console.error('[ImageContext] Unexpected error loading gallery photos:', e);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchGalleryPhotos();

    if (!isSupabaseConfigured || !supabase) return;

    // Realtime subscription: wedding_images
    const imagesChannel = supabase
      .channel('wedding_images_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wedding_images' },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            if (payload.old && payload.old.slot) {
              setImages(prev => {
                const next = { ...prev };
                delete next[payload.old.slot];
                return next;
              });
            } else {
              fetchImages();
            }
          } else if (payload.new && payload.new.slot && payload.new.image_url) {
            setImages(prev => ({
              ...prev,
              [payload.new.slot]: payload.new.image_url,
            }));
          }
        }
      )
      .subscribe();

    // Realtime subscription: wedding_gallery_photos
    const galleryChannel = supabase
      .channel('wedding_gallery_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wedding_gallery_photos' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            setGalleryPhotos(prev => {
              if (prev.some(p => p.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setGalleryPhotos(prev => prev.filter(p => p.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            setGalleryPhotos(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
          } else {
            fetchGalleryPhotos();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(imagesChannel);
      supabase.removeChannel(galleryChannel);
    };
  }, []);

  const setImage = async (slotId, url) => {
    setImages(prev => ({ ...prev, [slotId]: url }));

    if (supabase) {
      try {
        const { error } = await supabase
          .from('wedding_images')
          .upsert({ 
            slot: slotId, 
            image_url: url,
            updated_at: new Date().toISOString()
          });
        if (error) {
          console.error('[ImageContext] Upsert error:', error.message);
          throw error;
        }
      } catch (e) {
        console.error('[ImageContext] Could not save image URL to Supabase:', e);
        throw e;
      }
    }
  };

  const removeImage = async (slotId) => {
    setImages(prev => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });

    if (supabase) {
      try {
        const { error } = await supabase
          .from('wedding_images')
          .delete()
          .eq('slot', slotId);
        if (error) {
          console.error('[ImageContext] Delete error:', error.message);
          throw error;
        }
      } catch (e) {
        console.error('[ImageContext] Could not delete image from Supabase:', e);
        throw e;
      }
    }
  };

  const addGalleryPhoto = async ({ title, category, imageUrl }) => {
    const id = `gal-custom-${Date.now()}`;
    const newRecord = {
      id,
      title: title?.trim() || 'Wedding Moment',
      category: (category?.trim() || 'prewedding').toLowerCase(),
      image_url: imageUrl,
      created_at: new Date().toISOString()
    };

    setGalleryPhotos(prev => [...prev, newRecord]);

    if (supabase) {
      try {
        const { error } = await supabase
          .from('wedding_gallery_photos')
          .insert(newRecord);
        if (error) {
          setGalleryPhotos(prev => prev.filter(p => p.id !== id));
          throw error;
        }
      } catch (err) {
        console.error('[ImageContext] Error adding gallery photo:', err);
        throw err;
      }
    }
    return newRecord;
  };

  const deleteGalleryPhoto = async (id, imageUrl) => {
    setGalleryPhotos(prev => prev.filter(p => p.id !== id));

    if (supabase) {
      try {
        const { error } = await supabase
          .from('wedding_gallery_photos')
          .delete()
          .eq('id', id);
        if (error) {
          fetchGalleryPhotos();
          throw error;
        }

        // Clean up storage object if it's hosted in our wedding-photos bucket
        if (imageUrl && imageUrl.includes('wedding-photos')) {
          const match = imageUrl.match(/wedding-photos\/(.+)$/);
          if (match && match[1]) {
            const storagePath = decodeURIComponent(match[1].split('?')[0]);
            await supabase.storage.from('wedding-photos').remove([storagePath]);
          }
        }
      } catch (err) {
        console.error('[ImageContext] Error deleting gallery photo:', err);
        throw err;
      }
    }
  };

  return (
    <ImageContext.Provider
      value={{
        images,
        setImage,
        removeImage,
        galleryPhotos,
        addGalleryPhoto,
        deleteGalleryPhoto,
        loading,
        refetch: fetchImages,
        refetchGallery: fetchGalleryPhotos
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}

export const useImageContext = () => useContext(ImageContext);
