import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Register your interest',
  description: 'Register as a candidate or employer with Public Sector Careers.',
};

export default function RegisterPage() {
  return <ComingSoon title="Register" />;
}
