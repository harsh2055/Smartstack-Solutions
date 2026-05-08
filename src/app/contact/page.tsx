"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Send, MapPin, Mail, Phone, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      companySize: formData.get('companySize'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const err = await res.json();
        setError(err.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-950 mb-6 tracking-tight">Let&apos;s Build the Future</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Ready to scale your business with precision automation? Drop us a line and our solution architects will reach out within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner">
                  <CheckCircle2 size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-950">Inquiry Received</h3>
                  <p className="text-slate-500 mt-2 max-w-sm mx-auto">We&apos;ve dispatched your request to our lead architects. Check your inbox for a confirmation shortly.</p>
                </div>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-8 py-3 bg-slate-950 text-white font-bold rounded-xl hover:scale-105 transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                    <input name="firstName" required type="text" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-medium placeholder:text-slate-300" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                    <input name="lastName" required type="text" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-medium placeholder:text-slate-300" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                  <input name="email" required type="email" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-medium placeholder:text-slate-300" placeholder="john@company.com" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Company Size</label>
                  <select name="companySize" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-medium appearance-none">
                    <option>Startup (1-10)</option>
                    <option>SMB (11-50)</option>
                    <option>Mid-Market (51-200)</option>
                    <option>Enterprise (201+)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">How can we help?</label>
                  <textarea name="message" required rows={4} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600/20 transition-all font-medium placeholder:text-slate-300 resize-none" placeholder="Tell us about your project or challenges..."></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white font-bold px-8 py-5 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Secure Strategy Session 
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <div className="flex flex-col justify-between py-4">
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-bold text-slate-950 mb-8">Connect Directly</h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Email Inquiry</h4>
                      <p className="text-slate-500 mt-1">hello@smartstack-solutions.com</p>
                      <p className="text-xs text-blue-600 font-bold mt-2 uppercase tracking-widest">Avg response: 4h</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Priority Line</h4>
                      <p className="text-slate-500 mt-1">+1 (800) 123-4567</p>
                      <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-widest">Mon-Fri, 9am - 6pm PST</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-950 rounded-[2rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
                <h4 className="text-xl font-bold mb-3">Innovation Partnership</h4>
                <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                  We don&apos;t just build software; we architect the autonomous operational future of your enterprise.
                </p>
                <Link href="/solutions" className="text-blue-400 font-bold hover:text-blue-300 transition-colors flex items-center gap-2 group/link">
                  Explore Architecture <ArrowUpRight size={18} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-6 pt-12 border-t border-slate-100">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white" />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Trusted by 50+ Enterprises
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
