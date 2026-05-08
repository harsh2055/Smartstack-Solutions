"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Briefcase, FileText, CreditCard,
  Users, LogOut, ChevronRight, Bell, Menu, X, Shield, User,
  Building2, TrendingUp, Receipt, UserCog, HeadphonesIcon,
  Folder
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

const navSections = [
  {
    label: 'Overview',
    links: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'CRM',
    links: [
      { name: 'Clients', href: '/admin/clients', icon: Building2 },
      { name: 'Leads', href: '/admin/leads', icon: TrendingUp },
      { name: 'Invoices', href: '/admin/invoices', icon: Receipt },
    ],
  },
  {
    label: 'Operations',
    links: [
      { name: 'Team', href: '/admin/team', icon: UserCog },
      { name: 'Support', href: '/admin/support', icon: HeadphonesIcon },
      { name: 'Files', href: '/admin/files', icon: Folder },
    ],
  },
  {
    label: 'Content',
    links: [
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Services', href: '/admin/services', icon: Briefcase },
      { name: 'Portfolio', href: '/admin/projects', icon: FileText },
      { name: 'Pricing', href: '/admin/pricing', icon: CreditCard },
      { name: 'Developers', href: '/admin/developers', icon: User },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-950 rounded-xl flex items-center justify-center">
            <Image src="/logo.png" alt="Logo" width={20} height={20} className="object-contain" />
          </div>
          <span className="text-lg font-bold text-slate-950 tracking-tighter">
            Smartstack<span className="text-blue-600">.</span>
          </span>
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-slate-700">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-3 mb-2">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.links.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${
                      active
                        ? 'bg-slate-950 text-white shadow-lg'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon size={17} className={active ? 'text-blue-400' : ''} />
                      <span className="text-sm font-semibold">{link.name}</span>
                    </div>
                    {active && <ChevronRight size={13} />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {session?.user?.name?.charAt(0) ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-950 truncate">{session?.user?.name ?? 'Admin'}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Shield size={8} /> Admin
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-600 font-bold hover:bg-red-50 transition-all text-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 lg:flex-none" />

          <div className="flex items-center gap-3">
            <button className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-100 relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-950">{session?.user?.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {session?.user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
