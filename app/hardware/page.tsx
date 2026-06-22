"use client";

import React, { useState, useEffect } from 'react';

// Using a mock Supabase client for demonstration
const supabase = {
  from: (table: string) => ({
    select: (query: string) => ({
      eq: (column: string, val: any) => ({
        single: async () => ({
          data: {
            name: "Arduino Uno",
            specs: { "Microcontroller": "ATmega328P", "Clock Speed": "16 MHz", "Operating Voltage": "5V" },
            model_url: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
            categories: { name: "Microcontrollers" },
            description: "An open-source electronics platform based on easy-to-use hardware and software."
          },
          error: null
        })
      })
    })
  })
};

export default function HardwarePage() {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  const [hardware, setHardware] = useState<any>(null);

  useEffect(() => {
    // Inject model-viewer script via CDN
    const script = document.createElement('script');
    script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js";
    script.type = "module";
    document.head.appendChild(script);

    const fetchHardware = async () => {
      const { data, error } = await supabase
        .from('hardware')
        .select('name, specs, model_url, categories(name)')
        .eq('id', 1)
        .single();
        
      if (error) console.error("Supabase Error:", error);
      setHardware(data);
    };
    
    fetchHardware();
  }, []);

  if (!hardware) return <div className="min-h-screen bg-[#070707] text-[#777] p-20 font-mono">INITIALIZING_SYSTEM...</div>;

  return (
    <main className="min-h-screen bg-[#070707] text-[#E5E5E5] font-sans selection:bg-[#E5E5E5] selection:text-[#070707]">
      
      <nav className="flex justify-between items-center px-6 py-5 border-b border-[#222]">
        <a href="/" className="text-xs uppercase tracking-[0.3em] font-mono text-[#777] hover:text-[#E5E5E5]">Back.Archive</a>
        <div className="text-xs uppercase tracking-[0.3em] font-mono text-[#E5E5E5]">Component.Detail</div>
      </nav>

      <div className="max-w-[90rem] mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-16">
        
        {/* SELECTED MEDIA AREA */}
        <section className="flex flex-col gap-6">
          <div className="w-full aspect-[4/3] lg:aspect-[16/10] border border-[#222] bg-[#0a0a0a] relative flex items-center justify-center overflow-hidden">
            {viewMode === '3d' ? (
              React.createElement('model-viewer', {
                src: hardware.model_url,
                'camera-controls': true,
                'auto-rotate': true,
                'shadow-intensity': '1',
                className: 'w-full h-full',
                crossOrigin: 'anonymous',
                style: { width: '100%', height: '100%' },
                onError: (e: any) => console.error('Model Viewer Error:', e)
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[#333] font-mono text-sm uppercase tracking-widest">
                <svg className="w-16 h-16 mb-4 fill-[#222]" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15l3.5-4.5 2.5 3.01L14.5 9l4.5 6H5z"/></svg>
                [ 2D.SCHEMATIC ]
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('2d')}
              className={`flex-1 py-4 border font-mono text-xs uppercase tracking-[0.2em] transition-all ${viewMode === '2d' ? 'bg-[#E5E5E5] text-[#070707]' : 'border-[#222] text-[#777] hover:border-[#E5E5E5]'}`}
            >
              2D View
            </button>
            <button 
              onClick={() => setViewMode('3d')}
              className={`flex-1 py-4 border font-mono text-xs uppercase tracking-[0.2em] transition-all ${viewMode === '3d' ? 'bg-[#E5E5E5] text-[#070707]' : 'border-[#222] text-[#777] hover:border-[#E5E5E5]'}`}
            >
              3D Model
            </button>
          </div>
        </section>

        {/* INFO SECTION */}
        <section className="flex flex-col gap-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#555] mb-4">{hardware.categories?.name || 'Hardware'}</p>
            <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-none">{hardware.name}</h1>
          </div>

          <div className="specs-container flex flex-col gap-6 relative pl-6 border-l border-[#222]">
            {hardware.specs && Object.entries(hardware.specs).map(([key, value]) => (
              <div key={key} className="relative flex items-center gap-6">
                <span className="absolute -left-[25px] w-4 h-[1px] bg-[#222]"></span>
                <span className="text-[#777] text-sm font-medium uppercase tracking-wide min-w-[150px]">{key}</span>
                <span className="text-[#E5E5E5] font-mono text-sm">{String(value)}</span>
              </div>
            ))}
          </div>

          <div className="p-8 border border-[#222] bg-[#0a0a0a]">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#555] mb-4">Description</h3>
            <p className="text-[#888] text-sm leading-relaxed uppercase tracking-wide">
              {hardware.description || "No detailed technical description provided for this specific component entry."}
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}