import type { Metadata } from 'next';
import { AboutCta } from '@/components/about/AboutCta';
import { AboutHero } from '@/components/about/AboutHero';
import { AboutStats } from '@/components/about/AboutStats';
import { AboutStory } from '@/components/about/AboutStory';
import { AboutValues } from '@/components/about/AboutValues';

export const metadata: Metadata = {
  title: 'About us',
  description:
    'Public Sector Careers is a UK recruitment specialist for councils, government agencies, the NHS and public sector bodies.',
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutStats />
      <AboutCta />
    </>
  );
}
