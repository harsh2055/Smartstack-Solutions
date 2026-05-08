"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, LogOut, LayoutDashboard, ChevronDown, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();

  const isHidden = pathname?.startsWith('/admin');

  const navLinks = [
    { name: 'Solutions', href: '/solutions' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Services', href: '/services' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Developers', href: '/developers' },
  ];

  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isHidden) return;
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHidden]);

  return (
    <AnimatePresence>
      {!isHidden && (
        <>
          <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 sm:px-6 pointer-events-none">
        <nav className={`w-full max-w-7xl px-5 py-3 flex items-center justify-between transition-all duration-500 pointer-events-auto ${
          isScrolled ? 'bg-white/90 backdrop-blur-2xl border border-slate-200/60 rounded-2xl shadow-lg' : 'bg-transparent'
        }`}>
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-md border border-slate-100 group-hover:shadow-blue-500/10 transition-all">
              <Image src="/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-950 tracking-tighter leading-tight">
                Smartstack<span className="text-blue-600">.</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none hidden sm:block">Solutions</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center bg-white/70 backdrop-blur-xl px-2 py-1.5 rounded-xl border border-white/60 shadow-sm gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  pathname === link.href
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all"
                >
                  <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {session.user?.name?.charAt(0) ?? 'U'}
                  </div>
                  {session.user?.name?.split(' ')[0]}
                  <ChevronDown size={14} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden"
                    >
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <LayoutDashboard size={15} /> Admin Panel
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User size={15} /> My Profile
                      </Link>
                      <button
                        onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors">
                  Sign In
                </Link>
                <Link href="/contact" className="flex items-center gap-2 bg-slate-950 text-white font-bold px-4 py-2 rounded-xl text-sm hover:scale-105 transition-all shadow-lg">
                  Get Started <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <span className="font-bold text-slate-950">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 p-5 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      pathname === link.href
                        ? 'bg-slate-950 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="p-5 border-t border-slate-100 space-y-3">
                {session ? (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {session.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-950">{session.user?.name}</p>
                        <p className="text-[10px] text-slate-400">{session.user?.email}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <LayoutDashboard size={15} /> Admin Panel
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <User size={15} /> My Profile
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }); }}
                      className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-700 border border-slate-200 text-center hover:bg-slate-50 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold bg-slate-950 text-white hover:bg-slate-800 transition-colors"
                    >
                      Get Started <ArrowRight size={14} />
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )}
</AnimatePresence>
  );
}
