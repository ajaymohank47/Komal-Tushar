import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
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
import Registry from './components/Registry';
import Guestbook from './components/Guestbook';
import Footer from './components/Footer';
import AdminDashboardModal from './components/AdminDashboardModal';

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

        {/* 10. Gift Registry (id: registry) */}
        <Registry />

        {/* 11. Guest Book (id: guestbook) */}
        <Guestbook />
      </main>

      {/* 12. Footer */}
      <Footer />

      {/* Global Modals */}
      <AdminDashboardModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WeddingApp />
    </AuthProvider>
  );
}
