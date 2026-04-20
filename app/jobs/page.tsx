import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Job search',
  description: 'Search specialist public sector jobs across the UK.',
};

export default function JobsPage() {
  return (
    <ComingSoon
      title="Job search"
      intro="The full job search experience is coming next — including filters, saved searches and applications."
    />
  );
}
