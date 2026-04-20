import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Post a job',
  description: 'Work with PS Careers to fill roles in your public sector team.',
};

export default function PostAJobPage() {
  return <ComingSoon title="Post a job" />;
}
