import { readJSON, SiteSettings } from '@/lib/data';
import ContactForm from './ContactForm';

export const dynamic = 'force-dynamic';

const defaults: SiteSettings = { recruitingBanner: '', meetingDay: '', meetingTime: '', meetingLocation: '' };

export default function ContactPage() {
  const settings = readJSON<SiteSettings>('settings.json', defaults);
  return <ContactForm settings={settings} />;
}
