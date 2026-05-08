"use client";

import React, { useState, useEffect } from 'react';
import { 
  Folder, Upload, HardDrive, Lock, File, 
  Trash2, ExternalLink, Loader2, Search,
  Filter, MoreVertical, Plus
} from 'lucide-react';

export default function FilesPage() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured (this is a simplified check for the UI)
    const checkConfig = async () => {
      // In a real app, we'd check via an API or env exposed to client
      // For now, we'll assume it's NOT configured until the user adds keys to .env
      setIsConfigured(false); 
    };
    checkConfig();
  }, []);

  if (!isConfigured) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">File Manager</h1>
          <p className="text-slate-500 text-sm mt-1">Manage client files, documents, and uploads.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-slate-950 to-slate-800 p-12 text-center text-white relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent" />
            <div className="relative">
              <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Folder size={32} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Setup Required</h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Secure file storage requires Supabase Storage configuration. Add your credentials to the <code className="text-blue-300">.env</code> file to activate the File Manager.
              </p>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Upload, title: 'Drag & Drop Upload', desc: 'Upload any file type — PDFs, images, ZIPs, and more.' },
              { icon: Lock, title: 'Secure Access', desc: 'Files are organized per client with secure, role-based access control.' },
              { icon: HardDrive, title: 'Global CDN', desc: 'Fast file delivery via Supabase\'s global edge network.' },
            ].map(feature => (
              <div key={feature.title} className="text-center p-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-500">
                  <feature.icon size={22} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 p-8 bg-slate-50">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Required Environment Variables:</p>
            <div className="space-y-3 font-mono text-xs">
              <div className="group relative">
                <div className="bg-slate-900 text-emerald-400 px-5 py-3 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <span>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</span>
                </div>
              </div>
              <div className="group relative">
                <div className="bg-slate-900 text-emerald-400 px-5 py-3 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <span>SUPABASE_SERVICE_KEY=your-service-role-key</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-4 italic text-center">
              * Note: Make sure to create a bucket named "crm-files" in your Supabase Storage dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Functional UI (Hidden until configured)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">File Manager</h1>
          <p className="text-slate-500 text-sm mt-1">Manage documents and client uploads.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all">
          <Plus size={16} /> Upload File
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar / Folders */}
        <div className="col-span-12 md:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Storage</h3>
            <div className="space-y-1">
              {[
                { name: 'All Files', icon: File, count: 0, active: true },
                { name: 'Invoices', icon: Folder, count: 0 },
                { name: 'Contracts', icon: Folder, count: 0 },
                { name: 'Assets', icon: Folder, count: 0 },
                { name: 'Trash', icon: Trash2, count: 0 },
              ].map(item => (
                <button key={item.name} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${item.active ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <item.icon size={16} />
                    {item.name}
                  </div>
                  <span className="text-[10px] opacity-50">{item.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* File Grid */}
        <div className="col-span-12 md:col-span-9 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm" placeholder="Search files…" />
            </div>
            <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 text-sm font-medium">
              <Filter size={16} /> Filter
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <File size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-400 text-sm">No files uploaded yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
