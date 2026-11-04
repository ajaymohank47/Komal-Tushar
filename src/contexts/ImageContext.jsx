import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ImageContext = createContext({});

export function ImageProvider({ children }) {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all uploaded image URLs from the wedding_images table
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
        console.error('[ImageContext] Fetch error:', error.message, '— Have you run the SQL setup and enabled RLS policies?');
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

  useEffect(() => {
    fetchImages();

    // Realtime subscription: auto-refresh when any row changes
    // so the main site picks up new uploads without a manual page reload
    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel('wedding_images_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wedding_images' },
        (payload) => {
          if (payload.new && payload.new.slot && payload.new.image_url) {
            setImages(prev => ({
              ...prev,
              [payload.new.slot]: payload.new.image_url,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const setImage = async (slotId, url) => {
    // Optimistically update local state immediately
    setImages(prev => ({ ...prev, [slotId]: url }));

    if (supabase) {
      try {
        const { error } = await supabase
          .from('wedding_images')
          .upsert({ slot: slotId, image_url: url });
        if (error) {
          console.error('[ImageContext] Upsert error:', error.message);
        }
      } catch (e) {
        console.error('[ImageContext] Could not save image URL to Supabase:', e);
      }
    }
  };

  return (
    <ImageContext.Provider value={{ images, setImage, loading, refetch: fetchImages }}>
      {children}
    </ImageContext.Provider>
  );
}

export const useImageContext = () => useContext(ImageContext);
