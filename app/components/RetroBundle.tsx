'use client';

import dynamic from 'next/dynamic';

const RetroDesktop = dynamic(() => import('./RetroDesktop'), { ssr: false });
const AIMBuddy     = dynamic(() => import('./AIMBuddy'),     { ssr: false });
const Clippy       = dynamic(() => import('./Clippy'),       { ssr: false });
const RetroMusic   = dynamic(() => import('./RetroMusic'),   { ssr: false });
const TimeMachine  = dynamic(() => import('./TimeMachine'),  { ssr: false });

export default function RetroBundle() {
  return (
    <>
      <RetroDesktop />
      <AIMBuddy />
      <Clippy />
      <RetroMusic />
      <TimeMachine />
    </>
  );
}
