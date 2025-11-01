'use client';

import React from 'react';
import { Navigation } from '@/components/landing/Navigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TechStackSection } from '@/components/landing/TechStackSection';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="technology">
        <TechStackSection />
      </div>
    </main>
  );
}
