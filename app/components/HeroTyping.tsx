'use client';
import { useState, useEffect } from 'react';

const PHRASES = ['low-code solutions', 'cloud technology', 'real projects', 'the future'];
const TYPE_SPEED = 75;
const DELETE_SPEED = 38;
const PAUSE_MS = 2000;

export default function HeroTyping() {
  const [displayed, setDisplayed] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = PHRASES[phraseIndex];

    if (!isDeleting && displayed === current) {
      const t = setTimeout(() => setIsDeleting(true), PAUSE_MS);
      return () => clearTimeout(t);
    }

    if (isDeleting && displayed === '') {
      setIsDeleting(false);
      setPhraseIndex((i) => (i + 1) % PHRASES.length);
      return;
    }

    const speed = isDeleting ? DELETE_SPEED : TYPE_SPEED;
    const t = setTimeout(() => {
      setDisplayed(
        isDeleting
          ? current.slice(0, displayed.length - 1)
          : current.slice(0, displayed.length + 1),
      );
    }, speed);

    return () => clearTimeout(t);
  }, [displayed, isDeleting, phraseIndex]);

  return (
    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-6 min-h-[1.75rem]">
      We&apos;re building{' '}
      <span className="font-semibold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-violet-400">
        {displayed}
      </span>
      <span
        className="inline-block w-[2px] h-[1.1em] bg-violet-500 ml-0.5 align-middle dark:bg-violet-400"
        style={{ animation: 'cursor-blink 1s step-end infinite' }}
      />
    </p>
  );
}
