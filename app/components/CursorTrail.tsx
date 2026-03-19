'use client';
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  created: number;
  size: number;
}

const MAX = 14;
const LIFE = 650;
const THROTTLE_MS = 32;

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only run on pointer/mouse devices
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    let lastAdd = 0;
    let raf = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastAdd < THROTTLE_MS) return;
      lastAdd = now;
      particles.push({ x: e.clientX, y: e.clientY, created: now, size: Math.random() * 2.5 + 1.5 });
      if (particles.length > MAX) particles.shift();
    };
    window.addEventListener('mousemove', onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = now - p.created;
        if (age >= LIFE) { particles.splice(i, 1); continue; }
        const life = age / LIFE;
        const alpha = (1 - life) * 0.42;
        const r = p.size * (1 - life * 0.35);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
        g.addColorStop(0, `rgba(167,139,250,${alpha})`);   // violet-400
        g.addColorStop(0.45, `rgba(96,165,250,${alpha * 0.6})`); // blue-400
        g.addColorStop(1, 'rgba(96,165,250,0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9998]"
      aria-hidden="true"
    />
  );
}
