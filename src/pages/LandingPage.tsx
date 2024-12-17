import React from 'react';
import { Hero } from '../components/landing/Hero';
import { Navbar } from '../components/shared/Navbar';
import { FeaturesSection } from './landing/FeaturesSection';
import { PricingSection } from './landing/PricingSection';
import { AboutSection } from './landing/AboutSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <PricingSection />
      <AboutSection />
    </div>
  );
};