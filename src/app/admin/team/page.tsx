"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { UserCog, Plus, Mail, Loader2, X, Edit2, Trash2, MoreHorizontal } from 'lucide-react';

interface TeamMember {
  id: string; name: string; email: string; role: string;
  department?: string; skills: string[]; isActive: boolean; joinedAt: string;
}

const DEPT_COLORS: Record<string, string> = {
  Engineering: 'bg-blue-50 text-blue-700',
  Design: 'bg-purple-50 text-purple-700',
  Marketing: 'bg-pink-50 text-pink-700',
  Sales: 'bg-amber-50 text-amber-700',
  Support: 'bg-emerald-50 text-emerald-700',
};

function MemberModal({ 
  onClose, 
  onSave, 
  initialData 
}: { 
  onClose: () => void; 
  onSave: (m: TeamMember) => void;
  initialData?: TeamMember;
}) {
  const [form, setForm] = useState({ 
    name: initialData?.name || '', 
    email: initialData?.email || '', 
    role: initialData?.role || '', 
    department: initialData?.department || '', 
    skillsText: initialData?.skills.join(', ') || '',
    isActive: initialData?.isActive ?? true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initialData ? `/api/team/${initialData.id}` : '/api/team';
      const method = initialData ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...form, 
          skills: form.skillsText.split(',').map(s => s.trim()).filter(Boolean) 
        }),
      });
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
          <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Edit' : 'Add'} Team Member</h2>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>
        {error && <p className="text-sm text-red-600 mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name *', key: 'name', type: 'text', required: true },
            { label: 'Email *', key: 'email', type: 'email', required: true },
            { label: 'Role / Title *', key: 'role', type: 'text', required: true },
            { label: 'Department', key: 'department', type: 'text', required: false },
            { label: 'Skills (comma separated)', key: 'skillsText', type: 'text', required: false },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">{f.label}</label>
              <input
                type={f.type}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form[f.key as keyof typeof form] as string}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                required={f.required}
                placeholder={f.key === 'skillsText' ? 'React, TypeScript, Node.js' : ''}
              />
            </div>
          ))}
          
          <div className="flex items-center gap-2 py-2">
            <input 
              type="checkbox" 
              id="isActive" 
              checked={form.isActive}
              onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Active Team Member</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-slate-950 text-white rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Saving…' : (initialData ? 'Update' : 'Add Member')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<{show: boolean, data?: TeamMember}>({ show: false });

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/team');
      if (!res.ok) throw new Error('Failed to fetch members');
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch { setMembers([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    try {
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      alert('Failed to delete member');
    }
  };

  const departments = [...new Set(members.map(m => m.department).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Team</h1>
          <p className="text-slate-500 text-sm mt-1">{members.length} team members · {departments.length} departments</p>
        </div>
        <button onClick={() => setModalState({ show: true })} className="flex items-center gap-2 px-5 py-3 bg-slate-950 text-white rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all">
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Department Summary */}
      {departments.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {departments.map(dept => (
            <div key={dept} className={`px-4 py-2 rounded-xl text-sm font-bold ${DEPT_COLORS[dept!] || 'bg-slate-100 text-slate-600'}`}>
              {dept} · {members.filter(m => m.department === dept).length}
            </div>
          ))}
        </div>
      )}

      {/* Members Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-slate-400" /></div>
      ) : members.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <UserCog size={40} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No team members yet</p>
          <button onClick={() => setModalState({ show: true })} className="mt-4 px-5 py-2.5 bg-slate-950 text-white rounded-xl font-bold text-sm">Add First Member</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {members.map(member => (
            <div key={member.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all relative">
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setModalState({ show: true, data: member })}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(member.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{member.name}</p>
                  <p className="text-xs text-slate-400 truncate">{member.role}</p>
                </div>
                {member.isActive && <div className="w-2 h-2 rounded-full bg-emerald-500" title="Active" />}
              </div>
              {member.department && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 inline-block ${DEPT_COLORS[member.department] || 'bg-slate-100 text-slate-500'}`}>
                  {member.department}
                </span>
              )}
              {member.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {member.skills.slice(0, 4).map(skill => (
                    <span key={skill} className="text-[10px] font-semibold px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-full">{skill}</span>
                  ))}
                  {member.skills.length > 4 && <span className="text-[10px] text-slate-400">+{member.skills.length - 4}</span>}
                </div>
              )}
              <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 transition-colors">
                <Mail size={12} /> {member.email}
              </a>
            </div>
          ))}
        </div>
      )}

      {modalState.show && (
        <MemberModal 
          onClose={() => setModalState({ show: false })} 
          onSave={m => { 
            if (modalState.data) {
              setMembers(prev => prev.map(old => old.id === m.id ? m : old));
            } else {
              setMembers(prev => [m, ...prev]); 
            }
          }} 
          initialData={modalState.data}
        />
      )}
    </div>
  );
}

