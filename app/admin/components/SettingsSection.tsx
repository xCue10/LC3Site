import { useState } from 'react';
import type { Stats, SiteSettings, FooterContent } from '@/lib/types';
import { Save, Shield, Settings, Info } from 'lucide-react';

interface SettingsSectionProps {
  stats: Stats;
  settings: SiteSettings;
  footer: FooterContent;
  onSaveStats: (stats: Stats) => Promise<void>;
  onSaveSettings: (settings: SiteSettings) => Promise<void>;
  onSaveFooter: (footer: FooterContent) => Promise<void>;
}

export default function SettingsSection({ stats, settings, footer, onSaveStats, onSaveSettings, onSaveFooter }: SettingsSectionProps) {
  const [localStats, setLocalStats] = useState(stats);
  const [localSettings, setLocalSettings] = useState(settings);
  const [localFooter, setLocalFooter] = useState(footer);

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-white font-bold">
            <Info className="w-5 h-5 text-violet-400" />
            <h3>Club Statistics</h3>
          </div>
          <button onClick={() => onSaveStats(localStats)} className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm transition-colors">
            <Save className="w-4 h-4" /> Save Stats
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Members', key: 'activeMembers' },
            { label: 'Events Hosted', key: 'eventsHosted' },
            { label: 'Projects Built', key: 'projectsBuilt' },
            { label: 'Years Active', key: 'yearsActive' },
          ].map((s) => (
            <div key={s.key} className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</label>
              <input
                type="text"
                value={(localStats as any)[s.key]}
                onChange={(e) => setLocalStats({ ...localStats, [s.key]: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-white font-bold">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3>General Site Settings</h3>
          </div>
          <button onClick={() => onSaveSettings(localSettings)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recruiting Banner (Header)</label>
            <input
              type="text"
              value={localSettings.recruitingBanner}
              onChange={(e) => setLocalSettings({ ...localSettings, recruitingBanner: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Join LC3 for the Spring 2026 Semester!"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Meeting Day</label>
              <input type="text" value={localSettings.meetingDay} onChange={(e) => setLocalSettings({ ...localSettings, meetingDay: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Meeting Time</label>
              <input type="text" value={localSettings.meetingTime} onChange={(e) => setLocalSettings({ ...localSettings, meetingTime: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Meeting Location</label>
              <input type="text" value={localSettings.meetingLocation} onChange={(e) => setLocalSettings({ ...localSettings, meetingLocation: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <div>
              <p className="text-sm font-bold text-slate-200">Member Spotlight</p>
              <p className="text-xs text-slate-500">Show or hide the rotating member spotlight on the homepage.</p>
            </div>
            <button
              onClick={() => setLocalSettings({ ...localSettings, showSpotlight: !localSettings.showSpotlight })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${localSettings.showSpotlight ? 'bg-violet-600' : 'bg-slate-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${localSettings.showSpotlight ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Settings */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-white font-bold">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3>Footer & Branding</h3>
          </div>
          <button onClick={() => onSaveFooter(localFooter)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors">
            <Save className="w-4 h-4" /> Save Footer
          </button>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Footer Tagline</label>
            <input type="text" value={localFooter.tagline} onChange={(e) => setLocalFooter({ ...localFooter, tagline: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CTA Heading</label>
              <input type="text" value={localFooter.ctaHeading} onChange={(e) => setLocalFooter({ ...localFooter, ctaHeading: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CTA Button Label</label>
              <input type="text" value={localFooter.ctaButtonLabel} onChange={(e) => setLocalFooter({ ...localFooter, ctaButtonLabel: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
