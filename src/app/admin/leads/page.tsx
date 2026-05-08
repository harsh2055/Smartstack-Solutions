"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp, Plus, Search, Loader2, ChevronDown,
  Mail, Phone, Building2, X, Save, ArrowRight
} from 'lucide-react';

const STATUSES = ['NEW','CONTACTED','FOLLOW_UP','PROPOSAL_SENT','CLOSED','LOST'] as const;
type LeadStatus = typeof STATUSES[number];

const statusConfig: Record<LeadStatus, { color: string; label: string }> = {
  NEW: { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'New' },
  CONTACTED: { color: 'bg-indigo-50 text-indigo-700 border-indigo-200', label: 'Contacted' },
  FOLLOW_UP: { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Follow Up' },
  PROPOSAL_SENT: { color: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Proposal Sent' },
  CLOSED: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Closed' },
  LOST: { color: 'bg-red-50 text-red-600 border-red-100', label: 'Lost' },
};

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: string;
  status: LeadStatus;
  assignedTo?: string;
  notes?: string;
  followUpDate?: string;
  createdAt: string;
}

function AddLeadModal({ onClose, onSave }: { onClose: () => void; onSave: (l: Lead) => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '', source: 'MANUAL', assignedTo: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error((await res.json()).error);
      onSave(await res.json());
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Add Lead</h2>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>
        {error && <p className="text-sm text-red-600 mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Name *</label>
              <input className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Email *</label>
              <input type="email" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone</label>
              <input className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Company</label>
              <input className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Source</label>
            <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}>
              {['WEBSITE','REFERRAL','SOCIAL','COLD_EMAIL','MANUAL','OTHER'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Assigned To</label>
            <input className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Message</label>
            <textarea rows={3} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-slate-950 text-white rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Saving…' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();
      setLeads(data.leads || []);
      setTotal(data.total || 0);
      const countMap: Record<string, number> = {};
      (data.counts || []).forEach((c: { status: string; _count: { id: number } }) => { countMap[c.status] = c._count?.id || 0; });
      setCounts(countMap);
    } finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchLeads, 300);
    return () => clearTimeout(t);
  }, [fetchLeads]);

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    setUpdating(id);
    try {
      await fetch('/api/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    } finally { setUpdating(null); }
  };

  const convertRate = total > 0 ? Math.round(((counts['CLOSED'] || 0) / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Leads CRM</h1>
          <p className="text-slate-500 text-sm mt-1">{total} total leads · {convertRate}% conversion rate</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-3 bg-slate-950 text-white rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all">
          <Plus size={16} /> Add Lead
        </button>
      </div>

      {/* Status Pipeline */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
            className={`p-3 rounded-2xl border text-center transition-all ${statusFilter === s ? 'ring-2 ring-blue-500' : 'hover:scale-105'} ${statusConfig[s].color}`}>
            <p className="text-xl font-bold">{counts[s] || 0}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5">{statusConfig[s].label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          placeholder="Search leads by name, email, company…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-slate-400" /></div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20">
            <TrendingUp size={40} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No leads found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {leads.map(lead => (
              <div key={lead.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{lead.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600">
                          <Mail size={11} /> {lead.email}
                        </a>
                        {lead.phone && <span className="flex items-center gap-1 text-xs text-slate-400"><Phone size={11} /> {lead.phone}</span>}
                        {lead.company && <span className="flex items-center gap-1 text-xs text-slate-400"><Building2 size={11} /> {lead.company}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:ml-4">
                    {lead.source && <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase">{lead.source}</span>}
                    <div className="relative">
                      <select
                        value={lead.status}
                        onChange={e => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        disabled={updating === lead.id}
                        className={`appearance-none text-[10px] font-bold px-3 py-1.5 rounded-full border cursor-pointer ${statusConfig[lead.status].color} pr-6`}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
                      </select>
                      {updating === lead.id
                        ? <Loader2 size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 animate-spin" />
                        : <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      }
                    </div>
                    <span className="text-[10px] text-slate-300">{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {lead.message && (
                  <p className="text-xs text-slate-400 mt-3 pl-13 ml-[52px] line-clamp-2">{lead.message}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <AddLeadModal onClose={() => setShowModal(false)} onSave={l => { setLeads(prev => [l, ...prev]); setTotal(t => t + 1); }} />}
    </div>
  );
}
