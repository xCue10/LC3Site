import { readJSON, SiteSettings } from '@/lib/data';
import ContactForm from './ContactForm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Join LC3',
  description: 'Interested in joining LC3 - Lowcode Cloud Club? Fill out our interest form and we\'ll be in touch!',
};

const defaults: SiteSettings = { recruitingBanner: '', meetingDay: '', meetingTime: '', meetingLocation: '', socialLinks: [], socialLinksLive: false };

export default function ContactPage() {
  const settings = readJSON<SiteSettings>('settings.json', defaults);
  return <ContactForm settings={settings} />;
}
