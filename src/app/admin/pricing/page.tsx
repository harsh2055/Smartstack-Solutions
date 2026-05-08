"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Edit3, CheckCircle2, X, CreditCard,
  Zap, Loader2, AlertCircle
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: string;
  priceYearly: string;
  description: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
}

const emptyForm = () => ({
  name: '', priceMonthly: '', priceYearly: '', description: '',
  features: '', isPopular: false, ctaText: 'Get Started',
});

export default function AdminPricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<PricingPlan | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState(emptyForm());

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPlans = useCallback(async () => {
    try {
      const res = await fetch('/api/pricing');
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch { setPlans([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const openCreate = () => {
    setEditPlan(null);
    setForm(emptyForm());
    setIsModalOpen(true);
  };

  const openEdit = (plan: PricingPlan) => {
    setEditPlan(plan);
    setForm({
      name: plan.name,
      priceMonthly: plan.priceMonthly,
      priceYearly: plan.priceYearly,
      description: plan.description || '',
      features: plan.features.join(', '),
      isPopular: plan.isPopular,
      ctaText: plan.ctaText,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      ...form,
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
    };
    try {
      if (editPlan) {
        const res = await fetch(`/api/pricing/${editPlan.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Update failed');
        showToast('Plan updated', 'success');
      } else {
        const res = await fetch('/api/pricing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Create failed');
        showToast('Plan created', 'success');
      }
      setIsModalOpen(false);
      fetchPlans();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this pricing plan?')) return;
    try {
      await fetch(`/api/pricing/${id}`, { method: 'DELETE' });
      showToast('Plan deleted', 'success');
      fetchPlans();
    } catch {
      showToast('Delete failed', 'error');
    }
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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950">Pricing Plans</h1>
          <p className="text-slate-500 text-sm mt-1">Manage how you package and sell your services.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-slate-950 text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg self-start sm:self-auto"
        >
          <Plus size={18} /> Add Plan
        </button>
      </div>

      {loading ? (
        <div className="h-56 flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={28} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <motion.div
              layout key={plan.id}
              className={`bg-white rounded-2xl p-6 border-2 flex flex-col transition-all ${
                plan.isPopular ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              {plan.isPopular && (
                <div className="inline-flex items-center gap-1 self-start mb-4 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  <Zap size={10} fill="currentColor" /> Most Popular
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-950 mb-1">{plan.name}</h3>
                <p className="text-slate-500 text-sm">{plan.description}</p>
              </div>
              <div className="space-y-1 mb-5">
                <div className="text-2xl font-bold text-slate-950">
                  {plan.priceMonthly}<span className="text-slate-400 text-sm font-medium ml-1">/mo</span>
                </div>
                <div className="text-xl font-bold text-blue-600/60">
                  {plan.priceYearly}<span className="text-slate-400 text-sm font-medium ml-1">/yr</span>
                </div>
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 size={14} className="text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-slate-600">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => openEdit(plan)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}

          {plans.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <CreditCard size={32} className="text-slate-200 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 mb-1">No plans yet</h3>
              <p className="text-sm text-slate-400">Create your first pricing plan.</p>
            </div>
          )}
        </div>
      )}

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
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-950">
                  {editPlan ? 'Edit Plan' : 'Create Plan'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Plan Name</label>
                  <input
                    required value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Pro"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Monthly Price</label>
                    <input
                      required value={form.priceMonthly}
                      onChange={(e) => setForm(f => ({ ...f, priceMonthly: e.target.value }))}
                      placeholder="e.g. ₹4,999"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Yearly Price</label>
                    <input
                      required value={form.priceYearly}
                      onChange={(e) => setForm(f => ({ ...f, priceYearly: e.target.value }))}
                      placeholder="e.g. ₹49,999"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={2}
                    placeholder="Brief description of this plan..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Features (comma-separated)</label>
                  <textarea
                    required value={form.features}
                    onChange={(e) => setForm(f => ({ ...f, features: e.target.value }))}
                    rows={4}
                    placeholder="Feature 1, Feature 2, Feature 3..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Button Text</label>
                  <input
                    value={form.ctaText}
                    onChange={(e) => setForm(f => ({ ...f, ctaText: e.target.value }))}
                    placeholder="Get Started"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={(e) => setForm(f => ({ ...f, isPopular: e.target.checked }))}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span className="text-sm font-bold text-slate-700">Mark as "Most Popular"</span>
                </label>

                <button
                  disabled={saving} type="submit"
                  className="w-full py-3.5 bg-slate-950 text-white rounded-xl font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : (editPlan ? 'Save Changes' : 'Create Plan')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
