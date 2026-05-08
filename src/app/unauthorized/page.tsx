"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10 text-center"
      >
        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 border border-red-50">
          <ShieldAlert size={40} className="text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-950 mb-4">Access Denied</h1>
        <p className="text-slate-500 mb-10 leading-relaxed font-medium">
          Your credentials do not grant access to this high-security sector. Please contact your system administrator if you believe this is an error.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-4 bg-slate-950 text-white rounded-2xl font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <ArrowLeft size={18} /> Return Home
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
          >
            <Lock size={18} /> Switch Account
          </Link>
        </div>
        
        <p className="mt-12 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          Restricted Protocol 403 • Unauthorized Entry Logged
        </p>
      </motion.div>
    </div>
  );
}
