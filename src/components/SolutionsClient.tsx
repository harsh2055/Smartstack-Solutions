"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ShoppingBag, 
  Stethoscope, 
  GraduationCap, 
  ArrowRight,
  Globe
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as any } }
};

export default function SolutionsClient() {
  return (
    <div className="bg-white min-h-screen selection:bg-blue-100 selection:text-blue-900">
      {/* Header - Premium Redesign */}
      <section className="relative pt-48 pb-32 px-6 text-center max-w-5xl mx-auto overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50/50 rounded-full blur-[120px] -z-10"></div>
        
        <motion.div 
          initial="hidden" animate="visible" variants={fadeIn}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-10"
        >
          Integrated Intelligence
        </motion.div>
        
        <motion.h1 
          initial="hidden" animate="visible" variants={fadeIn}
          className="text-5xl md:text-[5.5rem] font-bold text-slate-950 mb-10 font-display leading-[1.1]"
        >
          Approachable <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">AI Solutions</span>
        </motion.h1>
        
        <motion.p 
          initial="hidden" animate="visible" variants={fadeIn}
          className="text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto font-medium"
        >
          We bridge the gap between complex automation and human-centric experiences. Our tailored systems don't just solve problems—they build trust and scale operations.
        </motion.p>
      </section>

      {/* Solutions Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-40 space-y-48">
        
        {/* Coaching Institute */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="grid lg:grid-cols-2 gap-24 items-center"
        >
          <div className="space-y-10 order-2 lg:order-1">
            <div className="flex items-center gap-4 text-blue-600">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm">
                <GraduationCap size={32} />
              </div>
              <h2 className="text-4xl font-bold text-slate-950 font-display tracking-tight">Coaching Institute AI</h2>
            </div>
            <p className="text-slate-500 leading-relaxed text-lg font-medium">
              Empower students with a warm, intuitive scheduling assistant that understands academic goals and personal pace. This system transforms the enrollment funnel into a conversation.
            </p>
            <div className="grid gap-6">
              {[
                { title: 'Warm Student-First Scheduling', desc: 'Natural language processing that handles complex calendar conflicts with empathy.' },
                { title: 'Goal Alignment Engine', desc: 'AI that suggests courses based on the student\'s career aspirations and current skill level.' },
                { title: 'Proactive Reminders', desc: 'Supportive notifications that encourage progress without being intrusive.' }
              ].map((f, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="mt-1 bg-blue-500 text-white rounded-full p-1.5 h-fit shadow-lg shadow-blue-500/20">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-950 text-base mb-1">{f.title}</div>
                    <div className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6">
              <Link href="/contact" className="group bg-slate-950 text-white font-bold px-10 py-5 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-slate-950/10 flex items-center gap-3 w-fit">
                View Live Demo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative aspect-[4/3] bg-slate-50 rounded-[3.5rem] p-4 shadow-2xl border border-slate-100 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent"></div>
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-white shadow-inner bg-white">
              <Image src="/coaching-mockup.png" alt="Coaching AI Dashboard" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
          </div>
        </motion.div>

        {/* Clinic AI System */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="grid lg:grid-cols-2 gap-24 items-center"
        >
          <div className="relative aspect-[4/3] bg-slate-950 rounded-[3.5rem] p-4 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 noise opacity-20"></div>
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
               <Image src="/clinic-mockup.png" alt="Clinic Management" fill className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80" />
            </div>
          </div>
          <div className="space-y-10">
            <div className="flex items-center gap-4 text-blue-500">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-sm">
                <Stethoscope size={32} />
              </div>
              <h2 className="text-4xl font-bold text-slate-950 font-display tracking-tight">Clinic AI Ecosystem</h2>
            </div>
            <p className="text-slate-500 leading-relaxed text-lg font-medium">
              Experience HIPAA-compliant automation that prioritizes patient dignity. Our clinical AI manages intake and follow-ups so your team can focus on face-to-face care.
            </p>
            <div className="grid gap-6">
              {[
                { title: 'Empathetic Care Triage', desc: 'Advanced sentiment analysis that identifies urgent patient needs with compassionate response logic.' },
                { title: 'Automated HIPAA Compliance', desc: 'End-to-end encrypted data processing with automated audit logs for every interaction.' },
                { title: 'Smooth Intake Flow', desc: 'Frictionless digital forms that adapt based on patient history and symptoms.' }
              ].map((f, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="mt-1 bg-blue-500 text-white rounded-full p-1.5 h-fit shadow-lg shadow-blue-500/20">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-950 text-base mb-1">{f.title}</div>
                    <div className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6">
              <Link href="/contact" className="group bg-slate-950 text-white font-bold px-10 py-5 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-slate-950/10 flex items-center gap-3 w-fit">
                Request Case Study <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Clothing Shop AI System */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="grid lg:grid-cols-2 gap-24 items-center"
        >
          <div className="space-y-10 order-2 lg:order-1">
            <div className="flex items-center gap-4 text-blue-600">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm">
                <ShoppingBag size={32} />
              </div>
              <h2 className="text-4xl font-bold text-slate-950 font-display tracking-tight">Clothing Shop AI</h2>
            </div>
            <p className="text-slate-500 leading-relaxed text-lg font-medium">
              Bridge the gap between digital efficiency and the tactile world of fashion. Our inventory AI predicts trends while keeping your brand's unique voice front and center.
            </p>
            <div className="grid gap-6">
              {[
                { title: 'AI Inventory with a Human Touch', desc: 'Demand forecasting that respects artisan cycles and limited release patterns.' },
                { title: 'Personal Style Concierge', desc: 'Virtual assistants that curate outfits based on weather, occasion, and previous favorites.' },
                { title: 'Smart Visual Merchandising', desc: 'AI-driven storefront layouts that adapt to local trends and visitor preferences in real-time.' }
              ].map((f, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="mt-1 bg-blue-500 text-white rounded-full p-1.5 h-fit shadow-lg shadow-blue-500/20">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-950 text-base mb-1">{f.title}</div>
                    <div className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6">
              <Link href="/contact" className="group bg-slate-950 text-white font-bold px-10 py-5 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-slate-950/10 flex items-center gap-3 w-fit">
                Explore Commerce <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative aspect-[4/3] bg-[#F5F2F0] rounded-[3.5rem] p-4 shadow-2xl border border-slate-200 overflow-hidden group">
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-white shadow-2xl bg-white">
              <Image src="/clothing-mockup.png" alt="E-commerce AI" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
          </div>
        </motion.div>

        {/* High-End CTA */}
        <section className="pt-20">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="bg-slate-950 rounded-[4rem] p-20 md:p-32 text-center text-white relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute inset-0 noise opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-12">
              <h2 className="text-4xl md:text-[5rem] font-bold leading-[0.95] font-display">Ready to humanize <span className="text-blue-500">automation?</span></h2>
              <p className="text-slate-400 text-xl font-medium leading-relaxed">Join the forward-thinking enterprises that are building deeper connections through smarter technology.</p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link href="/contact" className="bg-white text-slate-950 font-bold px-12 py-6 rounded-2xl hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
                  Start Your Project <ArrowRight size={20} />
                </Link>
                <Link href="/contact" className="bg-white/5 border border-white/10 text-white font-bold px-12 py-6 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3">
                  Book a Consultation <Globe size={20} />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

      </section>
    </div>
  );
}
