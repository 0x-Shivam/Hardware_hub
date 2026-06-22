"use client";

import { useState } from 'react';

// Mock Supabase client for local development
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
        getPublicUrl: (name: string) => ({ data: { publicUrl: 'https://example.com/asset.glb' } })
      })
    }
  }),
  storage: {
    from: (bucket: string) => ({
      upload: async (name: string, file: any) => ({ data: null, error: null }),
      getPublicUrl: (name: string) => ({ data: { publicUrl: 'https://example.com/asset.glb' } })
    })
  }
};

export default function AdminPage() {
  const [formData, setFormData] = useState({ name: '', specs: '' });
  const [mode, setMode] = useState({ img: 'file', model: 'file' });
  
  // State for uploads
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState('');
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [modelUrl, setModelUrl] = useState('');

  const handleUpload = async (file: File, bucket: string) => {
    const fileName = `${Math.random()}-${file.name}`;
    await supabase.storage.from(bucket).upload(fileName, file);
    return supabase.storage.from(bucket).getPublicUrl(fileName).data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalImg = imgUrl;
      let finalModel = modelUrl;

      if (mode.img === 'file' && imgFile) finalImg = await handleUpload(imgFile, 'hardware-images');
      if (mode.model === 'file' && modelFile) finalModel = await handleUpload(modelFile, 'hardware-models');

      const { error } = await supabase.from('hardware').insert([{ 
        name: formData.name, 
        model_url: finalModel, 
        image_2d_url: finalImg,
        specs: JSON.parse(formData.specs || '{}')
      }]);

      if (error) throw error;
      alert("Hardware component added successfully!");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#070707] text-[#E5E5E5] p-10 font-mono">
      <h1 className="text-3xl mb-10">ADMIN.ENTRY_POINT</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-lg">
        <input placeholder="Hardware Name" className="bg-[#111] p-3 border border-[#222]" onChange={(e) => setFormData({...formData, name: e.target.value})} />
        
        {/* 2D Image Section */}
        <div className="border border-[#222] p-4">
          <label className="block mb-2 text-xs text-[#666]">2D Image ({mode.img})</label>
          <select className="bg-[#111] mb-2 w-full" onChange={(e) => setMode({...mode, img: e.target.value})}>
            <option value="file">Upload File</option>
            <option value="url">Provide URL</option>
          </select>
          {mode.img === 'file' ? <input type="file" onChange={(e) => e.target.files && setImgFile(e.target.files[0])}/> : <input placeholder="Paste Image URL" className="bg-[#111] w-full" onChange={(e) => setImgUrl(e.target.value)}/>}
        </div>

        {/* 3D Model Section */}
        <div className="border border-[#222] p-4">
          <label className="block mb-2 text-xs text-[#666]">3D Model ({mode.model})</label>
          <select className="bg-[#111] mb-2 w-full" onChange={(e) => setMode({...mode, model: e.target.value})}>
            <option value="file">Upload File</option>
            <option value="url">Provide URL</option>
          </select>
          {mode.model === 'file' ? <input type="file" onChange={(e) => e.target.files && setModelFile(e.target.files[0])}/> : <input placeholder="Paste Model URL" className="bg-[#111] w-full" onChange={(e) => setModelUrl(e.target.value)}/>}
        </div>

        <textarea placeholder='Specs JSON' className="bg-[#111] p-3 border border-[#222] h-24" onChange={(e) => setFormData({...formData, specs: e.target.value})} />
        <button type="submit" className="bg-[#E5E5E5] text-[#070707] py-3 font-bold uppercase">Commit to Database</button>
      </form>
    </main>
  );
}