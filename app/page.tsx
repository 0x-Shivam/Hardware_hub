"use client";

import { useEffect, useRef } from 'react';

// --- VISCOUS LIQUID CURSOR COMPONENT ---
function LiquidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Create an array of points to act as the "spine" of our liquid trail
  const points = useRef(Array.from({ length: 35 }, () => { x: 0, y: 0 })));
  const mouse = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Handle high-res displays and resizing
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    wimize', updateSize);
    updateSize();

    // Center starting point
    mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    points.current.forEach(p => { p.x = mouse.current.x; p.y = mouse.current.y; });

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      hasMoved.current = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      mouse.current.x = e.touches[0].clientX;
      mouse.current.y = e.touches[0].clientY;
      hasMoved.current = true;
    };

    window.addEventListener
    

    window.addEventListener('touchmove', onTouchMove);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pts = points.current;
      
      // Spring physics for the "head" of the liquid (Viscosity)
      pts[0].x += (mouse.current.x - pts[0].x) * 0.6;
      pts[0].y += (mouse.current.y - pts[0].y) * 0.6;

      // Spring physics for the trailing tail
      for (let i = 1; i < pts.length; i++) {
        pts[i]x += (pts[i - 1].x - pts[i].x) * 0.4;
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.4;
      }

      if (hasMoved.current) {
        for (let i = 0; i < pts.length; i++) {
          ctx.beginPath();
          // The radius tapers off smoothly toward the end of the tail (reduced to 50%)
          const radius = Math.max(0.1, 20 - i * 0.6);
          ctx.arc(pts[i].x, pts[i].y, radius, 0, Math.PI * 2);
          ctx.fillStyle = '#E5E5E5';
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* This hidden SVG filter is the secret to the liquid effect.
        It blurs the canvas circles together, and the ColorMatrix 
        sharpens the alpha channel to simulate water surface tension.
      */}
      <svg className="hidden">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -15" 
              result="gooey" 
            />
            <feBlend in="SourceGraphic" in2="gooey" />
          </filter>
        </defs>
      </svg>
      
      {/* mix-blend-difference makes the liquid invert the colors it hovers over */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 mix-blend-difference"
        style={{ filter: 'url(#gooey)' }}
      />
    </>
  );
}

/ --- MAIN PAGE LAYOUT ---
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#070707] text-[#E5E5E5] font-sans selection:bg-[ selection:text-[#070707] relative flex flex-col justify-between">
      
      {/* Our newly added liquid cursor effect */}
      <LiquidCursor />

      {/* Awwwards Style Film Grain / Noise Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-40 h-full w-full opacity-[0.03]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>

      {/* Top Editorial Nav */}
      <nav className="flex justify-between items-center px-6 py-5 border-b border-[#222] relative z-10">
        <div className="text-xs uppercase tracking-[0.3em] font-mono text-[#777]">System.Index</div>
        <div className="flex gap-4">
          <span className="w-2 h-2 rounded-full bg-[#E5E5E5] animate-pulse"></span>
          <div className="text-xs uppercase tracking-[0.3em] font-mono text-[#E5E5E5]">Active</div>
        </div>
      </nav>


      {/* Massive Brutalist Hero */}