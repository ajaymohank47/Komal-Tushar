// Centralized Content & Configuration for Komal & Tushar's Wedding Invitation
// Anyone can edit this file to update names, stories, dates, venues, photos, and family details.

// Real local images — imported so Vite bundles them correctly
import heroImg from '../assets/images/hero.jpeg';
import akshatatImg from '../assets/images/family/Akshatat.jpg';
import geetaImg from '../assets/images/family/geeta.jpg';
import sarveshImg from '../assets/images/family/sarvesh.jpg';
import sayaliImg from '../assets/images/family/sayali.jpg';
import shashikantImg from '../assets/images/family/shashikant.jpg';
import sushmaImg from '../assets/images/family/sushma.jpg';
import tejasImg from '../assets/images/family/tejas.jpg';

export const weddingContent = {
  // Global & Couple Details
  global: {
    title: "Wedding Invitation Komal & Tushar",
    couple: {
      bride: "Komal",
      groom: "Tushar",
      fullNameBride: "Komal Shinde",
      fullNameGroom: "Tushar Pawar",
      initials: "K & T",
    },
    weddingDate: "13 · December · 2026",
    weddingDateISO: "2026-12-13T10:00:00+05:30",
    location: "New Delhi, India",
    themeColor: "#000000",
    dividerOrnament: "✦ ✦ ✦",
    singleOrnament: "✦",
  },

  // Navigation Links
  navLinks: [
    { label: "Our Story", href: "#story" },
    { label: "Events", href: "#events" },
    { label: "Gallery", href: "#gallery" },
    { label: "Venue", href: "#venue" },
    { label: "RSVP", href: "#rsvp" },
    { label: "Registry", href: "#registry" },
  ],

  // Footer Navigation Links
  footerNavLinks: [
    { label: "Our Story", href: "#story" },
    { label: "Our Families", href: "#family" },
    { label: "Events", href: "#events" },
    { label: "Gallery", href: "#gallery" },
    { label: "Venue", href: "#venue" },
    { label: "RSVP", href: "#rsvp" },
    { label: "Gifts", href: "#gifts" },
    { label: "Registry", href: "#registry" },
    { label: "Guest Book", href: "#guestbook" },
  ],

  // 1. Hero Section
  hero: {
    eyebrow: "We are getting married",
    bride: "Komal",
    ampersand: "&",
    groom: "Tushar",
    date: "13 · December · 2026",
    invitationText: "Together with their families, Komal & Tushar joyfully invite you to witness their union in love and celebration",
    ctaText: "Save the Date",
    scrollIndicator: "Scroll",
    backgroundImage: heroImg,
  },

  // 2. Countdown Section
  countdown: {
    eyebrow: "Days Until Forever",
    heading: "Counting Down with Joy",
    targetDate: "2026-12-13T10:00:00+05:30",
  },

  // 3. Our Story Section (id: story)
  story: {
    id: "story",
    eyebrow: "How it all began",
    heading: "Our Story",
    subtitle: "a journey of love",
    timeline: [
      {
        year: "2020",
        title: "First Meeting",
        text: "A mutual friend's get-together. One glance across the room, one smile — and the universe quietly rearranged itself.",
        image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "2021",
        title: "First Date",
        text: "A quiet café, chai that went cold because we couldn't stop talking. Hours felt like minutes.",
        image: "https://images.unsplash.com/photo-1517256673644-36ad11246d21?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "2024",
        title: "The Proposal",
        text: "Tushar planned it perfectly — fairy lights, her favourite flowers, and a question she'd been hoping to hear. She said yes before he could finish.",
        image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "2025",
        title: "Engagement",
        text: "Surrounded by family, love, and laughter — we made our promise official and celebrated the start of forever.",
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
      },
      {
        year: "2026",
        title: "Wedding Day",
        text: "December 13, 2026 — the day we say our vows and begin the most beautiful chapter. And you're invited to every moment.",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },

  // 4. Families Section (id: family)
  family: {
    id: "family",
    eyebrow: "With blessings of",
    heading: "Our Families",
    groomFamily: {
      title: "Groom's Family",
      members: [
        { name: "Dayanand Pawar", relation: "Father", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
        { name: "Geeta Pawar", relation: "Mother", photo: geetaImg },
        { name: "Tejas Pawar", relation: "Brother", photo: tejasImg },
        { name: "Sayali Jadhav-Pawar", relation: "Sister-in-law", photo: sayaliImg }
      ]
    },
    brideFamily: {
      title: "Bride's Family",
      members: [
        { name: "Shashikant Shinde", relation: "Father", photo: shashikantImg },
        { name: "Sushma Shinde", relation: "Mother", photo: sushmaImg },
        { name: "Sarvesh Shinde", relation: "Brother", photo: sarveshImg },
        { name: "Akshatat Shinde", relation: "Sister", photo: akshatatImg }
      ]
    }
  },

  // 5. Events Section (id: events)
  events: {
    id: "events",
    eyebrow: "Join us for",
    heading: "Our Celebrations",
    subtitle: "all are welcome",
    list: [
      {
        id: "haldi",
        icon: "🌼",
        title: "Haldi",
        date: "December 12, 2026",
        time: "10:00 AM – 2:00 PM",
        venue: "Mehendi Lawn, The Grand",
        dressCode: "Yellow / Bright Ethnic",
        mapUrl: "https://maps.google.com/?q=The+Grand+New+Delhi"
      },
      {
        id: "wedding",
        icon: "🪔",
        title: "Wedding Ceremony",
        date: "December 13, 2026",
        time: "10:00 AM – 1:00 PM",
        venue: "Grand Ballroom, The Grand",
        dressCode: "Traditional Ethnic",
        mapUrl: "https://maps.google.com/?q=The+Grand+New+Delhi"
      },
      {
        id: "reception",
        icon: "🥂",
        title: "Reception",
        date: "December 13, 2026",
        time: "7:00 PM – 11:00 PM",
        venue: "Crystal Hall, The Grand",
        dressCode: "Formal / Cocktail",
        mapUrl: "https://maps.google.com/?q=The+Grand+New+Delhi"
      }
    ]
  },

  // 6. Gallery Section (id: gallery)
  gallery: {
    id: "gallery",
    eyebrow: "Our moments",
    heading: "Photo Gallery",
    subtitle: "captured in love",
    filterChips: ["All", "prewedding", "engagement", "family", "travel"],
    photos: [
      {
        id: "gal-1",
        category: "prewedding",
        title: "Sunset Serenade",
        alt: "Komal & Tushar",
        url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "gal-2",
        category: "engagement",
        title: "The Ring Exchange",
        alt: "Komal & Tushar",
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "gal-3",
        category: "prewedding",
        title: "Stolen Whispers",
        alt: "Komal & Tushar",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "gal-4",
        category: "travel",
        title: "Udaipur Lakes",
        alt: "Komal & Tushar",
        url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "gal-5",
        category: "family",
        title: "Family Celebrations",
        alt: "Komal & Tushar",
        url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "gal-6",
        category: "engagement",
        title: "Laughter & Lights",
        alt: "Komal & Tushar",
        url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "gal-7",
        category: "travel",
        title: "Mountain Getaway",
        alt: "Komal & Tushar",
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "gal-8",
        category: "prewedding",
        title: "Royal Palace Walk",
        alt: "Komal & Tushar",
        url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "gal-9",
        category: "family",
        title: "Blessings & Joy",
        alt: "Komal & Tushar",
        url: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80"
      }
    ]
  },

  // 7. Venue Section (id: venue)
  venue: {
    id: "venue",
    eyebrow: "Find us here",
    heading: "The Venue",
    divider: "✦",
    name: "SWARAJ SANSKRUTIK BHAVAN",
    url: "https://www.swarajbhavan.com/",
    address: "Swaraj Sanskrutik Bhavan, Cultural Complex, New Delhi, India",
    directionsUrl: "https://maps.google.com/?q=SWARAJ+SANSKRUTIK+BHAVAN+New+Delhi",
    embedMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112061.09262729792!2d77.10000000000002!3d28.6139391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b923791f%3A0xf6a693c4e3089ef0!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
  },

  // 8. RSVP Section (id: rsvp)
  rsvp: {
    id: "rsvp",
    eyebrow: "Will you join us?",
    heading: "RSVP Now",
    subtitle: "Kindly respond by November 15, 2026 so we can celebrate with you.",
    deadlineDate: "November 15, 2026",
    loggedOutText: "Please sign in with Google so we know who's coming — then you can RSVP.",
    signInButtonText: "Sign in to RSVP",
    mealOptions: ["Vegetarian", "Jain", "Non-Vegetarian", "Vegan"]
  },

  // 9. Wedding Gifts (id: gifts)
  gifts: {
    id: "gifts",
    eyebrow: "With gratitude",
    heading: "Wedding Gifts",
    note: "Your presence at our celebration is the greatest gift we could ask for. For those who wish to bless us additionally — we are touched and grateful.",
    upi: {
      title: "SCAN TO PAY · UPI",
      id: "komaltushar.wedding@oksbi",
      // High quality SVG QR code generated for this exact UPI ID
      qrCodeData: "upi://pay?pa=komaltushar.wedding@oksbi&pn=Komal%20and%20Tushar%20Wedding&cu=INR"
    },
    bank: {
      title: "Bank Transfer",
      accountName: "Komal & Tushar Wedding",
      bankName: "HDFC Bank",
      accountNumber: "XXXX XXXX 1313",
      ifsc: "HDFC0001234"
    }
  },

  // 10. Gift Registry (id: registry)
  registry: {
    id: "registry",
    eyebrow: "Help us begin",
    heading: "Gift Registry",
    subtitle: "Reserve a gift below so we don't receive duplicates. Thank you for your love!"
  },

  // 11. Guest Book (id: guestbook)
  guestbook: {
    id: "guestbook",
    eyebrow: "Leave your mark",
    heading: "Guest Book",
    subtitle: "Share your wishes and love for Komal & Tushar.",
    loggedOutText: "Sign in with Google to share your wishes.",
    signInButtonText: "Sign in to post"
  },

  // 12. Footer
  footer: {
    coupleNames: "Komal & Tushar",
    datePlace: "13 December 2026 · New Delhi, India",
    loveNotice: "Made with ♥ for Komal & Tushar · 2026"
  }
};
