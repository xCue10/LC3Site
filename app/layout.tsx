import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CursorTrail from "./components/CursorTrail";
import AnnouncementBanner from "./components/AnnouncementBanner";
import RetroMusic from "./components/RetroMusic";

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
  openGraph: {
    type: 'website',
    siteName: 'LC3 - Lowcode Cloud Club',
    title: 'LC3 - Lowcode Cloud Club',
    description: 'Building the future through code, collaboration, and curiosity.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LC3 - Lowcode Cloud Club',
    description: 'Building the future through code, collaboration, and curiosity.',
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
            __html: `try{const r=localStorage.getItem('lc3-retro')==='true';const d=localStorage.getItem('lc3-dark')==='true'||localStorage.getItem('lc3-theme')==='dark';if(r)document.documentElement.classList.add('retro');else if(d)document.documentElement.classList.add('dark');}catch{}`,
          }}
        />
        <CursorTrail />
        <AnnouncementBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <RetroMusic />
      </body>
    </html>
  );
}
