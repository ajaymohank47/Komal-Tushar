// Client-side & Supabase Synchronized Data Service
// State (Auth, RSVPs, Gifts, Guestbook) persists in Supabase & localStorage.
import { supabase } from '../lib/supabase';
import dinnerSetImg from '../assets/images/gifts/dinner-set.jpg';
import cookwareSetImg from '../assets/images/gifts/cookware-set.jpg';
import foodProcessorImg from '../assets/images/gifts/food-processor.jpg';
import coffeeMachineImg from '../assets/images/gifts/coffee-machine.jpg';
import gasStoveImg from '../assets/images/gifts/gas-stove.jpg';
import castIronTawaImg from '../assets/images/gifts/cast-iron-tawa.jpg';

const STORAGE_KEYS = {
  AUTH_USER: 'wedding_auth_user',
  GIFTS: 'wedding_gifts_data',
  RSVPS: 'wedding_rsvps_data',
  GUESTBOOK: 'wedding_guestbook_data'
};

export const INITIAL_GIFTS = [
  {
    id: "gift-dinner-set",
    name: "Porcelain Dinner Set (with Gold Rim)",
    price: "₹8,500",
    description: "Delicate porcelain dinner set with gold trim for hosting festive family dinners.",
    status: "Available",
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    image: dinnerSetImg
  },
  {
    id: "gift-cookware-set",
    name: "Bergner Tri-Ply Stainless Steel Cookware Set",
    price: "₹10,500",
    description: "High-grade stainless steel saucepan, kadai, casserole and frypan set for everyday home cooking.",
    status: "Available",
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    image: cookwareSetImg
  },
  {
    id: "gift-food-processor",
    name: "Inalsa Easy Prep Pro Food Processor",
    price: "₹6,800",
    description: "Versatile kitchen food processor with slicing, shredding, kneading, and chopping attachments.",
    status: "Available",
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    image: foodProcessorImg
  },
  {
    id: "gift-coffee-machine",
    name: "Agaro Imperial Espresso Coffee Machine",
    price: "₹12,000",
    description: "Barista-grade 15-bar espresso maker with milk steam wand for cozy morning coffees.",
    status: "Available",
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    image: coffeeMachineImg
  },
  {
    id: "gift-gas-stove",
    name: "Smart 3-Burner Glass Top Gas Stove",
    price: "₹9,200",
    description: "Elegant black toughened glass hob with high-efficiency brass burners and digital timer display.",
    status: "Available",
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    image: gasStoveImg
  },
  {
    id: "gift-cast-iron-tawa",
    name: "Solara Cast Iron Tawa (Pre-Seasoned)",
    price: "₹3,500",
    description: "Heavy-duty cast iron tawa for crispy dosas, rotis, and Indian flatbreads. Naturally non-stick with long-lasting seasoning.",
    status: "Available",
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    image: castIronTawaImg
  }
];

const INITIAL_GUESTBOOK = [
  {
    id: "gb-1",
    userId: "guest-vikram",
    userName: "Vikram Malhotra",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    message: "Heartiest congratulations Komal & Tushar! Wishing you both a lifetime of love, laughter, and endless happiness.",
    createdAt: "2026-10-01T15:30:00.000Z"
  },
  {
    id: "gb-2",
    userId: "guest-neha",
    userName: "Neha & Ankit",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    message: "Cannot wait to celebrate the Haldi and dance at your Reception! Looking forward to December 13th! 💛✨",
    createdAt: "2026-10-05T09:15:00.000Z"
  }
];

