"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Building2, Plus, Search, Filter, ArrowUpRight, Mail, Phone,
  Globe, CheckCircle, XCircle, TrendingUp, ChevronRight, Loader2,
  Users, DollarSign, FolderKanban
} from 'lucide-react';

interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  isActive: boolean;
  createdAt: string;
  projects: { id: string; title: string; status: string; progress: number; deadline?: string }[];
  invoices: { id: string; total: number; status: string }[];
  payments: { id: string; amount: number; status: string }[];
}

const statusColors: Record<string, string> = {
  LEAD: 'bg-slate-100 text-slate-600',
  DISCUSSION: 'bg-blue-50 text-blue-600',
  DEMO: 'bg-purple-50 text-purple-600',
  DEVELOPMENT: 'bg-amber-50 text-amber-600',
  TESTING: 'bg-orange-50 text-orange-600',
  REVISION: 'bg-rose-50 text-rose-600',
  LIVE: 'bg-emerald-50 text-emerald-600',
  COMPLETED: 'bg-green-50 text-green-700',
};

function AddClientModal({ onClose, onSave }: { onClose: () => void; onSave: (c: Client) => void }) {
  const [form, setForm] = useState({ companyName: '', contactName: '', email: '', phone: '', website: '', industry: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to create client');
      }
      const client = await res.json();
      onSave(client);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Add New Client</h2>
        {error && <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Company Name *</label>
              <input
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.companyName}
                onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Contact Name *</label>
              <input
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.contactName}
                onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
                required
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Email *</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Phone</label>
              <input
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Industry</label>
              <input
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.industry}
                onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Website</label>
            <input
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.website}
              onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
              placeholder="https://"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Notes</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-slate-950 text-white rounded-xl text-sm font-bold hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'Creating...' : 'Create Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/clients?${params}`);
      const data = await res.json();
      setClients(data.clients || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchClients, 300);
    return () => clearTimeout(t);
  }, [fetchClients]);

  const totalRevenue = clients.reduce((sum, c) =>
    sum + (c.invoices || []).filter(i => i.status === 'PAID').reduce((s, i) => s + i.total, 0), 0);

  const activeProjects = clients.reduce((sum, c) =>
    sum + (c.projects || []).filter(p => !['COMPLETED', 'CANCELLED'].includes(p.status)).length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Clients</h1>
          <p className="text-slate-500 text-sm mt-1">{total} total clients in the system</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-slate-950 text-white rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all"
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: total, icon: Building2, color: 'blue' },
          { label: 'Active Projects', value: activeProjects, icon: FolderKanban, color: 'indigo' },
          { label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(0)}k`, icon: DollarSign, color: 'emerald' },
          { label: 'Active', value: clients.filter(c => c.isActive).length, icon: Users, color: 'amber' },
        ].map(s => (
          <div key={s.label} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-${s.color}-50 flex items-center justify-center text-${s.color}-600 mb-3`}>
              <s.icon size={20} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className="text-2xl font-bold text-slate-950 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            placeholder="Search clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-600"
        >
          <option value="">All Clients</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Client Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-slate-400" />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-20">
            <Building2 size={40} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No clients found</p>
            <p className="text-slate-400 text-sm mt-1">Add your first client to get started</p>
            <button onClick={() => setShowModal(true)} className="mt-4 px-5 py-2.5 bg-slate-950 text-white rounded-xl font-bold text-sm">
              Add Client
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Client</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Current Project</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Revenue</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {clients.map(client => {
                    const latestProject = client.projects[0];
                    const revenue = client.invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.total, 0);
                    return (
                      <tr key={client.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {client.companyName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{client.companyName}</p>
                              <p className="text-xs text-slate-400">{client.contactName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {latestProject ? (
                            <div>
                              <p className="text-sm font-semibold text-slate-700 truncate max-w-[160px]">{latestProject.title}</p>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[latestProject.status] || 'bg-slate-100 text-slate-600'}`}>
                                {latestProject.status}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300">No projects</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {latestProject ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full w-24">
                                <div
                                  className="h-full bg-blue-600 rounded-full transition-all"
                                  style={{ width: `${latestProject.progress}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-slate-500">{latestProject.progress}%</span>
                            </div>
                          ) : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-800">₹{revenue.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          {client.isActive ? (
                            <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
                              <CheckCircle size={12} /> Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold bg-slate-50 px-2.5 py-1 rounded-full w-fit">
                              <XCircle size={12} /> Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/clients/${client.id}`}
                            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors group-hover:text-blue-600"
                          >
                            View <ArrowUpRight size={13} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {clients.map(client => {
                const latestProject = client.projects[0];
                const revenue = client.invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.total, 0);
                return (
                  <Link key={client.id} href={`/admin/clients/${client.id}`} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                      {client.companyName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{client.companyName}</p>
                      <p className="text-xs text-slate-400">{client.contactName}</p>
                      {latestProject && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1 bg-slate-100 rounded-full max-w-[80px]">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${latestProject.progress}%` }} />
                          </div>
                          <span className="text-[10px] text-slate-400">{latestProject.progress}%</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-700">₹{revenue.toLocaleString()}</p>
                      <ChevronRight size={16} className="text-slate-300 mt-1 ml-auto" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Useful contact links strip */}
      {clients.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {clients.slice(0, 3).map(client => (
            <div key={client.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-bold">
                {client.companyName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{client.companyName}</p>
                <p className="text-[10px] text-slate-400 truncate">{client.email}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <a href={`mailto:${client.email}`} className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                  <Mail size={13} />
                </a>
                {client.phone && (
                  <a href={`tel:${client.phone}`} className="p-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors">
                    <Phone size={13} />
                  </a>
                )}
                {client.website && (
                  <a href={client.website} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-slate-50 hover:bg-purple-50 text-slate-400 hover:text-purple-600 transition-colors">
                    <Globe size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddClientModal
          onClose={() => setShowModal(false)}
          onSave={(c) => setClients(prev => [c, ...prev])}
        />
      )}
    </div>
  );
}
