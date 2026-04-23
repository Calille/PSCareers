import type { Metadata } from 'next';
import { ContactFormSection } from '@/components/contact/ContactFormSection';
import { ContactHeader } from '@/components/contact/ContactHeader';
import { ContactMethods } from '@/components/contact/ContactMethods';
import { Faq } from '@/components/contact/Faq';

export const metadata: Metadata = {
  title: 'Contact us',
  description:
    'Get in touch with Public Sector Careers — call us, email us or send a message and a consultant will reply within 24 hours.',
};

export default function ContactPage() {
  return (
    <>
      <ContactHeader />
      <ContactMethods />
      <ContactFormSection />
      <Faq />
    </>
  );
}
