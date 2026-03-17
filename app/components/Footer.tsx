import Link from 'next/link';
import { readJSON, SiteSettings } from '@/lib/data';

function DiscordIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const defaults: SiteSettings = { recruitingBanner: '', meetingDay: '', meetingTime: '', meetingLocation: '' };

export default function Footer() {
  const settings = readJSON<SiteSettings>('settings.json', defaults);

  const socialLinks = [
    settings.discord && { href: settings.discord, icon: <DiscordIcon />, label: 'Discord', color: 'hover:text-indigo-500' },
    settings.github && { href: settings.github, icon: <GithubIcon />, label: 'GitHub', color: 'hover:text-slate-900 dark:hover:text-white' },
    settings.linkedin && { href: settings.linkedin, icon: <LinkedInIcon />, label: 'LinkedIn', color: 'hover:text-blue-600' },
  ].filter(Boolean) as { href: string; icon: React.ReactNode; label: string; color: string }[];

  return (
    <footer className="border-t border-slate-200 bg-white mt-auto dark:border-[#1e2d45] dark:bg-[#0d1424]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs">
                LC3
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">LC3 - Lowcode Cloud Club</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Building the future through code, collaboration, and curiosity.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2">
                {socialLinks.map(({ href, icon, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 ${color} bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 transition-all`}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-medium mb-3 text-sm">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/members', label: 'Members' },
                { href: '/events', label: 'Events' },
                { href: '/contact', label: 'Join Us' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-medium mb-3 text-sm">Get Involved</h3>
            <p className="text-slate-500 text-sm mb-3">
              Interested in joining? Fill out our interest form and we&apos;ll reach out!
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Apply to Join
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-[#1e2d45] mt-8 pt-6 text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} LC3 - Lowcode Cloud Club. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
