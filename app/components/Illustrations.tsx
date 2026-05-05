import React from 'react';

export const CommunityNetwork = () => (
  <svg width="280" height="260" viewBox="0 0 300 270" className="w-full opacity-85 dark:opacity-75" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="about-cg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25"/>
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="about-lg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1"/>
        <stop offset="100%" stopColor="#0891b2"/>
      </linearGradient>
    </defs>
    <circle cx="150" cy="135" r="65" fill="url(#about-cg)" style={{animation:'about-glow 3s ease-in-out infinite'}}/>
    <line x1="150" y1="135" x2="55" y2="45" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.45" strokeDasharray="5 5" style={{animation:'about-dash 1.8s linear infinite'}}/>
    <line x1="150" y1="135" x2="248" y2="42" stroke="#0891b2" strokeWidth="1" strokeOpacity="0.45" strokeDasharray="5 5" style={{animation:'about-dash 2.1s linear infinite 0.3s'}}/>
    <line x1="150" y1="135" x2="22" y2="155" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="5 5" style={{animation:'about-dash 1.9s linear infinite 0.6s'}}/>
    <line x1="150" y1="135" x2="278" y2="148" stroke="#0891b2" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="5 5" style={{animation:'about-dash 2.3s linear infinite 0.9s'}}/>
    <line x1="150" y1="135" x2="72" y2="238" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="5 5" style={{animation:'about-dash 2.0s linear infinite 1.2s'}}/>
    <line x1="150" y1="135" x2="232" y2="232" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="5 5" style={{animation:'about-dash 2.2s linear infinite 1.5s'}}/>
    <circle cx="55" cy="45" r="20" fill="#6366f1" fillOpacity="0.08" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.5"/>
    <circle cx="248" cy="42" r="22" fill="#0891b2" fillOpacity="0.08" stroke="#0891b2" strokeWidth="1.5" strokeOpacity="0.5"/>
    <circle cx="150" cy="135" r="38" fill="#6366f1" fillOpacity="0.1" stroke="url(#about-lg)" strokeWidth="2"/>
    <text x="150" y="140" textAnchor="middle" fontSize="16" fontWeight="700" fill="#6366f1" fillOpacity="0.9" fontFamily="system-ui, sans-serif" letterSpacing="-0.5">LC3</text>
  </svg>
);

export const LearnBuildLeadPathway = () => (
  <svg width="220" height="205" viewBox="0 0 220 205" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="cta-rg-a" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="cta-line-g" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#6366f1"/>
        <stop offset="100%" stopColor="#0891b2"/>
      </linearGradient>
    </defs>
    <circle cx="45" cy="162" r="30" fill="url(#cta-rg-a)" style={{animation:'cta-pulse 3s ease-in-out infinite'}}/>
    <line x1="63" y1="146" x2="97" y2="112" stroke="url(#cta-line-g)" strokeWidth="1.2" strokeOpacity="0.45" strokeDasharray="4 5" style={{animation:'cta-dash 1.8s linear infinite'}}/>
    <circle cx="113" cy="97" r="32" fill="#818cf8" fillOpacity="0.1" style={{animation:'cta-pulse 3s ease-in-out infinite 1s'}}/>
    <line x1="131" y1="80" x2="160" y2="50" stroke="url(#cta-line-g)" strokeWidth="1.2" strokeOpacity="0.45" strokeDasharray="4 5" style={{animation:'cta-dash 2s linear infinite 0.6s'}}/>
    <circle cx="178" cy="36" r="34" fill="#0891b2" fillOpacity="0.1" style={{animation:'cta-pulse 3s ease-in-out infinite 2s'}}/>
  </svg>
);

export const EventTimeline = () => (
  <svg width="320" height="140" viewBox="0 0 320 140" fill="none" className="opacity-90 dark:opacity-80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ev2-g1" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35"/><stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/></radialGradient>
      <radialGradient id="ev2-g2" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5"/><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/></radialGradient>
    </defs>
    <line x1="48" y1="70" x2="272" y2="70" stroke="rgba(99,102,241,0.45)" strokeWidth="1.5" strokeDasharray="6 6" style={{animation:'ev2-dash 1s linear infinite'}}/>
    <circle cx="160" cy="70" r="30" fill="url(#ev2-g2)"><animate attributeName="r" values="28;34;28" dur="2.5s" repeatCount="indefinite"/></circle>
    <circle cx="160" cy="70" r="7.5" fill="#8b5cf6" style={{animation:'ev2-spark 1.8s ease-in-out infinite'}}/>
  </svg>
);

export const ProjectFlow = () => (
  <svg width="320" height="140" viewBox="0 0 320 140" fill="none" className="opacity-90 dark:opacity-80" xmlns="http://www.w3.org/2000/svg">
    <line x1="70" y1="82" x2="250" y2="82" stroke="rgba(99,102,241,0.45)" strokeWidth="1.5" strokeDasharray="5 5" style={{animation:'proj2-dash 0.9s linear infinite'}}/>
    <path d="M112 82 Q112 48 140 48 L182 48 Q210 48 210 82" stroke="rgba(139,92,246,0.5)" strokeWidth="1" strokeDasharray="4 5" fill="none" style={{animation:'proj2-dash 1.1s linear infinite 0.3s'}}/>
    <g style={{animation:'proj2-rocket 2.2s ease-in-out infinite', transformOrigin:'270px 68px'}}>
      <path d="M270 42 C272 38 278 36 280 36 L276 70 L264 70 L260 56 Z" fill="rgba(34,197,94,0.13)" stroke="rgba(34,197,94,0.6)" strokeWidth="1.3"/>
    </g>
  </svg>
);

export const BlogGraphic = () => (
  <svg width="320" height="140" viewBox="0 0 320 140" fill="none" className="opacity-90 dark:opacity-80" xmlns="http://www.w3.org/2000/svg">
    <line x1="48" y1="70" x2="272" y2="70" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeDasharray="6 6" style={{animation:'ev2-dash 1s linear infinite'}}/>
    <rect x="88" y="36" width="64" height="80" rx="6" fill="rgba(124,58,237,0.07)" stroke="rgba(99,102,241,0.55)" strokeWidth="1.5" style={{animation:'blog-float 3s ease-in-out infinite', transformOrigin:'120px 76px'}}/>
  </svg>
);
