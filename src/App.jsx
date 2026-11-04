import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ImageProvider } from './contexts/ImageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FallingPetals from './components/FallingPetals';

import Story from './components/Story';
import Family from './components/Family';
import Events from './components/Events';
import Gallery from './components/Gallery';
import Venue from './components/Venue';
import RSVP from './components/RSVP';
import WeddingGifts from './components/WeddingGifts';
import Footer from './components/Footer';
import AdminDashboardModal from './components/AdminDashboardModal';
import Admin from './pages/Admin';

function WeddingApp() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf6ee] text-espresso-text relative selection:bg-gold-500/30 selection:text-gold-800">
      {/* Falling petals overlay — fixed, covers full viewport, no pointer events */}
      <FallingPetals />
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />
      
      <main>
        {/* 1. Hero */}
        <Hero />



        {/* 3. Our Story (id: story) */}
        <Story />

        {/* 4. Families (id: family) */}
        <Family />

        {/* 5. Events (id: events) */}
        <Events />

        {/* 6. Gallery (id: gallery) */}
        <Gallery />

        {/* 7. Venue (id: venue) */}
        <Venue />

        {/* 8. RSVP (id: rsvp) */}
        <RSVP />

        {/* 9. Wedding Gifts (id: gifts) */}
        <WeddingGifts />
      </main>

      {/* 12. Footer */}
      <Footer />

      {/* Global Modals */}
      <AdminDashboardModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}

export default function App() {
  // Hidden /admin route — supports both /admin and /admin/
  const isAdmin =
    typeof window !== 'undefined' &&
    (window.location.pathname.replace(/\/+$/, '') === '/admin');

  return (
    <AuthProvider>
      <ImageProvider>
        {isAdmin ? <Admin /> : <WeddingApp />}
      </ImageProvider>
    </AuthProvider>
  );
}
