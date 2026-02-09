'use client';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import Offers from '../components/Offers';
import StoreView from '../components/StoreView';
import Cta from '../components/Cta';
import Footer from '../components/Footer';
import Section from '../components/Section';
import StoreMapBanner from '../components/StoreMapBanner';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50">
      <Navbar />
      <Hero />
      <Categories />
      <Offers />
      <StoreView />
      <Section
        title="Top Searched This Week"
        subtitle="Items everyone is looking for"
        type="featured"
      />
      <Section
        title="Featured Essentials"
        subtitle="Handpicked items for your daily needs"
        type="featured"
      />
      <StoreMapBanner />
      <Testimonials />
      <Cta />
      <Footer />
    </div>
  );
}
