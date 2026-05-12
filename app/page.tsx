import { Hero } from '@/components/home/Hero';
import { WhoWhatWhy } from '@/components/home/WhoWhatWhy';
import { TrustSection } from '@/components/home/TrustSection';
import { SectorsSection } from '@/components/home/SectorsSection';
import { StaffSection } from '@/components/home/StaffSection';
import { RegisterCta } from '@/components/home/RegisterCta';

// Section order matters (Phase 7):
//   Hero → Who/What/Why → Why PS Careers → Our Expertise (sectors)
//   → Available talent (candidate preview) → Register CTA
export default function HomePage() {
  return (
    <>
      <Hero />
      <WhoWhatWhy />
      <TrustSection />
      <SectorsSection />
      <StaffSection />
      <RegisterCta />
    </>
  );
}
