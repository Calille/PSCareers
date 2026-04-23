import type { Metadata } from 'next';
import { HowItWorks } from '@/components/post-job/HowItWorks';
import { PostJobBottomCta } from '@/components/post-job/PostJobBottomCta';
import { PostJobFormSection } from '@/components/post-job/PostJobFormSection';
import { PostJobHeader } from '@/components/post-job/PostJobHeader';

export const metadata: Metadata = {
  title: 'Post a job',
  description:
    'Tell PS Careers about your vacancy — a consultant will review the brief and publish your role on our public sector job board within 24 hours.',
};

export default function PostAJobPage() {
  return (
    <>
      <PostJobHeader />
      <HowItWorks />
      <PostJobFormSection />
      <PostJobBottomCta />
    </>
  );
}
