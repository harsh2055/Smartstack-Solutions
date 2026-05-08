"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Receipt, Plus, Search, Loader2, CheckCircle, Clock,
  AlertCircle, X, DollarSign, TrendingUp, FileText, Download
} from 'lucide-react';
import { generateInvoicePDF } from '@/lib/pdf-generator';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-500',
  PENDING: 'bg-amber-50 text-amber-700',
  PAID: 'bg-emerald-50 text-emerald-700',
  OVERDUE: 'bg-red-50 text-red-600',
  CANCELLED: 'bg-slate-100 text-slate-400',
};
const STATUS_ICONS: Record<string, React.ReactNode> = {
  PAID: <CheckCircle size={12} />,
  PENDING: <Clock size={12} />,
  OVERDUE: <AlertCircle size={12} />,
};

interface InvoiceItem { description: string; qty: number; rate: number; amount: number; }
interface Invoice {
  id: string; invoiceNo: string; title: string; total: number; status: string;
  dueDate?: string; createdAt: string;
  client: { id: string; companyName: string; contactName: string; email: string; phone?: string; };
  items: any; subtotal: number; tax: number; notes?: string;
}

function CreateInvoiceModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [clients, setClients] = useState<{ id: string; companyName: string }[]>([]);
  const [form, setForm] = useState({ clientId: '', title: '', dueDate: '', notes: '', tax: '0', status: 'PENDING' });
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', qty: 1, rate: 0, amount: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/clients?limit=100').then(r => r.json()).then(d => setClients(d.clients || []));
  }, []);

  const updateItem = (i: number, field: keyof InvoiceItem, val: string) => {
    setItems(prev => prev.map((item, idx) => {
      if (idx !== i) return item;
      const updated = { ...item, [field]: field === 'description' ? val : parseFloat(val) || 0 };
      updated.amount = updated.qty * updated.rate;
      return updated;
    }));
  };

  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const taxAmt = subtotal * (parseFloat(form.tax) / 100);
  const total = subtotal + taxAmt;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items, subtotal, tax: taxAmt, total }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      onSave();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Create Invoice</h2>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>
        {error && <p className="text-sm text-red-600 mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Client *</label>
              <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} required>
                <option value="">Select client…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Title *</label>
              <input className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Web Development - Phase 1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Due Date</label>
              <input type="date" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Status</label>
              <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {['DRAFT','PENDING','PAID'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Line Items</label>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input className="col-span-5 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Description" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} />
                  <input type="number" className="col-span-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Qty" value={item.qty} onChange={e => updateItem(i, 'qty', e.target.value)} />
                  <input type="number" className="col-span-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Rate" value={item.rate} onChange={e => updateItem(i, 'rate', e.target.value)} />
                  <div className="col-span-2 text-right text-sm font-bold text-slate-700 px-2">₹{item.amount.toLocaleString()}</div>
                  <button type="button" onClick={() => setItems(prev => prev.filter((_, idx) => idx !== i))} className="col-span-1 text-slate-300 hover:text-red-500 text-center">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setItems(prev => [...prev, { description: '', qty: 1, rate: 0, amount: 0 }])}
              className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Plus size={12} /> Add Line Item
            </button>
          </div>

          {/* Totals */}
          <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span className="font-semibold">₹{subtotal.toLocaleString()}</span></div>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Tax (%)</span>
              <input type="number" className="w-20 text-right px-2 py-1 border border-slate-200 rounded-lg text-sm" value={form.tax} onChange={e => setForm(f => ({ ...f, tax: e.target.value }))} />
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-2"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Notes</label>
            <textarea rows={2} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-slate-950 text-white rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Creating…' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ totalRevenue: 0, pendingAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/invoices?${params}`);
      const data = await res.json();
      setInvoices(data.invoices || []);
      setTotal(data.total || 0);
      setStats(data.stats || { totalRevenue: 0, pendingAmount: 0 });
    } finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/invoices/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, ...(status === 'PAID' ? { paidAt: new Date().toISOString() } : {}) }) });
    fetchInvoices();
  };

  const filtered = invoices.filter(inv =>
    !search || inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
    inv.title.toLowerCase().includes(search.toLowerCase()) ||
    inv.client.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Invoices</h1>
          <p className="text-slate-500 text-sm mt-1">{total} invoices total</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-3 bg-slate-950 text-white rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all">
          <Plus size={16} /> Create Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'emerald' },
          { label: 'Pending / Overdue', value: `₹${stats.pendingAmount.toLocaleString()}`, icon: Clock, color: 'amber' },
          { label: 'Total Invoices', value: total, icon: FileText, color: 'blue' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl bg-${s.color}-50 flex items-center justify-center text-${s.color}-600`}><s.icon size={20} /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="Search by invoice #, title, client…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white font-medium text-slate-600">
          <option value="">All Status</option>
          {['DRAFT','PENDING','PAID','OVERDUE','CANCELLED'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-slate-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Receipt size={40} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400">No invoices found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Invoice #', 'Client', 'Title', 'Amount', 'Status', 'Due Date', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-mono font-bold text-slate-600">{inv.invoiceNo}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">{inv.client.companyName}</p>
                      <p className="text-xs text-slate-400">{inv.client.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 max-w-[160px] truncate">{inv.title}</td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-900">₹{inv.total.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full w-fit ${STATUS_COLORS[inv.status]}`}>
                        {STATUS_ICONS[inv.status]}{inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {inv.status !== 'PAID' && (
                          <button onClick={() => updateStatus(inv.id, 'PAID')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                            Mark Paid
                          </button>
                        )}
                        <button onClick={() => generateInvoicePDF(inv)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Download PDF">
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && <CreateInvoiceModal onClose={() => setShowModal(false)} onSave={fetchInvoices} />}
    </div>
  );
}
