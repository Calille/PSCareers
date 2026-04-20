import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Public Sector Careers.',
};

export default function ContactPage() {
  return <ComingSoon title="Contact" />;
}
