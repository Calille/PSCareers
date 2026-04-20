import { Hero } from '@/components/home/Hero';
import { TrustSection } from '@/components/home/TrustSection';
import { StaffSection } from '@/components/home/StaffSection';
import { RegisterCta } from '@/components/home/RegisterCta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <StaffSection />
      <RegisterCta />
    </>
  );
}
