"use client";

import { useState } from 'react';

// Mock Supabase client to avoid module resolution errors in the sandbox environment.
// In your actual production project, replace this with: 
// import { supabase } from '@/lib/supabase';
const supabase = {
  from: (table: string) => ({
    insert: (data: any) => ({
      then: (callback: any) => callback({ data: null, error: null })
    }),
    storage: {
      from: (bucket: string) => ({
        upload: (name: string, file: any) => ({
          then: (callback: any) => callback({ data: null, error: null })
        }),
        getPublicUrl: (name: string) => ({ data: { publicUrl: 'https://example.com/image.jpg' } })
      })
    }
  }),
  storage: {
    from: (bucket: string) => ({
      upload: async (name: string, file: any) => ({ data: null, error: null }),
      getPublicUrl: (name: string) => ({ data: { publicUrl: 'https://example.com/image.jpg' } })
    })
  }
};

export default function AdminPage() {
  const [formData, setFormData] = useState({ name: '', model_url: '', specs: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert("Please select a 2D image first");

    try {
      // 1. Upload image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hardware-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('hardware-images')
        .getPublicUrl(fileName);

      // 3. Save to Database
      const { error: dbError } = await supabase
        .from('hardware')
        .insert([{ 
          name: formData.name, 
          model_url: formData.model_url, 
          image_2d_url: publicUrl,
          specs: JSON.parse(formData.specs)
        }]);

      if (dbError) throw dbError;
      alert("Hardware + Image added successfully!");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#070707] text-[#E5E5E5] p-10 font-mono">
      <h1 className="text-3xl mb-10">ADMIN.ENTRY_POINT</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
        <input 
          placeholder="Hardware Name" 
          className="bg-[#111] p-3 border border-[#222]"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input 
          placeholder="Model URL (GLB Link)" 
          className="bg-[#111] p-3 border border-[#222]"
          onChange={(e) => setFormData({...formData, model_url: e.target.value})}
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
          className="bg-[#111] p-3 border border-[#222]"
        />
        <textarea 
          placeholder='Specs JSON (e.g. {"Voltage": "5V"})' 
          className="bg-[#111] p-3 border border-[#222] h-32"
          onChange={(e) => setFormData({...formData, specs: e.target.value})}
        />
        <button type="submit" className="bg-[#E5E5E5] text-[#070707] py-3 font-bold uppercase">
          Commit to Database
        </button>
      </form>
    </main>
  );
}