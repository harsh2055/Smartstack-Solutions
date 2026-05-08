import React from 'react';
import { db } from '@/lib/prisma';
import { Users, Briefcase, FileText, CreditCard, ArrowUpRight, Plus, Activity, Zap, TrendingUp, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getData() {
  const [userCount, serviceCount, projectCount, planCount, recentUsers, recentProjects] = await Promise.all([
    db.user.count(),
    db.service.count(),
    db.caseStudy.count(),
    db.pricingPlan.count(),
    db.user.findMany({ take: 5, orderBy: { id: 'desc' }, select: { id: true, name: true, email: true, role: true } }),
    db.caseStudy.findMany({ take: 3, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, client: true, createdAt: true } }),
  ]);
  return { 
    stats: { users: userCount, services: serviceCount, projects: projectCount, plans: planCount },
    recentUsers,
    recentProjects
  };
}

export default async function AdminDashboard() {
  const { stats, recentUsers, recentProjects } = await getData();

  const cards = [
    { name: 'Total Users', value: stats.users, icon: Users, href: '/admin/users', color: 'blue', trend: '+12%' },
    { name: 'Active Services', value: stats.services, icon: Briefcase, href: '/admin/services', color: 'indigo', trend: 'Stable' },
    { name: 'Case Studies', value: stats.projects, icon: FileText, href: '/admin/projects', color: 'emerald', trend: '+2 this month' },
    { name: 'Pricing Plans', value: stats.plans, icon: CreditCard, href: '/admin/pricing', color: 'amber', trend: 'Updated' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950">Control Center</h1>
          <p className="text-slate-500 text-sm mt-1">Intelligence and management oversight.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/projects"
            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-950 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
          >
            Manage Data
          </Link>
          <Link
            href="/admin/pricing"
            className="flex items-center gap-2 px-5 py-3 bg-slate-950 text-white rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all"
          >
            <Plus size={16} /> New Plan
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-2xl bg-${card.color}-50 flex items-center justify-center text-${card.color}-600 group-hover:scale-110 transition-transform`}>
                <card.icon size={22} />
              </div>
              <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-tight">
                {card.trend}
              </div>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{card.name}</p>
            <h3 className="text-3xl font-bold text-slate-950 tracking-tight">{card.value}</h3>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Analytics Visualization (CSS-based) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-950">Platform Growth</h3>
                <p className="text-xs text-slate-500 font-medium">User acquisition vs infrastructure scale</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-blue-600" /> Users
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-indigo-200" /> Capacity
                </div>
              </div>
            </div>
            
            {/* Mock Chart */}
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-100">
              {[45, 62, 58, 75, 90, 85, 95, 110, 105, 120, 135, 150].map((val, i) => (
                <div key={i} className="flex-1 group relative flex flex-col items-center gap-2">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    +{val} users
                  </div>
                  <div 
                    className="w-full bg-indigo-100 rounded-t-lg transition-all" 
                    style={{ height: `${(val / 150) * 80}%` }} 
                  />
                  <div 
                    className="w-full bg-blue-600 rounded-t-lg absolute bottom-0 transition-all group-hover:bg-blue-500" 
                    style={{ height: `${(val / 150) * 60}%` }} 
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Recent Users List */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 overflow-hidden">
              <h3 className="font-bold text-slate-950 flex items-center gap-2 mb-6 text-sm uppercase tracking-widest">
                <Users size={16} className="text-blue-600" />
                Recent Users
              </h3>
              <div className="space-y-4">
                {recentUsers.length > 0 ? recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                      {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name || 'Anonymous'}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border tracking-tighter ${
                      user.role === 'ADMIN' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 text-center py-4">No users found.</p>
                )}
              </div>
              <Link href="/admin/users" className="block text-center mt-6 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                View All Users
              </Link>
            </div>

            {/* Recent Case Studies */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 overflow-hidden">
              <h3 className="font-bold text-slate-950 flex items-center gap-2 mb-6 text-sm uppercase tracking-widest">
                <FileText size={16} className="text-emerald-600" />
                Latest Work
              </h3>
              <div className="space-y-4">
                {recentProjects.length > 0 ? recentProjects.map((project) => (
                  <div key={project.id} className="group flex flex-col gap-1 p-3 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600">{project.title}</h4>
                      <ArrowUpRight size={14} className="text-slate-300 group-hover:text-blue-600" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">Client: {project.client || 'Internal'}</p>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 text-center py-4">No case studies found.</p>
                )}
              </div>
              <Link href="/admin/projects" className="block text-center mt-6 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                Manage Portfolio
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Actions/Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Stats Sidebar */}
          <div className="bg-slate-950 rounded-[2rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <h3 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-slate-500">Security & Health</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 border border-white/10">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">Secure Access</p>
                  <p className="text-[10px] text-slate-400">Enterprise grade TLS active</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 border border-white/10">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">System Load</p>
                  <div className="mt-2 h-1 w-32 bg-white/10 rounded-full">
                    <div className="h-full w-[24%] bg-blue-500 rounded-full" />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">24% Infrastructure utilization</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-400 border border-white/10">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">Automation Loop</p>
                  <p className="text-[10px] text-slate-400">Next cycle in 4m 12s</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">Production Operational</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <h3 className="font-bold mb-6 text-xs uppercase tracking-widest text-slate-400">Management</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Services', icon: Briefcase, href: '/admin/services' },
                { label: 'Pricing', icon: CreditCard, href: '/admin/pricing' },
                { label: 'Users', icon: Users, href: '/admin/users' },
                { label: 'Portfolio', icon: FileText, href: '/admin/projects' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                >
                  <item.icon size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-900 uppercase tracking-tighter">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