function getStored(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

export const api = {
  // Auth
  async googleLogin(credential) {
    let name = 'Google Guest';
    let email = 'guest@gmail.com';
    let avatar = '';

    try {
      const parts = credential.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        name = payload.name || name;
        email = payload.email || email;
        avatar = payload.picture || '';
      }
    } catch (e) {
      console.warn('Could not decode Google token payload, using defaults', e);
    }

    const isAdmin = email.toLowerCase().includes('admin') || email.toLowerCase().includes('tushar') || email.toLowerCase().includes('komal');
    const user = {
      id: `google_${Date.now()}`,
      name,
      email,
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      isAdmin
    };

    setStored(STORAGE_KEYS.AUTH_USER, user);
    return { user };
  },

  async devLogin({ name, email, avatar, asAdmin }) {
    const userName = name || (asAdmin ? 'Tushar & Komal (Admin)' : 'Wedding Guest');
    const userEmail = email || (asAdmin ? 'admin@wedding.com' : 'guest@example.com');
    const userAvatar = avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}`;
    const isAdmin = asAdmin || userEmail.toLowerCase().includes('admin') || userEmail.toLowerCase().includes('tushar');

    const user = {
      id: `dev_${Date.now()}`,
      name: userName,
      email: userEmail,
      avatar: userAvatar,
      isAdmin
    };

    setStored(STORAGE_KEYS.AUTH_USER, user);
    return { user };
  },

  async getMe() {
    const user = getStored(STORAGE_KEYS.AUTH_USER, null);
    return user ? { user } : null;
  },

  // ── Gifts (Supabase Synchronized & Atomic) ───────────────────────────
  async getGifts() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('wedding_gifts')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped = data.map(g => ({
            id: g.id,
            name: g.name,
            price: g.price,
            description: g.description,
            image: g.image,
            status: g.status,
            reservedBy: g.reserved_by,
            reservedByName: g.reserved_by_name,
            reservedAt: g.reserved_at
          }));
          setStored(STORAGE_KEYS.GIFTS, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Could not fetch gifts from Supabase, using local fallback:', err);
      }
    }

    let gifts = getStored(STORAGE_KEYS.GIFTS, null);
    if (!gifts || gifts.length === 0) {
      gifts = INITIAL_GIFTS;
      setStored(STORAGE_KEYS.GIFTS, gifts);
    }
    return gifts;
  },

  async reserveGift(id, guestName = 'A Guest') {
    const currentUser = getStored(STORAGE_KEYS.AUTH_USER, null);
    const name = guestName?.trim() || currentUser?.name || 'A Guest';
    const userId = currentUser?.id || `guest_${Date.now()}`;

    if (supabase) {
      // 1. Check current status in database
      const { data: current } = await supabase
        .from('wedding_gifts')
        .select('*')
        .eq('id', id)
        .single();

      if (current && current.status === 'Reserved') {
        throw new Error(`This gift is already reserved by ${current.reserved_by_name || 'another guest'}. Please choose another gift.`);
      }

      // 2. Perform atomic update where status is still 'Available'
      const { data: updated, error } = await supabase
        .from('wedding_gifts')
        .update({
          status: 'Reserved',
          reserved_by: userId,
          reserved_by_name: name,
          reserved_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('status', 'Available')
        .select()
        .single();

      if (error || !updated) {
        throw new Error('This gift was just reserved by someone else! Please choose another item.');
      }

      const gift = {
        id: updated.id,
        name: updated.name,
        price: updated.price,
        description: updated.description,
        image: updated.image,
        status: updated.status,
        reservedBy: updated.reserved_by,
        reservedByName: updated.reserved_by_name,
        reservedAt: updated.reserved_at
      };

      // Also mirror to local storage
      const localGifts = getStored(STORAGE_KEYS.GIFTS, INITIAL_GIFTS);
      const idx = localGifts.findIndex(g => g.id === id);
      if (idx >= 0) {
        localGifts[idx] = gift;
        setStored(STORAGE_KEYS.GIFTS, localGifts);
      }

      return { success: true, gift };
    }

    // Local fallback if Supabase unavailable
    const gifts = await this.getGifts();
    const gift = gifts.find(g => g.id === id);
    if (!gift) throw new Error('Gift not found');

    if (gift.status === 'Reserved') {
      throw new Error(`This gift is already reserved by ${gift.reservedByName || 'another guest'}`);
    }

    gift.status = 'Reserved';
    gift.reservedBy = userId;
    gift.reservedByName = name;
    gift.reservedAt = new Date().toISOString();

    setStored(STORAGE_KEYS.GIFTS, gifts);
    return { success: true, gift };
  },

  async unreserveGift(id) {
    const currentUser = getStored(STORAGE_KEYS.AUTH_USER, null);
    const userId = currentUser?.id;
    const isAdmin = Boolean(currentUser?.isAdmin);

    if (supabase) {
      const { data: current } = await supabase
        .from('wedding_gifts')
        .select('*')
        .eq('id', id)
        .single();

      if (!current) throw new Error('Gift not found');

      if (current.reserved_by && current.reserved_by !== userId && !isAdmin) {
        throw new Error('You can only cancel your own reservation');
      }

      const { data: updated, error } = await supabase
        .from('wedding_gifts')
        .update({
          status: 'Available',
          reserved_by: null,
          reserved_by_name: null,
          reserved_at: null
        })
        .eq('id', id)
        .select()
        .single();

      if (error || !updated) {
        throw new Error(error?.message || 'Failed to cancel reservation');
      }

      const gift = {
        id: updated.id,
        name: updated.name,
        price: updated.price,
        description: updated.description,
        image: updated.image,
        status: 'Available',
        reservedBy: null,
        reservedByName: null,
        reservedAt: null
      };

      return { success: true, gift };
    }

    const gifts = await this.getGifts();
    const gift = gifts.find(g => g.id === id);
    if (!gift) throw new Error('Gift not found');

    gift.status = 'Available';
    gift.reservedBy = null;
    gift.reservedByName = null;
    gift.reservedAt = null;

    setStored(STORAGE_KEYS.GIFTS, gifts);
    return { success: true, gift };
  },

  // RSVP
  async getMyRsvp() {
    const currentUser = getStored(STORAGE_KEYS.AUTH_USER, null);
    const localId = getStored('wedding_my_rsvp_id', null);

    // Try Supabase first using stored id
    if (supabase && localId) {
      try {
        const { data, error } = await supabase
          .from('wedding_rsvps')
          .select('*')
          .eq('id', localId)
          .single();
        if (!error && data) {
          return {
            id: data.id,
            userName: data.user_name,
            userEmail: data.user_contact,
            guestCount: data.guest_count,
            mealPreference: data.meal_preference,
            message: data.message,
            submittedAt: data.submitted_at
          };
        }
      } catch (e) {
        console.warn('Could not fetch RSVP from Supabase:', e);
      }
    }

    // Local fallback
    const savedLocal = getStored('wedding_my_rsvp', null);
    if (savedLocal) return savedLocal;
    if (!currentUser) return null;
    return null;
  },

  async submitRsvp(payload) {
    const currentUser = getStored(STORAGE_KEYS.AUTH_USER, null);
    const userName = payload.name?.trim() || currentUser?.name || 'Guest';
    const userContact = payload.email?.trim() || currentUser?.email || '';
    const existingId = getStored('wedding_my_rsvp_id', null);
    const rsvpId = existingId || `rsvp_${Date.now()}`;

    const rsvpRecord = {
      id: rsvpId,
      userName,
      userEmail: userContact,
      guestCount: Math.max(1, parseInt(payload.guestCount, 10) || 1),
      mealPreference: payload.mealPreference || 'Vegetarian',
      message: payload.message?.trim() || '',
      updatedAt: new Date().toISOString()
    };

    // Save to Supabase
    if (supabase) {
      try {
        const { error } = await supabase
          .from('wedding_rsvps')
          .upsert({
            id: rsvpId,
            user_name: userName,
            user_contact: userContact,
            guest_count: rsvpRecord.guestCount,
            meal_preference: rsvpRecord.mealPreference,
            message: rsvpRecord.message,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
        if (error) console.warn('Supabase RSVP upsert error:', error.message);
      } catch (e) {
        console.warn('Could not save RSVP to Supabase:', e);
      }
    }

    // Mirror to localStorage
    setStored('wedding_my_rsvp_id', rsvpId);
    setStored('wedding_my_rsvp', rsvpRecord);
    return { success: true, rsvp: rsvpRecord };
  },

  // Admin APIs
  async adminGetRsvps() {
    // Try Supabase first
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('wedding_rsvps')
          .select('*')
          .order('submitted_at', { ascending: false });

        if (!error && data) {
          const rsvps = data.map(r => ({
            id: r.id,
            userName: r.user_name,
            userEmail: r.user_contact,
            guestCount: r.guest_count || 1,
            mealPreference: r.meal_preference,
            message: r.message,
            submittedAt: r.submitted_at
          }));
          const totalGuests = rsvps.reduce((sum, r) => sum + (parseInt(r.guestCount, 10) || 1), 0);
          return {
            rsvps,
            summary: {
              totalResponses: rsvps.length,
              totalGuests
            }
          };
        }
      } catch (e) {
        console.warn('Could not fetch RSVPs from Supabase:', e);
      }
    }

    // Local fallback
    const rsvps = getStored(STORAGE_KEYS.RSVPS, []);
    const totalGuests = rsvps.reduce((sum, r) => sum + (parseInt(r.guestCount, 10) || 1), 0);
    return {
      rsvps,
      summary: {
        totalResponses: rsvps.length,
        totalGuests
      }
    };
  },

  async adminAddGift(newGift) {
    const id = `gift_${Date.now()}`;
    const gift = {
      id,
      name: newGift.name,
      price: newGift.price,
      description: newGift.description || '',
      image: newGift.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      status: 'Available',
      reservedBy: null,
      reservedByName: null,
      reservedAt: null
    };

    if (supabase) {
      try {
        await supabase.from('wedding_gifts').insert({
          id: gift.id,
          name: gift.name,
          price: gift.price,
          description: gift.description,
          image: gift.image,
          status: 'Available'
        });
      } catch (e) {
        console.error('Supabase adminAddGift error:', e);
      }
    }

    const gifts = await this.getGifts();
    gifts.push(gift);
    setStored(STORAGE_KEYS.GIFTS, gifts);
    return { success: true, gift };
  },

  async adminDeleteGift(id) {
    if (supabase) {
      try {
        await supabase.from('wedding_gifts').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase adminDeleteGift error:', e);
      }
    }
    const gifts = await this.getGifts();
    const filtered = gifts.filter(g => g.id !== id);
    setStored(STORAGE_KEYS.GIFTS, filtered);
    return { success: true };
  }
};
