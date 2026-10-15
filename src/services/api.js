// Client-side Local Storage Service for 100% Serverless / Frontend-only Operation
// All state (Auth, RSVPs, Gifts, Guestbook) persists in the browser's localStorage.

const STORAGE_KEYS = {
  AUTH_USER: 'wedding_auth_user',
  GIFTS: 'wedding_gifts_data',
  RSVPS: 'wedding_rsvps_data',
  GUESTBOOK: 'wedding_guestbook_data'
};

const INITIAL_GIFTS = [
  {
    id: "gift-1",
    name: "Espresso Machine",
    price: "₹18,000",
    description: "A café-quality espresso maker for slow mornings together.",
    status: "Available",
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "gift-2",
    name: "Luxury Bed Linen Set",
    price: "₹6,500",
    description: "Soft cotton sheets to make our new home cozy.",
    status: "Reserved",
    reservedBy: "dev-guest-priya",
    reservedByName: "Priya & Rohan",
    reservedAt: "2026-09-12T10:30:00.000Z",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "gift-3",
    name: "Dinner Set (12 pcs)",
    price: "₹9,000",
    description: "Elegant dinnerware for hosting family & friends.",
    status: "Available",
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "gift-4",
    name: "Weekend Getaway Fund",
    price: "Any amount",
    description: "Contribute to our first mini-honeymoon trip.",
    status: "Available",
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "gift-5",
    name: "Cast Iron Cookware",
    price: "₹7,500",
    description: "For the many home-cooked meals ahead.",
    status: "Available",
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    image: "https://images.unsplash.com/photo-1584990347449-39904719001b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "gift-6",
    name: "Smart Home Speaker",
    price: "₹12,000",
    description: "Music and light for our new nest.",
    status: "Available",
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80"
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
    // Decode base64 Google JWT client-side
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

  // Gifts
  async getGifts() {
    let gifts = getStored(STORAGE_KEYS.GIFTS, null);
    if (!gifts) {
      gifts = INITIAL_GIFTS;
      setStored(STORAGE_KEYS.GIFTS, gifts);
    }
    return gifts;
  },

  async reserveGift(id, guestName = 'A Guest') {
    const currentUser = getStored(STORAGE_KEYS.AUTH_USER, null);
    const gifts = await this.getGifts();
    const gift = gifts.find(g => g.id === id);
    if (!gift) throw new Error('Gift not found');

    const name = guestName || currentUser?.name || 'A Guest';
    const userId = currentUser?.id || `guest_${Date.now()}`;

    if (gift.status === 'Reserved' && gift.reservedBy && gift.reservedBy !== userId) {
      throw new Error(`This gift was already reserved by ${gift.reservedByName || 'another guest'}`);
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
    const savedLocal = getStored('wedding_my_rsvp', null);
    if (savedLocal) return savedLocal;
    if (!currentUser) return null;

    const rsvps = getStored(STORAGE_KEYS.RSVPS, []);
    return rsvps.find(r => r.userId === currentUser.id || r.userEmail === currentUser.email) || null;
  },

  async submitRsvp(payload) {
    const currentUser = getStored(STORAGE_KEYS.AUTH_USER, null);
    const rsvps = getStored(STORAGE_KEYS.RSVPS, []);

    const userName = payload.name?.trim() || currentUser?.name || 'Guest';
    const userEmail = payload.email?.trim() || currentUser?.email || '';
    const userId = currentUser?.id || `guest_${Date.now()}`;

    const existingIndex = rsvps.findIndex(r => 
      (userEmail && r.userEmail === userEmail) || 
      (r.userName && r.userName.toLowerCase() === userName.toLowerCase())
    );

    const rsvpRecord = {
      id: existingIndex >= 0 ? rsvps[existingIndex].id : `rsvp_${Date.now()}`,
      userId,
      userName,
      userEmail,
      attending: Boolean(payload.attending),
      guestCount: payload.attending ? Math.max(1, parseInt(payload.guestCount, 10) || 1) : 0,
      events: payload.events || { haldi: false, wedding: false, reception: false },
      mealPreference: payload.mealPreference || 'Vegetarian',
      message: payload.message || '',
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      rsvps[existingIndex] = rsvpRecord;
    } else {
      rsvps.push(rsvpRecord);
    }

    setStored(STORAGE_KEYS.RSVPS, rsvps);
    setStored('wedding_my_rsvp', rsvpRecord);
    return { success: true, rsvp: rsvpRecord };
  },

  // Guestbook
  async getGuestbook() {
    let wishes = getStored(STORAGE_KEYS.GUESTBOOK, null);
    if (!wishes) {
      wishes = INITIAL_GUESTBOOK;
      setStored(STORAGE_KEYS.GUESTBOOK, wishes);
    }
    return [...wishes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async postGuestbook(message, authorName = '') {
    const currentUser = getStored(STORAGE_KEYS.AUTH_USER, null);
    const wishes = await this.getGuestbook();
    const name = authorName.trim() || currentUser?.name || 'Well-Wisher';
    const avatar = currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=d4af37&textColor=ffffff`;

    const newEntry = {
      id: `gb_${Date.now()}`,
      userId: currentUser?.id || `guest_${Date.now()}`,
      userName: name,
      userAvatar: avatar,
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    wishes.unshift(newEntry);
    setStored(STORAGE_KEYS.GUESTBOOK, wishes);
    return { success: true, entry: newEntry };
  },

  // Admin Features
  async adminGetRsvps() {
    const rsvps = getStored(STORAGE_KEYS.RSVPS, []);
    const summary = {
      totalResponses: rsvps.length,
      attendingCount: rsvps.filter(r => r.attending).length,
      declinedCount: rsvps.filter(r => !r.attending).length,
      totalGuests: rsvps.filter(r => r.attending).reduce((sum, r) => sum + (r.guestCount || 1), 0),
      events: {
        haldi: rsvps.filter(r => r.attending && r.events?.haldi).reduce((sum, r) => sum + (r.guestCount || 1), 0),
        wedding: rsvps.filter(r => r.attending && r.events?.wedding).reduce((sum, r) => sum + (r.guestCount || 1), 0),
        reception: rsvps.filter(r => r.attending && r.events?.reception).reduce((sum, r) => sum + (r.guestCount || 1), 0),
      },
      mealPreferences: rsvps.filter(r => r.attending).reduce((acc, r) => {
        acc[r.mealPreference] = (acc[r.mealPreference] || 0) + (r.guestCount || 1);
        return acc;
      }, {})
    };
    return { summary, rsvps };
  },

  async adminAddGift(giftData) {
    const gifts = await this.getGifts();
    const newGift = {
      id: `gift_${Date.now()}`,
      name: giftData.name,
      price: giftData.price,
      description: giftData.description || '',
      status: 'Available',
      reservedBy: null,
      reservedByName: null,
      reservedAt: null,
      image: giftData.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'
    };
    gifts.push(newGift);
    setStored(STORAGE_KEYS.GIFTS, gifts);
    return { success: true, gift: newGift };
  },

  async adminDeleteGift(id) {
    let gifts = await this.getGifts();
    gifts = gifts.filter(g => g.id !== id);
    setStored(STORAGE_KEYS.GIFTS, gifts);
    return { success: true };
  },

  async adminDeleteGuestbook(id) {
    let wishes = await this.getGuestbook();
    wishes = wishes.filter(w => w.id !== id);
    setStored(STORAGE_KEYS.GUESTBOOK, wishes);
    return { success: true };
  }
};
