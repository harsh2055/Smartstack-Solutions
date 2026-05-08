"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Edit3, X, Loader2, Settings,
  Globe, Database, Shield, Layout, CheckCircle2, AlertCircle, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
}

const ICONS: Record<string, React.FC<{ size?: number }>> = {
  Layout, Globe, Database, Shield, Settings,
};

const emptyForm = () => ({ title: '', description: '', icon: 'Layout', isActive: true });

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState(emptyForm());

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch { setServices([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const openCreate = () => {
    setEditService(null);
    setForm(emptyForm());
    setIsModalOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditService(s);
    setForm({ title: s.title, description: s.description, icon: s.icon || 'Layout', isActive: s.isActive });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editService) {
        const res = await fetch(`/api/services/${editService.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Update failed');
        showToast('Service updated', 'success');
      } else {
        const res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Create failed');
        showToast('Service created', 'success');
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      showToast(err.message || 'Failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' });
      showToast('Service deleted', 'success');
      fetchServices();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  const toggleActive = async (s: Service) => {
    try {
      await fetch(`/api/services/${s.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !s.isActive }),
      });
      fetchServices();
    } catch {
      showToast('Toggle failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950">Service Offerings</h1>
          <p className="text-slate-500 text-sm mt-1">Define the core pillars of your digital solutions.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-slate-950 text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg self-start sm:self-auto"
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full h-56 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={28} />
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <Settings size={32} className="text-slate-200 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 mb-1">No services yet</h3>
            <p className="text-sm text-slate-400">Start defining your offerings.</p>
          </div>
        ) : (
          services.map((service) => {
            const Icon = ICONS[service.icon] || Settings;
            return (
              <motion.div
                layout key={service.id}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                    service.isActive ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openEdit(service)}
                      className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-950 mb-2">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">{service.description}</p>

                <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                  <button
                    onClick={() => toggleActive(service)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                      service.isActive ? 'text-emerald-600 hover:text-red-500' : 'text-slate-400 hover:text-emerald-600'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${service.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    {service.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <Link
                    href="/services"
                    className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    Preview <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            );
          })
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
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-950">
                  {editService ? 'Edit Service' : 'New Service'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Service Title</label>
                  <input
                    required value={form.title}
                    onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Cloud Automation"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Description</label>
                  <textarea
                    required value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={4}
                    placeholder="Explain the value proposition..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Icon</label>
                  <div className="flex gap-2">
                    {Object.entries(ICONS).map(([name, Icon]) => (
                      <button
                        key={name} type="button"
                        onClick={() => setForm(f => ({ ...f, icon: name }))}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                          form.icon === name ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        <Icon size={18} />
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm(f => ({ ...f, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span className="text-sm font-bold text-slate-700">Active (visible on website)</span>
                </label>

                <button
                  disabled={saving} type="submit"
                  className="w-full py-3.5 bg-slate-950 text-white rounded-xl font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : (editService ? 'Save Changes' : 'Create Service')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
