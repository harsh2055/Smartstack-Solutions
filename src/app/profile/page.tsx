"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  FolderKanban, Receipt, MessageSquare, Clock, CheckCircle,
  AlertCircle, ExternalLink, Globe, Loader2, FileText,
  TrendingUp, DollarSign, Shield, User, Building2, Lock,
  Mail, Phone
} from 'lucide-react';

const PROJECT_STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; step: number }> = {
  LEAD:        { color: 'text-slate-500',   bg: 'bg-slate-100',   label: 'Lead',        step: 1 },
  DISCUSSION:  { color: 'text-blue-600',    bg: 'bg-blue-50',     label: 'Discussion',  step: 2 },
  DEMO:        { color: 'text-purple-600',  bg: 'bg-purple-50',   label: 'Demo Ready',  step: 3 },
  DEVELOPMENT: { color: 'text-amber-600',   bg: 'bg-amber-50',    label: 'Development', step: 4 },
  TESTING:     { color: 'text-orange-600',  bg: 'bg-orange-50',   label: 'Testing',     step: 5 },
  REVISION:    { color: 'text-rose-600',    bg: 'bg-rose-50',     label: 'Revision',    step: 6 },
  LIVE:        { color: 'text-emerald-600', bg: 'bg-emerald-50',  label: 'Live',        step: 7 },
  COMPLETED:   { color: 'text-green-700',   bg: 'bg-green-50',    label: 'Completed',   step: 8 },
};

const PIPELINE_STEPS = ['Discussion', 'Demo', 'Development', 'Testing', 'Revision', 'Live'];

interface Project {
  id: string; title: string; status: string; progress: number;
  deadline?: string; demoUrl?: string; liveUrl?: string; githubUrl?: string;
  description?: string;
  milestones: { id: string; title: string; isCompleted: boolean; dueDate?: string; }[];
  activityLogs: { id: string; title: string; message?: string; createdAt: string; }[];
}

interface Invoice {
  id: string; invoiceNo: string; title: string; total: number; status: string; dueDate?: string; createdAt: string;
}

interface Ticket {
  id: string; subject: string; status: string; priority: string; createdAt: string;
}

interface ClientData {
  id: string; companyName: string; contactName: string; email: string; industry?: string;
  contractSigned: boolean;
  projects: Project[];
  invoices: Invoice[];
  tickets: Ticket[];
  activityLogs: { id: string; title: string; message?: string; createdAt: string; }[];
}

