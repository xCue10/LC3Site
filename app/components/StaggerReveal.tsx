'use client';
import { useEffect, useRef, useState, ReactNode, Children } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

export default function StaggerReveal({ children, className = '', stagger = 90 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const items = Children.toArray(children);

  return (
    <div ref={ref} className={className}>
      {items.map((child, i) => (
        <div
          key={i}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(22px)',
            transition: `opacity 0.55s ease-out ${i * stagger}ms, transform 0.55s ease-out ${i * stagger}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
