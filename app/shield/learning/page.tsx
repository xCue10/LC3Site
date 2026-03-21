'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadUserData } from '@/lib/shield-storage';
import ShieldAppLayout from '@/app/shield/components/ShieldAppLayout';
import { BookOpen, GraduationCap, AlertOctagon, Lightbulb, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

const GLOSSARY = [
  { term: 'XSS (Cross-Site Scripting)', simple: 'When a hacker injects malicious scripts into your website that run on other users\' browsers', technical: 'A web security vulnerability that allows attackers to inject client-side scripts into web pages viewed by other users, bypassing same-origin policy' },
  { term: 'SQL Injection', simple: 'Tricking a database by sneaking malicious code into a search box or form field', technical: 'A code injection technique that exploits security vulnerabilities in an application\'s database layer by inserting malicious SQL statements into input fields' },
  { term: 'CSRF (Cross-Site Request Forgery)', simple: 'When a malicious website tricks your browser into making requests to another website where you\'re logged in', technical: 'An attack that tricks the victim\'s browser into sending authenticated requests to a web application using the victim\'s credentials' },
  { term: 'JWT (JSON Web Token)', simple: 'A digital ID card your app gives to logged-in users, containing their info in an encoded format', technical: 'A compact URL-safe means of representing claims between two parties using a JSON payload signed with HMAC or RSA' },
  { term: 'HTTPS', simple: 'The secure version of HTTP — it encrypts all data between your browser and the website', technical: 'HTTP over TLS/SSL — uses asymmetric and symmetric cryptography to establish encrypted sessions between clients and servers' },
  { term: 'CSP (Content Security Policy)', simple: 'A rule you give browsers that says which scripts and resources are allowed to load on your page', technical: 'An HTTP header that helps detect and mitigate XSS attacks by specifying which dynamic resources are allowed to load' },
  { term: 'HSTS', simple: 'A rule that forces browsers to always use HTTPS, even if someone types just http://', technical: 'HTTP Strict Transport Security — a mechanism allowing web servers to declare they should only be accessed via HTTPS' },
  { term: 'CVE', simple: 'A unique ID number for a known security vulnerability, like a bug report that everyone in the industry can reference', technical: 'Common Vulnerabilities and Exposures — a public dictionary of information security vulnerabilities with unique identifiers' },
  { term: 'Zero-Day', simple: 'A security hole that nobody knew about until hackers found and exploited it — no patch exists yet', technical: 'A software vulnerability unknown to those responsible for patching it, leaving developers zero days to fix it before exploitation' },
  { term: 'OWASP', simple: 'A nonprofit organization that publishes a list of the top 10 most common and dangerous web security mistakes', technical: 'Open Web Application Security Project — an online community producing freely available articles and tools on web application security' },
  { term: 'Penetration Testing', simple: 'Hiring ethical hackers to try to break into your system so you can fix problems before real hackers find them', technical: 'An authorized simulated cyberattack against a computer system to evaluate security and identify exploitable vulnerabilities' },
  { term: 'Social Engineering', simple: 'Manipulating people instead of computers — like tricking someone into revealing their password over the phone', technical: 'Psychological manipulation of people into performing actions or divulging confidential information, exploiting human psychology rather than technical vulnerabilities' },
];

const COURSES = [
  { name: 'Google Cybersecurity Certificate', provider: 'Coursera / Google', level: 'Beginner', duration: '6 months', cost: 'Free trial / $49/mo', desc: 'Comprehensive beginner program covering security fundamentals, tools, and real-world skills.', icon: '🎓', levelColor: '#3b82f6' },
  { name: 'CompTIA Security+', provider: 'CompTIA', level: 'Intermediate', duration: '3-6 months prep', cost: '$392 exam', desc: 'Industry-recognized certification covering network security, threats, cryptography, and security ops.', icon: '🏆', levelColor: '#22c55e' },
  { name: 'TryHackMe', provider: 'TryHackMe', level: 'Beginner → Advanced', duration: 'Self-paced', cost: 'Free / $14/mo', desc: 'Hands-on cybersecurity training through guided rooms and real hacking labs. Perfect for beginners.', icon: '🔓', levelColor: '#ef4444' },
  { name: 'OWASP Testing Guide', provider: 'OWASP', level: 'Intermediate', duration: 'Reference guide', cost: 'Free', desc: 'The definitive guide for testing web application security, covering all OWASP Top 10 vulnerabilities.', icon: '📋', levelColor: '#f97316' },
  { name: 'Hack The Box', provider: 'Hack The Box', level: 'Intermediate → Expert', duration: 'Self-paced', cost: 'Free / $14/mo', desc: 'Real hacking challenges and vulnerable machines to practice penetration testing skills.', icon: '💻', levelColor: '#8b5cf6' },
  { name: 'SANS SEC401', provider: 'SANS Institute', level: 'Intermediate', duration: '5 days', cost: '$5,500+', desc: 'Security Essentials — intensive training for those serious about a security career.', icon: '🏛️', levelColor: '#6b7280' },
];

const BREACH_STORIES = [
  { company: 'Equifax (2017)', vulnerability: 'Unpatched Apache Struts', impact: '147 million Americans\' SSNs, DOBs, addresses stolen', lesson: 'Always update your dependencies. A known vulnerability sat unpatched for months.', category: 'Vulnerable Components' },
  { company: 'British Airways (2018)', vulnerability: 'Malicious JavaScript via XSS', impact: '500,000 customers\' payment data stolen', lesson: 'Content-Security-Policy headers would have blocked the injected script.', category: 'XSS / Injection' },
  { company: 'RockYou (2009)', vulnerability: 'SQL Injection + Plaintext Passwords', impact: '32 million passwords exposed (still used in attacks today)', lesson: 'Parameterized queries + password hashing are non-negotiable.', category: 'SQL Injection / Crypto Failures' },
  { company: 'Toyota GitHub (2022)', vulnerability: 'Hard-coded credentials in GitHub', impact: '296,000 customer records exposed', lesson: 'Never commit credentials to GitHub — use environment variables.', category: 'Exposed Secrets' },
  { company: 'Uber (2022)', vulnerability: 'Social Engineering + MFA Bypass', impact: 'Full system access, 57M users affected', lesson: 'MFA alone isn\'t enough — train employees on social engineering.', category: 'Authentication Failures' },
];

const DAILY_TIPS = [
  'Use a password manager — generate unique, strong passwords for every service.',
  'Enable 2FA (Two-Factor Authentication) on all important accounts immediately.',
  'Run `npm audit` weekly to catch vulnerable packages before attackers do.',
  'Test your security headers after any server changes.',
  'Store secrets in environment variables, never in code files.',
  'Set up automatic dependency updates with Dependabot or Renovate.',
  'Never use the same password twice — a breach on site A becomes a breach on site B.',
  'Add rate limiting to your API endpoints to prevent brute force attacks.',
];

type Section = 'glossary' | 'courses' | 'breaches' | 'tips';

const TABS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'glossary', label: 'Glossary', icon: BookOpen },
  { id: 'courses', label: 'Courses', icon: GraduationCap },
  { id: 'breaches', label: 'Breach Stories', icon: AlertOctagon },
  { id: 'tips', label: 'Tips', icon: Lightbulb },
];

