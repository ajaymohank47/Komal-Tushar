// Centralized Content & Configuration for Komal & Tushar's Wedding Invitation
// Anyone can edit this file to update names, stories, dates, venues, photos, and family details.

// Real local images — imported so Vite bundles them correctly
import heroImg from '../assets/images/hero.png';
import akshatatImg from '../assets/images/family/Akshatat.jpg';
import geetaImg from '../assets/images/family/geeta.jpg';
import sarveshImg from '../assets/images/family/sarvesh.png';
import sayaliImg from '../assets/images/family/sayali.jpg';
import shashikantImg from '../assets/images/family/shashikant.jpg';
import sushmaImg from '../assets/images/family/sushma.jpg';
import tejasImg from '../assets/images/family/tejas.jpg';
import dayanandImg from '../assets/images/family/dayanand.svg';

// Story Images (1 to 5) — Replace these files in src/assets/images/story/ or update paths
import storyImg1 from '../assets/images/story/story-1.svg';
import storyImg2 from '../assets/images/story/story-2.svg';
import storyImg3 from '../assets/images/story/story-3.svg';
import storyImg4 from '../assets/images/story/story-4.svg';
import storyImg5 from '../assets/images/story/story-5.svg';

// Gallery Images (1 to 9) — Replace these files in src/assets/images/gallery/ or update paths
import galleryImg1 from '../assets/images/gallery/gallery-1.svg';
import galleryImg2 from '../assets/images/gallery/gallery-2.svg';
import galleryImg3 from '../assets/images/gallery/gallery-3.svg';
import galleryImg4 from '../assets/images/gallery/gallery-4.svg';
import galleryImg5 from '../assets/images/gallery/gallery-5.svg';
import galleryImg6 from '../assets/images/gallery/gallery-6.svg';
import galleryImg7 from '../assets/images/gallery/gallery-7.svg';
import galleryImg8 from '../assets/images/gallery/gallery-8.svg';
import galleryImg9 from '../assets/images/gallery/gallery-9.svg';

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
    location: "Satara, Maharashtra",
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
    { label: "Reserve Gift", href: "#registry" },
  ],

  // Footer Navigation Links
  footerNavLinks: [
    { label: "Our Story", href: "#story" },
    { label: "Our Families", href: "#family" },
    { label: "Events", href: "#events" },
    { label: "Gallery", href: "#gallery" },
    { label: "Venue", href: "#venue" },
    { label: "RSVP", href: "#rsvp" },
    { label: "Reserve Gift", href: "#registry" },
    { label: "Gifts (UPI / Bank)", href: "#gifts" },
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
        image: storyImg1
      },
      {
        year: "2021",
        title: "First Date",
        text: "A quiet café, chai that went cold because we couldn't stop talking. Hours felt like minutes.",
        image: storyImg2
      },
      {
        year: "2024",
        title: "The Proposal",
        text: "Tushar planned it perfectly — fairy lights, her favourite flowers, and a question she'd been hoping to hear. She said yes before he could finish.",
        image: storyImg3
      },
      {
        year: "2025",
        title: "Engagement",
        text: "Surrounded by family, love, and laughter — we made our promise official and celebrated the start of forever.",
        image: storyImg4
      },
      {
        year: "2026",
        title: "Wedding Day",
        text: "December 13, 2026 — the day we say our vows and begin the most beautiful chapter. And you're invited to every moment.",
        image: storyImg5
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
        { name: "Dayanand Pawar", relation: "Father", photo: dayanandImg },
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
        venue: "Mehendi Lawn, Swaraj Sanskrutik Bhavan",
        dressCode: "Yellow / Bright Ethnic",
        mapUrl: "https://maps.app.goo.gl/gKarbXyyFeRvChTm8"
      },
      {
        id: "wedding",
        icon: "🪔",
        title: "Wedding Ceremony",
        date: "December 13, 2026",
        time: "10:00 AM – 1:00 PM",
        venue: "Main Mandap, Swaraj Sanskrutik Bhavan",
        dressCode: "Traditional Ethnic",
        mapUrl: "https://maps.app.goo.gl/gKarbXyyFeRvChTm8"
      },
      {
        id: "reception",
        icon: "🥂",
        title: "Reception",
        date: "December 13, 2026",
        time: "7:00 PM – 11:00 PM",
        venue: "Grand Hall, Swaraj Sanskrutik Bhavan",
        dressCode: "Formal / Cocktail",
        mapUrl: "https://maps.app.goo.gl/gKarbXyyFeRvChTm8"
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
        alt: "Photo 1",
        url: galleryImg1
      },
      {
        id: "gal-2",
        category: "engagement",
        title: "The Ring Exchange",
        alt: "Photo 2",
        url: galleryImg2
      },
      {
        id: "gal-3",
        category: "prewedding",
        title: "Stolen Whispers",
        alt: "Photo 3",
        url: galleryImg3
      },
      {
        id: "gal-4",
        category: "travel",
        title: "Udaipur Lakes",
        alt: "Photo 4",
        url: galleryImg4
      },
      {
        id: "gal-5",
        category: "family",
        title: "Family Celebrations",
        alt: "Photo 5",
        url: galleryImg5
      },
      {
        id: "gal-6",
        category: "engagement",
        title: "Laughter & Lights",
        alt: "Photo 6",
        url: galleryImg6
      },
      {
        id: "gal-7",
        category: "travel",
        title: "Mountain Getaway",
        alt: "Photo 7",
        url: galleryImg7
      },
      {
        id: "gal-8",
        category: "prewedding",
        title: "Royal Palace Walk",
        alt: "Photo 8",
        url: galleryImg8
      },
      {
        id: "gal-9",
        category: "family",
        title: "Blessings & Joy",
        alt: "Photo 9",
        url: galleryImg9
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
    url: "https://maps.app.goo.gl/gKarbXyyFeRvChTm8",
    address: "Satara - Koregaon Rd, Sahakar Nagar, Sangam Mahuli, Maharashtra 415004",
    directionsUrl: "https://maps.app.goo.gl/gKarbXyyFeRvChTm8",
    embedMapUrl: "https://maps.google.com/maps?q=Swaraj+Sanskrutik+Bhavan,+Satara+-+Koregaon+Rd,+Sahakar+Nagar,+Sangam+Mahuli,+Maharashtra+415004&t=&z=15&ie=UTF8&iwloc=&output=embed"
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
    datePlace: "13 December 2026 · Satara, Maharashtra",
    loveNotice: "Made with ♥ for Komal & Tushar · 2026"
  }
};
