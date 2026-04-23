import type { Metadata } from 'next';
import { RegisterFormSection } from '@/components/register/RegisterFormSection';
import { RegisterHeader } from '@/components/register/RegisterHeader';
import { resolveRegisterType } from '@/lib/registerForm';

export const metadata: Metadata = {
  title: 'Register your interest',
  description:
    'Register as a candidate or employer with Public Sector Careers — a consultant will be in touch within 24 hours.',
};

interface RegisterPageProps {
  searchParams?: { type?: string | string[]; as?: string | string[] };
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  const initialType = resolveRegisterType(searchParams);
  return (
    <>
      <RegisterHeader />
      <RegisterFormSection initialType={initialType} />
    </>
  );
}
