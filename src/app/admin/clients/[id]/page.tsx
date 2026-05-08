"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, Globe, Edit2, Plus, CheckCircle,
  Clock, FolderKanban, Receipt, MessageSquare, Loader2, Save, X, FileCheck, FileX
} from 'lucide-react';

const PROJECT_STATUSES = ['LEAD','DISCUSSION','DEMO','DEVELOPMENT','TESTING','REVISION','LIVE','COMPLETED','ON_HOLD','CANCELLED'];
const statusColors: Record<string, string> = {
  LEAD: 'bg-slate-100 text-slate-600', DISCUSSION: 'bg-blue-50 text-blue-600',
  DEMO: 'bg-purple-50 text-purple-600', DEVELOPMENT: 'bg-amber-50 text-amber-600',
  TESTING: 'bg-orange-50 text-orange-600', REVISION: 'bg-rose-50 text-rose-600',
  LIVE: 'bg-emerald-50 text-emerald-700', COMPLETED: 'bg-green-50 text-green-700',
  ON_HOLD: 'bg-slate-100 text-slate-500', CANCELLED: 'bg-red-50 text-red-600',
};
const invoiceStatusColors: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-600', PAID: 'bg-emerald-50 text-emerald-700',
  OVERDUE: 'bg-red-50 text-red-600', DRAFT: 'bg-slate-100 text-slate-500',
};

