"use client";

import { useEffect, useRef } from 'react';

// --- VISCOUS LIQUID CURSOR COMPONENT ---
function LiquidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Create an array of points to act as the "spine" of our liquid trail
  const points = useRef(Array.from({ length: 35 }, () => ({ x: 0, y: 0 })));
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
    window.addEventListener('resize', updateSize);
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

    window.addEventListener('mousemove', onMouseMove);
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
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.4;
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.4;
      }

      if (hasMoved.current) {
        for (let i = 0; i < pts.length; i++) {
          ctx.beginPath();
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
      
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 mix-blend-difference"
        style={{ filter: 'url(#gooey)' }}
      />
    </>
  );
}

// --- MAIN PAGE LAYOUT ---
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#070707] text-[#E5E5E5] font-sans selection:bg-[#E5E5E5] selection:text-[#070707] relative flex flex-col justify-between">
      
      <LiquidCursor />

      <div 
        className="pointer-events-none fixed inset-0 z-40 h-full w-full opacity-[0.03]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>

      <nav className="flex justify-between items-center px-6 py-5 border-b border-[#222] relative z-10">
        <div className="text-xs uppercase tracking-[0.3em] font-mono text-[#777]">System.Index</div>
        <div className="flex gap-4">
          <span className="w-2 h-2 rounded-full bg-[#E5E5E5] animate-pulse"></span>
          <div className="text-xs uppercase tracking-[0.3em] font-mono text-[#E5E5E5]">Active</div>
        </div>
      </nav>

      <div className="px-6 py-12 md:py-24 flex flex-col justify-center flex-grow relative overflow-hidden z-10">
        <h1 className="text-[14vw] leading-[0.8] font-bold tracking-tighter uppercase text-[#E5E5E5] relative">
          Silicon
        </h1>
        <h1 className="text-[14vw] leading-[0.8] font-bold tracking-tighter uppercase text-transparent [-webkit-text-stroke:2px_#333] hover:[-webkit-text-stroke:2px_#E5E5E5] transition-all duration-700 relative cursor-default">
          Archive
        </h1>
        
        <p className="max-w-md mt-10 text-[#888] text-sm md:text-base font-medium leading-relaxed tracking-wide uppercase relative">
          The definitive database for hardware architecture. Deep-dive specifications, block diagrams, and interactive 3D models.
        </p>
      </div>

      <div className="px-6 py-8 md:py-12 border-y border-[#222] bg-[#0a0a0a] relative z-10">
        <div className="flex items-center group max-w-7xl">
          <span className="text-2xl md:text-5xl mr-6 text-[#333] group-focus-within:text-[#E5E5E5] transition-colors duration-500 font-light">/</span>
          <input 
            type="text" 
            placeholder="ENTER COMPONENT QUERY..." 
            className="w-full bg-transparent text-2xl md:text-6xl font-bold uppercase tracking-tighter outline-none placeholder:text-[#222] text-[#E5E5E5] transition-all"
          />
          <a href="/hardware" className="hidden md:block">
            <button className="ml-6 px-8 py-4 border border-[#333] text-[#E5E5E5] text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#E5E5E5] hover:text-[#070707] transition-all duration-500">
              Execute
            </button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#222] relative z-10">
        <a href="/hardware" className="p-8 md:p-12 flex flex-col justify-between group hover:bg-[#E5E5E5] hover:text-[#070707] transition-colors duration-700 min-h-[300px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono tracking-widest text-[#555] group-hover:text-[#070707] transition-colors">01</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </div>
          <div className="mt-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter mb-4">Core Compute</h2>
            <p className="text-sm font-medium text-[#777] group-hover:text-[#333] transition-colors uppercase tracking-wide leading-relaxed">
              Processors, GPUs, motherboards, and system RAM architecture.
            </p>
          </div>
        </a>

        <a href="/hardware" className="p-8 md:p-12 flex flex-col justify-between group hover:bg-[#E5E5E5] hover:text-[#070707] transition-colors duration-700 min-h-[300px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono tracking-widest text-[#555] group-hover:text-[#070707] transition-colors">02</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </div>
          <div className="mt-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter mb-4">Maker & Embed</h2>
            <p className="text-sm font-medium text-[#777] group-hover:text-[#333] transition-colors uppercase tracking-wide leading-relaxed">
              Microcontrollers, SBCs, sensors, and physical actuators.
            </p>
          </div>
        </a>

        <a href="/hardware" className="p-8 md:p-12 flex flex-col justify-between group hover:bg-[#E5E5E5] hover:text-[#070707] transition-colors duration-700 min-h-[300px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono tracking-widest text-[#555] group-hover:text-[#070707] transition-colors">03</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </div>
          <div className="mt-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter mb-4">Deep Tech</h2>
            <p className="text-sm font-medium text-[#777] group-hover:text-[#333] transition-colors uppercase tracking-wide leading-relaxed">
              Logic gates, FPGAs, ASICs, and bare silicon topologies.
            </p>
          </div>
        </a>

      </div>
    </main>
  );
}