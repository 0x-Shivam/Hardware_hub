"use client";

import { useState, useEffect } from "react";

export default function HardwarePage() {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  // Safely import the web component only on the client

  useEffect(() => {
    import('@google/model-viewer').catch(console.error);
  }, []);

  return (
    <main className="min-h-screen p-10 flex flex-col gap-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto w-full">
        {/* LEFT COLUMN: Media & Controls */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel w-full aspect-[4/3] flex items-center justify-center relative overflow-hidden shadow-2xl">
            
            {viewMode === '3d' ? (
              <model-viewer
                src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                alt="3D Component"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
              ></model-viewer>
            ) : (
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.svg" 
                alt="2D Component" 
                className="w-3/4 h-3/4 object-contain opacity-80"
              />
            )}
          </div>

          <div className="flex gap-4 glass-panel w-fit p-2 rounded-full">
            <button
              onClick={() => setViewMode('2d')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${viewMode === '2d' ? 'glow-active' : 'text-gray-400'}`}
            >
              2D Schematic
            </button>

            <button 
                onClick={() => setViewMode('3d')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${viewMode === '3d' ? 'glow-active' : 'text-gray-400'}`}
            >
              3D Interactive
            </button>
            </div>
        </div>

        {/* RIGHT COLUMN: Info & Specs */}

        <div className="flex flex-col gap-8">
          <div>
            <p className="text-blue-500 font-mono text-sm tracking-widest uppercase mb-2"> Motherboard / System Boards</p>
            <h1 className="text-4xl font-bold tracking-tight text-white">HP EliteDesk Series</h1>
          </div>

          <div className="glass-panel p-8">
            <h3 className="text-xl font-semibold mb-6 text-white border-b border-gray-700 pb-2">Technical Specifications</h3>

            <ul className="flex flex-col gap-4">
              <li className="flex flex-col gap-4">
                <span className="text-gray-400 min-w-[120px]">From Factor</span>
                <span className="font-mono text-gray-200">Proprietary SFF / Microtower</span>
              </li>

            <li className="flex gap-4">
              <span className="text-gray-400 min-w-[120px]">Socket</span>
              <span className="font-mono text-gray-200">LGA 1151</span>

            </li>

            <li className="flex gap-4">
              <span className="text-gray-400 min-w-[120px]">Memory</span>
              <span className="font-mono text-gray-200">DDR4 DIMM (4 Slots) </span>
            </li>
            </ul>
          </div>

          <div className="glass-panel p-8 border-l-4 border-l-blue-500">
            <h3 className="text-lg font-bold mb-3 text-white">Use case & Troubleshooting</h3>

            <p className="text-gray-400 leading-relaxed">Designed specifically for enterprise envirnoment requiring compact footprints. Commonhardware troubleshooting on this board isolting the proprietary power supply connectors and verifying seating of this model if the system triggers beep codes upon boots.</p>
          </div>
        </div>  
      </div>


    </main>
  