function ProjectCard({ project }: { project: Project }) {
  const config = PROJECT_STATUS_CONFIG[project.status] || PROJECT_STATUS_CONFIG.LEAD;
  const currentStep = config.step - 2;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">{project.title}</h3>
          {project.description && <p className="text-sm text-slate-500 mt-1">{project.description}</p>}
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${config.bg} ${config.color}`}>{config.label}</span>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</span>
          <span className="text-sm font-bold text-slate-700">{project.progress}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-1">
        {PIPELINE_STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <div className="flex-1 text-center">
              <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                i < currentStep ? 'bg-blue-600 border-blue-600 text-white' :
                i === currentStep ? 'bg-white border-blue-500 text-blue-600' :
                'bg-white border-slate-200 text-slate-300'
              }`}>
                {i < currentStep ? '✓' : i + 1}
              </div>
              <p className={`text-[9px] font-bold mt-1 ${i <= currentStep ? 'text-slate-600' : 'text-slate-300'}`}>{step}</p>
            </div>
            {i < PIPELINE_STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i < currentStep ? 'bg-blue-500' : 'bg-slate-100'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100"><Globe size={12} /> View Demo</a>}
        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100"><ExternalLink size={12} /> View Live</a>}
        {project.deadline && <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 px-3 py-1.5"><Clock size={12} /> Deadline: {new Date(project.deadline).toLocaleDateString()}</div>}
      </div>

      {project.milestones.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Milestones</p>
          <div className="space-y-2">
            {project.milestones.map(m => (
              <div key={m.id} className="flex items-center gap-2.5">
                {m.isCompleted ? <CheckCircle size={15} className="text-emerald-500 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 shrink-0" />}
                <span className={`text-sm ${m.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>{m.title}</span>
                {m.dueDate && <span className="text-[10px] text-slate-300 ml-auto">{new Date(m.dueDate).toLocaleDateString()}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UserProfileCard({ dbUser }: { dbUser: any }) {
  const initial = dbUser?.name?.charAt(0) || dbUser?.email?.charAt(0) || '?';
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-4xl shadow-lg shadow-blue-600/20 shrink-0">
          {dbUser?.image ? <img src={dbUser.image} alt="avatar" className="w-full h-full object-cover rounded-[2rem]" /> : initial}
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{dbUser?.name || 'Unknown User'}</h2>
            <span className={`w-fit mx-auto md:mx-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${dbUser?.role === 'ADMIN' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
              {dbUser?.role === 'ADMIN' ? '⚡ Administrator' : '👤 Client Partner'}
            </span>
          </div>
          <p className="text-slate-500 font-medium mt-1">{dbUser?.jobTitle || 'Executive'} {dbUser?.company ? `at ${dbUser.company}` : ''}</p>
          
          {dbUser?.bio && (
            <p className="text-slate-500 text-sm mt-4 leading-relaxed max-w-2xl">{dbUser.bio}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm"><Mail size={14} /></div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                <p className="text-xs font-bold text-slate-700 truncate">{dbUser?.email}</p>
              </div>
            </div>
            {dbUser?.phone && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm"><Phone size={14} /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                  <p className="text-xs font-bold text-slate-700">{dbUser.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm"><Clock size={14} /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined</p>
                <p className="text-xs font-bold text-slate-700">{new Date(dbUser?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status: authStatus } = useSession();
  const [dbUser, setDbUser] = useState<any>(null);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [contractNotSigned, setContractNotSigned] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [error, setError] = useState('');

  const isAdmin = (session?.user as { role?: string })?.role === 'ADMIN';

  useEffect(() => {
    const fetchProfile = async () => {
      if (authStatus !== 'authenticated') return;
      
      try {
        // Fetch full user record
        const userRes = await fetch('/api/profile');
        if (userRes.ok) setDbUser(await userRes.json());

        if (isAdmin) { 
          setLoading(false); 
          return; 
        }

        // Fetch client portal data for non-admins
        const res = await fetch('/api/client-portal');
        if (res.status === 403) {
          const d = await res.json();
          if (d.error === 'CONTRACT_NOT_SIGNED') setContractNotSigned(true);
          setLoading(false); return;
        }
        if (!res.ok) { setError('Could not load client data.'); setLoading(false); return; }
        setClientData(await res.json());
      } catch { setError('Something went wrong.'); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [authStatus, isAdmin]);

  if (authStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center"><Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-4" /><p className="text-slate-500 font-medium">Loading your profile…</p></div>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center max-w-md w-full">
          <Shield size={40} className="text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign In Required</h2>
          <p className="text-slate-500 mb-6">Please sign in to view your profile.</p>
          <a href="/login" className="block w-full py-3 bg-slate-950 text-white rounded-xl font-bold text-sm hover:scale-105 transition-all">Sign In</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User size={20} className="text-slate-600" />
            <p className="font-bold text-slate-900 text-sm">My Profile</p>
          </div>
          {isAdmin && (
            <a href="/admin" className="flex items-center gap-2 text-xs font-bold px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              Admin Dashboard <ExternalLink size={12} />
            </a>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* User Profile Card */}
        <UserProfileCard dbUser={dbUser || session?.user} />

        {/* Admin: No client dashboard */}
        {isAdmin && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
            <Building2 size={32} className="text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-1">Administrator Account</h3>
            <p className="text-slate-500 text-sm">Your admin dashboard is available at <a href="/admin" className="text-blue-600 font-bold hover:underline">/admin</a></p>
          </div>
        )}

        {/* Contract not signed */}
        {!isAdmin && contractNotSigned && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Contract Pending</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">Your client dashboard will be unlocked once your contract is signed. Please contact us to proceed.</p>
            <a href="/contact" className="inline-block mt-6 px-6 py-3 bg-slate-950 text-white rounded-xl font-bold text-sm hover:scale-105 transition-all">Contact Us</a>
          </div>
        )}

        {/* Client Dashboard */}
        {!isAdmin && clientData && (() => {
          const activeProjects = clientData.projects.filter(p => !['COMPLETED', 'CANCELLED'].includes(p.status));
          const totalRevenue = clientData.invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.total, 0);
          const pendingInvoices = clientData.invoices.filter(i => i.status === 'PENDING' || i.status === 'OVERDUE');
          const openTickets = clientData.tickets.filter(t => t.status === 'OPEN').length;
          const tabs = [
            { id: 'projects', label: 'Projects', count: clientData.projects.length },
            { id: 'invoices', label: 'Invoices', count: clientData.invoices.length },
            { id: 'tickets', label: 'Support', count: clientData.tickets.length },
          ];

          return (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-950">Welcome back, <span className="text-blue-600">{clientData.contactName.split(' ')[0]}</span></h1>
                <p className="text-slate-500 mt-1">Here&apos;s an overview of your projects and account.</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Active Projects', value: activeProjects.length, icon: FolderKanban, color: 'blue' },
                  { label: 'Total Paid', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'emerald' },
                  { label: 'Pending Invoices', value: pendingInvoices.length, icon: Receipt, color: 'amber' },
                  { label: 'Support Tickets', value: clientData.tickets.length, icon: MessageSquare, color: 'purple' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className={`w-10 h-10 rounded-xl bg-${s.color}-50 flex items-center justify-center text-${s.color}-600 mb-3`}><s.icon size={20} /></div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                    <p className="text-2xl font-bold text-slate-950 mt-1">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-1 bg-slate-100 rounded-2xl p-1.5 w-fit">
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    {t.label}
                    {t.count > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${activeTab === t.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>{t.count}</span>}
                  </button>
                ))}
              </div>

              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {clientData.projects.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
                      <TrendingUp size={40} className="text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 font-medium">No projects yet</p>
                    </div>
                  ) : clientData.projects.map(project => <ProjectCard key={project.id} project={project} />)}
                </div>
              )}

              {activeTab === 'invoices' && (
                <div className="space-y-4">
                  {clientData.invoices.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-slate-100"><FileText size={40} className="text-slate-200 mx-auto mb-4" /><p className="text-slate-400">No invoices yet</p></div>
                  ) : (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-slate-50"><h3 className="font-bold text-slate-900">Invoice History</h3></div>
                      <div className="divide-y divide-slate-50">
                        {clientData.invoices.map(inv => (
                          <div key={inv.id} className="px-5 py-4 flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{inv.title}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{inv.invoiceNo} · {new Date(inv.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900">₹{inv.total.toLocaleString()}</p>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : inv.status === 'OVERDUE' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>{inv.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'tickets' && (
                <div className="space-y-4">
                  {clientData.tickets.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-slate-100"><MessageSquare size={40} className="text-slate-200 mx-auto mb-4" /><p className="text-slate-400">No support tickets</p></div>
                  ) : (
                    <div className="space-y-3">
                      {clientData.tickets.map(ticket => (
                        <div key={ticket.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {ticket.status === 'OPEN' ? <AlertCircle size={16} className="text-red-500" /> : ticket.status === 'RESOLVED' ? <CheckCircle size={16} className="text-emerald-500" /> : <Clock size={16} className="text-amber-500" />}
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{ticket.subject}</p>
                              <p className="text-xs text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ticket.status === 'OPEN' ? 'bg-red-50 text-red-600' : ticket.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'}`}>{ticket.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* No client account */}
        {!isAdmin && !clientData && !contractNotSigned && error && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 text-center">
            <AlertCircle size={40} className="text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Client Account Found</h3>
            <p className="text-slate-500 text-sm">{error || "Your account isn't linked to a client profile yet. Please contact our team."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