export default function LearningPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'beginner' | 'advanced'>('beginner');
  const [activeSection, setActiveSection] = useState<Section>('glossary');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = loadUserData();
    if (!data) { router.push('/shield/login'); return; }
    setMode(data.mode);
    setLoading(false);
  }, [router]);

  if (loading) return (
    <ShieldAppLayout>
      <div className="flex items-center justify-center" style={{ height: '80vh' }}>
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    </ShieldAppLayout>
  );

  const filteredGlossary = GLOSSARY.filter(
    g => g.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.simple.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ShieldAppLayout>
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: '-0.03em' }}>Learning Center</h1>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>
            Security glossary, recommended courses, real breach stories, and daily tips.
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto"
          style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => { setActiveSection(id); setSearchTerm(''); setExpandedTerm(null); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                style={{
                  background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                  color: active ? '#60a5fa' : '#475569',
                  border: active ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                  fontSize: '13px',
                  fontWeight: active ? 600 : 400,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            );
          })}
        </div>

        {/* GLOSSARY */}
        {activeSection === 'glossary' && (
          <div className="space-y-2">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search security terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  background: '#111827',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: '#f1f5f9',
                  fontSize: '14px',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(59,130,246,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.08)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            {filteredGlossary.map(({ term, simple, technical }) => {
              const expanded = expandedTerm === term;
              return (
                <div
                  key={term}
                  className="rounded-xl overflow-hidden"
                  style={{ background: '#111827', border: `1px solid ${expanded ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.07)'}` }}
                >
                  <button
                    className="w-full flex items-center justify-between p-4 text-left"
                    onClick={() => setExpandedTerm(expanded ? null : term)}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 600, color: expanded ? '#60a5fa' : '#94a3b8' }}>{term}</span>
                    {expanded
                      ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: '#60a5fa' }} />
                      : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#64748b' }} />
                    }
                  </button>
                  {expanded && (
                    <div className="px-4 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <p className="pt-3" style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.7' }}>
                        {mode === 'beginner' ? simple : technical}
                      </p>
                      {mode === 'beginner' && (
                        <p className="mt-2 text-[12px] italic" style={{ color: '#64748b' }}>
                          Technical: {technical}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* COURSES */}
        {activeSection === 'courses' && (
          <div className="grid md:grid-cols-2 gap-3">
            {COURSES.map(({ name, provider, level, duration, cost, desc, icon, levelColor }) => (
              <div
                key={name}
                className="rounded-xl p-5"
                style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <h3 className="font-semibold text-white" style={{ fontSize: '14px' }}>{name}</h3>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{provider}</div>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '12px' }}>{desc}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                    style={{ background: `${levelColor}15`, color: levelColor, border: `1px solid ${levelColor}25` }}>
                    {level}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px]"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {duration}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px]"
                    style={{ background: 'rgba(34,197,94,0.08)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.15)' }}>
                    {cost}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BREACH STORIES */}
        {activeSection === 'breaches' && (
          <div className="space-y-3">
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
              Real breaches caused by the same vulnerabilities you&apos;re scanning for.
            </p>
            {BREACH_STORIES.map(({ company, vulnerability, impact, lesson, category }) => (
              <div
                key={company}
                className="rounded-xl p-5"
                style={{ background: '#111827', border: '1px solid rgba(239,68,68,0.12)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white" style={{ fontSize: '14px' }}>{company}</h3>
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ml-3"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    {category}
                  </span>
                </div>
                <div className="space-y-1.5 text-[13px]">
                  <div><span style={{ color: '#94a3b8' }}>Vulnerability: </span><span style={{ color: '#fb923c' }}>{vulnerability}</span></div>
                  <div><span style={{ color: '#94a3b8' }}>Impact: </span><span style={{ color: '#f87171' }}>{impact}</span></div>
                  <div
                    className="p-3 rounded-lg mt-3"
                    style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.12)' }}
                  >
                    <span style={{ color: '#22c55e', fontWeight: 600 }}>Lesson: </span>
                    <span style={{ color: '#64748b' }}>{lesson}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TIPS */}
        {activeSection === 'tips' && (
          <div className="grid gap-2">
            {DAILY_TIPS.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)', color: '#60a5fa', fontSize: '12px', marginTop: '1px' }}
                >
                  {i + 1}
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.7' }}>{tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ShieldAppLayout>
  );
}
