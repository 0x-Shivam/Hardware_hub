"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function HardwarePage() {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  const [hardware, setHardware] = useState<any>(null);

  useEffect(() => {
    // 1. Load the 3D viewer
    import('@google/model-viewer').catch(console.error);

    // 2. Fetch the database data
    const fetchHardware = async () => {
      const { data, error } = await supabase
        .from('hardware')
        .select('name, specs, model_url, categories(name)')
        .eq('id', 1)
        .single();
        
      // Log any database errors to the browser console
      if (error) {
        console.error("Supabase Error:", error);
      }
      
      setHardware(data);
    };
    
    fetchHardware();
  }, []);

  // Show a loading screen while Supabase fetches
  if (!hardware) return <div className="min-h-screen p-10 bg-[#0a0b10] text-white">Loading database... (Check your browser console if this hangs)</div>;

  return (
    <main className="min-h-screen p-10 flex flex-col gap-10 bg-[#0a0b10] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto w-full">
        
        {/* LEFT COLUMN: Media & Controls */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel w-full aspect-[4/3] flex items-center justify-center relative overflow-hidden shadow-2xl bg-[#13151c] bg-opacity-60 border border-gray-700 rounded-2xl">
            
            {viewMode === '3d' ? (
              <model-viewer
                src={hardware.model_url}
                alt="3D Component"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
              ></model-viewer>
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500 font-mono">
                [ 2D Image Placeholder ]
              </div>
            )}
          </div>

          <div className="flex gap-4 glass-panel w-fit p-2 rounded-full border border-gray-700">
            <button 
              onClick={() => setViewMode('2d')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${viewMode === '2d' ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'text-gray-400'}`}
            >
              2D Schematic
            </button>
            <button 
              onClick={() => setViewMode('3d')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${viewMode === '3d' ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'text-gray-400'}`}
            >
              3D Interactive
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Info & Specs */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-blue-500 font-mono text-sm tracking-widest uppercase mb-2">
              {hardware.categories?.name || 'Uncategorized'}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white">{hardware.name}</h1>
          </div>

          <div className="glass-panel p-8 bg-[#13151c] bg-opacity-60 border border-gray-700 rounded-2xl">
            <h3 className="text-xl font-semibold mb-6 text-white border-b border-gray-700 pb-2">Technical Specifications</h3>
            <ul className="flex flex-col gap-4">
              {hardware.specs && Object.entries(hardware.specs).map(([key, value]) => (
                <li key={key} className="flex gap-4">
                  <span className="text-gray-400 min-w-[120px]">{key}</span>
                  <span className="font-mono text-gray-200">{String(value)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </main>
  );
}