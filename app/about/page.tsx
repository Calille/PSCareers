import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Public Sector Careers — our mission, values and people.',
};

export default function AboutPage() {
  return <ComingSoon title="About" />;
}
