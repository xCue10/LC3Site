import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P, Bebas_Neue } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CursorTrail from "./components/CursorTrail";
import AnnouncementBanner from "./components/AnnouncementBanner";
import ScrollToTop from "./components/ScrollToTop";

// Retro components — deferred so their JS doesn't block the initial page load
// for the ~99% of visits where retro mode is never activated
const RetroDesktop = dynamic(() => import("./components/RetroDesktop"), { ssr: false });
const AIMBuddy     = dynamic(() => import("./components/AIMBuddy"),     { ssr: false });
const Clippy       = dynamic(() => import("./components/Clippy"),       { ssr: false });
const RetroMusic   = dynamic(() => import("./components/RetroMusic"),   { ssr: false });
const TimeMachine  = dynamic(() => import("./components/TimeMachine"),  { ssr: false });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-retro",
  weight: "400",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-vice",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://lc3.up.railway.app'),
  title: {
    default: 'LC3 - Lowcode Cloud Club',
    template: '%s | LC3',
  },
  description: 'LC3 is a student tech club at the College of Southern Nevada focused on low-code platforms, cloud computing, and real-world software projects. Join us to build, learn, and connect.',
  keywords: ['LC3', 'Lowcode Cloud Club', 'tech club', 'Power Platform', 'Azure', 'student club', 'software development', 'College of Southern Nevada', 'CSN'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'LC3 - Lowcode Cloud Club',
    title: 'LC3 - Lowcode Cloud Club',
    description: 'Building the future through code, collaboration, and curiosity.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'LC3 - Lowcode Cloud Club',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LC3 - Lowcode Cloud Club',
    description: 'Building the future through code, collaboration, and curiosity.',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} ${bebasNeue.variable} antialiased min-h-screen flex flex-col`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const r=localStorage.getItem('lc3-retro')==='true';const saved=localStorage.getItem('lc3-dark')??localStorage.getItem('lc3-theme');const d=saved!==null?saved==='true'||saved==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(r)document.documentElement.classList.add('retro');else if(d)document.documentElement.classList.add('dark');}catch{}`,
          }}
        />
        <CursorTrail />
        <div id="monitor-frame" className="flex-1 flex flex-col">
          <div id="site-wrapper" className="flex-1 flex flex-col">
            <AnnouncementBanner />
            <Navbar />
            <div id="retro-marquee" aria-hidden="true">
              <span>⭐ WELCOME TO THE LC3 CLUB HOMEPAGE ⭐ &nbsp; Please sign our Guestbook! &nbsp; ⭐ &nbsp; Best viewed at 800×600 in Internet Explorer 6.0 &nbsp; ⭐ &nbsp; Meetings every Tuesday @ 6pm Room B-101 &nbsp; ⭐ &nbsp; AIM: LC3ClubCSN &nbsp; ⭐ &nbsp; ICQ: #31337420 &nbsp; ⭐ &nbsp; 🚧 &nbsp; SITE UNDER CONSTRUCTION &nbsp; 🚧 &nbsp; ⭐ &nbsp; New members welcome! &nbsp; ⭐ &nbsp; Low-Code &amp; Cloud Computing Club &nbsp; ⭐ &nbsp; College of Southern Nevada &nbsp; ⭐ &nbsp; Email: lc3club@hotmail.com &nbsp; ⭐ &nbsp;</span>
            </div>
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </div>
        <RetroDesktop />
        <AIMBuddy />
        <Clippy />
        <ScrollToTop />
        <RetroMusic />
        <TimeMachine />
      </body>
    </html>
  );
}
