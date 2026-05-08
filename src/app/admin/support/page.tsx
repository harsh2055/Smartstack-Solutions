"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { HeadphonesIcon, AlertCircle, Clock, CheckCircle, Loader2, Search } from 'lucide-react';

interface Ticket {
  id: string; subject: string; description: string; status: string;
  priority: string; assignedTo?: string; resolvedAt?: string; createdAt: string;
  client: { id: string; companyName: string; email: string; };
}

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-slate-100 text-slate-500',
  MEDIUM: 'bg-amber-50 text-amber-600',
  HIGH: 'bg-orange-50 text-orange-600',
  URGENT: 'bg-red-50 text-red-600',
};
const STATUS_ICONS: Record<string, React.ReactNode> = {
  OPEN: <AlertCircle size={14} className="text-red-500" />,
  IN_PROGRESS: <Clock size={14} className="text-amber-500" />,
  RESOLVED: <CheckCircle size={14} className="text-emerald-500" />,
  CLOSED: <CheckCircle size={14} className="text-slate-400" />,
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/support?${params}`);
      setTickets(await res.json());
    } finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await fetch('/api/support', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      fetchTickets();
    } finally { setUpdating(null); }
  };

  const counts = {
    OPEN: tickets.filter(t => t.status === 'OPEN').length,
    IN_PROGRESS: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    RESOLVED: tickets.filter(t => t.status === 'RESOLVED').length,
  };

  const filtered = tickets.filter(t =>
    !search || t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.client.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Support Tickets</h1>
          <p className="text-slate-500 text-sm mt-1">{tickets.length} total tickets</p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Open', key: 'OPEN', color: 'red', icon: <AlertCircle size={18} className="text-red-500" /> },
          { label: 'In Progress', key: 'IN_PROGRESS', color: 'amber', icon: <Clock size={18} className="text-amber-500" /> },
          { label: 'Resolved', key: 'RESOLVED', color: 'emerald', icon: <CheckCircle size={18} className="text-emerald-500" /> },
        ].map(s => (
          <button key={s.key} onClick={() => setStatusFilter(statusFilter === s.key ? '' : s.key)}
            className={`bg-white rounded-2xl border p-5 text-left transition-all hover:shadow-md ${statusFilter === s.key ? 'ring-2 ring-blue-500 border-blue-200' : 'border-slate-100'}`}>
            <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</span></div>
            <p className="text-3xl font-bold text-slate-900">{counts[s.key as keyof typeof counts] || 0}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="Search tickets…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-slate-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <HeadphonesIcon size={40} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400">No tickets found</p>
          </div>
        ) : filtered.map(ticket => (
          <div key={ticket.id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-sm transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{STATUS_ICONS[ticket.status]}</div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{ticket.subject}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{ticket.client.companyName}</p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{ticket.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PRIORITY_COLORS[ticket.priority] || 'bg-slate-100 text-slate-500'}`}>{ticket.priority}</span>
                    <span className="text-[10px] text-slate-300">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    {ticket.assignedTo && <span className="text-[10px] text-slate-400">Assigned: {ticket.assignedTo}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {ticket.status === 'OPEN' && (
                  <button onClick={() => updateStatus(ticket.id, 'IN_PROGRESS')} disabled={updating === ticket.id}
                    className="text-xs font-bold px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1">
                    {updating === ticket.id ? <Loader2 size={12} className="animate-spin" /> : null}
                    In Progress
                  </button>
                )}
                {(ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS') && (
                  <button onClick={() => updateStatus(ticket.id, 'RESOLVED')} disabled={updating === ticket.id}
                    className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">
                    Resolve
                  </button>
                )}
                {ticket.status === 'RESOLVED' && (
                  <button onClick={() => updateStatus(ticket.id, 'CLOSED')} disabled={updating === ticket.id}
                    className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
