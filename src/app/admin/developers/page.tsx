"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Edit3, X, Loader2, Search,
  User, Briefcase, FileText, Globe, Link as LinkIcon,
  CheckCircle2, AlertCircle, Code, PlusCircle
} from 'lucide-react';
import Image from 'next/image';

interface DeveloperRecord {
  id: string;
  name: string;
  role: string;
  about: string;
  image: string | null;
  portfolio: string | null;
  resume: string | null;
  skills: string[];
  projects: any;
  isActive: boolean;
}

export default function AdminDevelopers() {
  const [developers, setDevelopers] = useState<DeveloperRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDev, setDeleteDev] = useState<DeveloperRecord | null>(null);
  const [editDev, setEditDev] = useState<DeveloperRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [about, setAbout] = useState('');
  const [image, setImage] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [resume, setResume] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [projects, setProjects] = useState<{title: string, url: string}[]>([]);
  const [isActive, setIsActive] = useState(true);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDevelopers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/developers?${params}`);
      const data = await res.json();
      setDevelopers(Array.isArray(data) ? data : []);
    } catch {
      setDevelopers([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchDevelopers, 300);
    return () => clearTimeout(timer);
  }, [fetchDevelopers]);

  const openCreate = () => {
    setEditDev(null);
    setName(''); setRole(''); setAbout(''); setImage(''); setPortfolio(''); setResume('');
    setSkills([]); setProjects([]); setIsActive(true);
    setIsModalOpen(true);
  };

  const openEdit = (dev: DeveloperRecord) => {
    setEditDev(dev);
    setName(dev.name);
    setRole(dev.role);
    setAbout(dev.about);
    setImage(dev.image || '');
    setPortfolio(dev.portfolio || '');
    setResume(dev.resume || '');
    setSkills(dev.skills || []);
    setProjects(Array.isArray(dev.projects) ? dev.projects : []);
    setIsActive(dev.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { name, role, about, image, portfolio, resume, skills, projects, isActive };
      const url = editDev ? `/api/developers/${editDev.id}` : '/api/developers';
      const method = editDev ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Operation failed');
      
      showToast(`Developer ${editDev ? 'updated' : 'created'} successfully`, 'success');
      setIsModalOpen(false);
      fetchDevelopers();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (dev: DeveloperRecord) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/developers/${dev.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      showToast('Developer removed', 'success');
      setDeleteDev(null);
      fetchDevelopers();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const addProject = () => {
    setProjects([...projects, { title: '', url: '' }]);
  };

  const updateProject = (index: number, field: 'title' | 'url', value: string) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm ${
              toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950">Team Management</h1>
          <p className="text-slate-500 text-sm mt-1">Showcase your developers and their portfolios.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-slate-950 text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <Plus size={18} /> Add Developer
        </button>
      </div>

      {/* Filters */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="animate-spin text-blue-600 mx-auto" size={32} />
          </div>
        ) : developers.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <User size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No developers added yet</p>
          </div>
        ) : (
          developers.map((dev) => (
            <div key={dev.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden relative shrink-0">
                  {dev.image ? (
                    <Image src={dev.image} alt={dev.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User size={24} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">{dev.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{dev.role}</p>
                  <div className="flex gap-2 mt-2">
                    {dev.portfolio && <LinkIcon size={12} className="text-slate-400" />}
                    {dev.resume && <FileText size={12} className="text-slate-400" />}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end pt-4 border-t border-slate-50">
                <button
                  onClick={() => openEdit(dev)}
                  className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => setDeleteDev(dev)}
                  className="p-2 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-950">{editDev ? 'Edit Developer' : 'Add Developer'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                    <input
                      required value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Role</label>
                    <input
                      required value={role} onChange={(e) => setRole(e.target.value)}
                      placeholder="Senior Full Stack Developer"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">About / Bio</label>
                  <textarea
                    required value={about} onChange={(e) => setAbout(e.target.value)}
                    placeholder="Briefly describe the developer's experience..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Profile Image URL</label>
                    <input
                      value={image} onChange={(e) => setImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Portfolio URL</label>
                    <input
                      value={portfolio} onChange={(e) => setPortfolio(e.target.value)}
                      placeholder="https://portfolio.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Resume URL</label>
                  <input
                    value={resume} onChange={(e) => setResume(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Skills</label>
                  <div className="flex gap-2">
                    <input
                      value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="React, Node.js, AWS..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <button type="button" onClick={addSkill} className="p-2 bg-blue-600 text-white rounded-xl">
                      <PlusCircle size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
                        {s} <X size={12} className="cursor-pointer" onClick={() => setSkills(skills.filter((_, i) => i !== idx))} />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Featured Projects</label>
                    <button type="button" onClick={addProject} className="text-xs font-bold text-blue-600">+ Add Project</button>
                  </div>
                  {projects.map((proj, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        placeholder="Project Title"
                        value={proj.title} onChange={(e) => updateProject(idx, 'title', e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm outline-none"
                      />
                      <input
                        placeholder="Project URL"
                        value={proj.url} onChange={(e) => updateProject(idx, 'url', e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm outline-none"
                      />
                      <button type="button" onClick={() => setProjects(projects.filter((_, i) => i !== idx))} className="p-2 text-red-500">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  disabled={saving}
                  type="submit"
                  className="w-full py-4 bg-slate-950 text-white rounded-xl font-bold shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70"
                >
                  {saving ? <Loader2 className="animate-spin mx-auto" size={20} /> : (editDev ? 'Save Changes' : 'Add Developer')}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {deleteDev && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setDeleteDev(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-sm bg-white rounded-2xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-950 mb-2">Delete Developer?</h2>
              <p className="text-slate-500 text-sm mb-6">Are you sure you want to remove <span className="font-bold text-slate-900">{deleteDev.name}</span> from the team?</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setDeleteDev(null)} className="py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm">Cancel</button>
                <button onClick={() => handleDelete(deleteDev)} className="py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
