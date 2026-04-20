import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Our staff',
  description: 'Meet the PS Careers team of public sector recruitment specialists.',
};

export default function StaffPage() {
  return <ComingSoon title="Staff" />;
}