function AddProjectModal({ clientId, onClose, onSave }: { clientId: string; onClose: () => void; onSave: (p: unknown) => void }) {
  const [form, setForm] = useState({ title: '', description: '', status: 'LEAD', totalValue: '', deadline: '', demoUrl: '', liveUrl: '', githubUrl: '', assignedTo: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, clientId, totalValue: parseFloat(form.totalValue) || 0 }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      onSave(await res.json());
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Add Project</h2>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>
        {error && <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Project Title *</label>
            <input className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Status</label>
              <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {PROJECT_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Value (₹)</label>
              <input type="number" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.totalValue} onChange={e => setForm(f => ({ ...f, totalValue: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Deadline</label>
            <input type="date" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Demo URL</label>
            <input className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.demoUrl} onChange={e => setForm(f => ({ ...f, demoUrl: e.target.value }))} placeholder="https://" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Live URL</label>
            <input className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.liveUrl} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} placeholder="https://" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Assigned To</label>
            <input className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Notes</label>
            <textarea rows={3} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-slate-950 text-white rounded-xl text-sm font-bold hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Saving…' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [client, setClient] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [showAddProject, setShowAddProject] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [contractToggling, setContractToggling] = useState(false);

  const fetchClient = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/clients/${id}`);
      if (!res.ok) { router.push('/admin/clients'); return; }
      const data = await res.json();
      setClient(data);
      setEditForm({ companyName: data.companyName, contactName: data.contactName, email: data.email, phone: data.phone || '', website: data.website || '', industry: data.industry || '', notes: data.notes || '' });
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { fetchClient(); }, [fetchClient]);

  const saveEdit = async () => {
    setSaving(true);
    try {
      await fetch(`/api/clients/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm) });
      setClient(prev => ({ ...prev, ...editForm }));
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  const toggleContract = async () => {
    setContractToggling(true);
    try {
      const newVal = !client?.contractSigned;
      await fetch(`/api/clients/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contractSigned: newVal }) });
      setClient(prev => ({ ...prev, contractSigned: newVal }));
    } finally {
      setContractToggling(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={28} className="animate-spin text-slate-400" />
    </div>
  );

  if (!client) return null;

  const projects = (client.projects as unknown[]) || [];
  const invoices = (client.invoices as unknown[]) || [];
  const tickets = (client.tickets as unknown[]) || [];
  const activity = (client.activityLogs as unknown[]) || [];
  const totalRevenue = (invoices as Record<string, unknown>[]).filter(i => i.status === 'PAID').reduce((s, i) => s + ((i.total as number) || 0), 0);
  const pending = (invoices as Record<string, unknown>[]).filter(i => i.status === 'PENDING' || i.status === 'OVERDUE').reduce((s, i) => s + ((i.total as number) || 0), 0);

  const tabs = [
    { id: 'projects', label: 'Projects', count: projects.length },
    { id: 'invoices', label: 'Invoices', count: invoices.length },
    { id: 'tickets', label: 'Support', count: tickets.length },
    { id: 'activity', label: 'Activity', count: activity.length },
  ];

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/admin/clients" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium w-fit">
        <ArrowLeft size={16} /> Back to Clients
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shrink-0">
              {(client.companyName as string)?.charAt(0)}
            </div>
            <div>
              {editMode ? (
                <input className="text-2xl font-bold border-b-2 border-blue-500 outline-none text-slate-900 bg-transparent" value={editForm.companyName} onChange={e => setEditForm(f => ({ ...f, companyName: e.target.value }))} />
              ) : (
                <h1 className="text-2xl font-bold text-slate-900">{client.companyName as string}</h1>
              )}
              <p className="text-slate-500 text-sm">{client.contactName as string}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <a href={`mailto:${client.email as string}`} className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
                  <Mail size={12} />{client.email as string}
                </a>
                {!!client.phone && <a href={`tel:${client.phone as string}`} className="flex items-center gap-1.5 text-xs text-slate-500"><Phone size={12} />{client.phone as string}</a>}
                {!!client.website && <a href={client.website as string} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600"><Globe size={12} />{client.website as string}</a>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={toggleContract}
              disabled={contractToggling}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                client?.contractSigned
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              {contractToggling ? <Loader2 size={14} className="animate-spin" /> : client?.contractSigned ? <FileCheck size={14} /> : <FileX size={14} />}
              {client?.contractSigned ? 'Contract Signed' : 'Sign Contract'}
            </button>
            {editMode ? (
              <>
                <button onClick={() => setEditMode(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={saveEdit} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </>
            ) : (
              <button onClick={() => setEditMode(true)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                <Edit2 size={14} /> Edit
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Projects', value: projects.length, icon: FolderKanban, color: 'blue' },
            { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: CheckCircle, color: 'emerald' },
            { label: 'Pending', value: `₹${pending.toLocaleString()}`, icon: Clock, color: 'amber' },
            { label: 'Invoices', value: invoices.length, icon: Receipt, color: 'indigo' },
          ].map(s => (
            <div key={s.label} className={`bg-${s.color}-50 rounded-2xl p-4`}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-xl font-bold text-${s.color}-700`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-2xl p-1.5 w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.label}
            {t.count > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${activeTab === t.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Projects</h3>
            <button onClick={() => setShowAddProject(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-950 text-white rounded-xl text-sm font-bold hover:scale-105 transition-all">
              <Plus size={14} /> Add Project
            </button>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <FolderKanban size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No projects yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {(projects as Record<string, unknown>[]).map(project => (
                <div key={project.id as string} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{project.title as string}</h4>
                      {!!project.assignedTo && <p className="text-xs text-slate-400 mt-0.5">Assigned to: {project.assignedTo as string}</p>}
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColors[project.status as string] || 'bg-slate-100 text-slate-600'}`}>{project.status as string}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Progress</span>
                      <span className="text-xs font-bold text-slate-700">{project.progress as number}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all" style={{ width: `${project.progress as number}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                    {!!project.deadline && <span>Due: {new Date(project.deadline as string).toLocaleDateString()}</span>}
                    {!!project.demoUrl && <a href={project.demoUrl as string} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Demo ↗</a>}
                    {!!project.liveUrl && <a href={project.liveUrl as string} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">Live ↗</a>}
                    {!!project.githubUrl && <a href={project.githubUrl as string} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline">GitHub ↗</a>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Invoices</h3>
            <Link href={`/admin/invoices?clientId=${id}`} className="flex items-center gap-2 px-4 py-2 bg-slate-950 text-white rounded-xl text-sm font-bold hover:scale-105 transition-all">
              <Plus size={14} /> New Invoice
            </Link>
          </div>
          {invoices.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <Receipt size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No invoices yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Invoice #', 'Title', 'Amount', 'Status', 'Due Date'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(invoices as Record<string, unknown>[]).map(inv => (
                    <tr key={inv.id as string} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3 text-sm font-mono text-slate-600">{inv.invoiceNo as string}</td>
                      <td className="px-5 py-3 text-sm text-slate-700">{inv.title as string}</td>
                      <td className="px-5 py-3 text-sm font-bold text-slate-900">₹{((inv.total as number) || 0).toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${invoiceStatusColors[inv.status as string] || 'bg-slate-100 text-slate-600'}`}>{inv.status as string}</span>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-400">{inv.dueDate ? new Date(inv.dueDate as string).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900">Support Tickets</h3>
          {tickets.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <MessageSquare size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No support tickets</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(tickets as Record<string, unknown>[]).map(t => (
                <div key={t.id as string} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{t.subject as string}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.priority as string} priority · {new Date(t.createdAt as string).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-4 shrink-0 ${t.status === 'OPEN' ? 'bg-red-50 text-red-600' : t.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'}`}>{t.status as string}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900">Activity Timeline</h3>
          {activity.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <Clock size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No activity yet</p>
            </div>
          ) : (
            <div className="relative pl-6 border-l-2 border-slate-100 space-y-4">
              {(activity as Record<string, unknown>[]).map(log => (
                <div key={log.id as string} className="relative">
                  <div className="absolute -left-[1.625rem] w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
                  <div className="bg-white rounded-2xl border border-slate-100 p-4 ml-2">
                    <p className="text-sm font-bold text-slate-800">{log.title as string}</p>
                    {!!log.message && <p className="text-xs text-slate-500 mt-0.5">{log.message as string}</p>}
                    <p className="text-[10px] text-slate-300 mt-1">{new Date(log.createdAt as string).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showAddProject && (
        <AddProjectModal clientId={id} onClose={() => setShowAddProject(false)} onSave={() => { setShowAddProject(false); fetchClient(); }} />
      )}
    </div>
  );
}
