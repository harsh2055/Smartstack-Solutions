"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import {
  ArrowRight, Bot, Code, Layers, Zap, CheckCircle2, Rocket,
  Activity, ArrowUpRight, Globe, Star, ShieldCheck, TrendingUp, Settings,
  MessageSquare, Cpu
} from 'lucide-react';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function HomeClient({ services }: { services: any[] }) {
  return (
    <div className="relative flex flex-col items-center overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] sm:w-[1000px] sm:h-[1000px] bg-blue-50/50 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] bg-indigo-50/30 rounded-full blur-[100px] translate-x-1/4" />
      </div>

      {/* Hero */}
      <section className="relative w-full max-w-7xl px-4 sm:px-6 pt-24 sm:pt-36 pb-16 sm:pb-28">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial="hidden" animate="visible" variants={stagger}
            className="flex flex-col items-start space-y-6 sm:space-y-8"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-[0.2em]">
              Next-Gen Solutions
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-[clamp(2.5rem,8vw,4.5rem)] font-bold tracking-tight text-slate-950 leading-[1.1] sm:leading-[1.05]">
              Elevate Your <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400">
                Digital Intelligence
              </span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed">
              We bridge the gap between complex technology and human-centric experiences. SmartStack builds the digital infrastructure that powers modern businesses.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/solutions"
                className="group relative bg-slate-950 text-white font-bold px-7 py-4 rounded-2xl overflow-hidden shadow-xl shadow-slate-950/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Project <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="/case-studies"
                className="flex items-center justify-center gap-2 text-slate-900 font-bold px-7 py-4 rounded-2xl hover:bg-slate-50 transition-all border border-slate-200"
              >
                View Our Work
              </Link>
            </motion.div>

            <motion.div variants={fadeIn} className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
              {['HIPAA Compliant', 'Enterprise Ready', '50+ Projects Delivered'].map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle2 size={14} className="text-blue-600" />
                  <span className="font-medium">{badge}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image - visible on all, optimized for mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-8 lg:mt-0"
          >
            <div className="relative w-full aspect-[4/3] lg:aspect-[4/5] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/50">
              <Image
                src="/hero-bg.png"
                alt="SmartStack Platform"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/30 via-transparent to-transparent" />
            </div>

            {/* Floating Card - Responsive */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -top-4 -right-4 sm:-top-8 sm:-right-8 bg-white/90 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white shadow-2xl"
            >
              <div className="bg-blue-600 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-2 sm:mb-4">
                <TrendingUp size={16} />
              </div>
              <div className="text-xl sm:text-3xl font-bold text-slate-950 mb-1">99.9%</div>
              <div className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Uptime</div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 -left-4 sm:-bottom-8 sm:-left-8 bg-slate-950 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl flex items-center gap-3 sm:gap-4 text-white"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl overflow-hidden bg-white/10 flex items-center justify-center">
                <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                  <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[8px] sm:text-xs font-bold text-blue-400 uppercase tracking-widest">Active</span>
                </div>
                <p className="text-[8px] sm:text-xs text-slate-400">Infrastructure sync</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="w-full bg-slate-50 py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 mb-3">Our Service Ecosystem</h2>
              <p className="text-slate-500 text-base sm:text-lg max-w-xl">Precision-engineered tools to transform your business.</p>
            </div>
            <Link
              href="/services"
              className="flex items-center gap-2 text-slate-950 font-bold bg-white px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 shrink-0"
            >
              All Services <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, idx) => (
              <motion.div
                key={s.id}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group ${
                  s.isPopular ? 'lg:col-span-1 border-blue-600 ring-1 ring-blue-600/10' : ''
                }`}
              >
                {s.isPopular && (
                  <div className="absolute -top-3 right-8 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md shadow-lg z-20">
                    Most Popular
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    {s.title.includes('Website') && <Layers size={24} />}
                    {s.title.includes('Chatbot') && <Bot size={24} />}
                    {s.title.includes('WhatsApp') && <MessageSquare size={24} />}
                    {s.title.includes('Automation') && <Cpu size={24} />}
                    {s.title.includes('System') && <Globe size={24} />}
                    {!['Website', 'Chatbot', 'WhatsApp', 'Automation', 'System'].some(k => s.title.includes(k)) && <Zap size={24} />}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{s.description}</p>
                  </div>

                  {s.isPopular && (
                    <ul className="space-y-2 pt-2">
                      {s.features.map((f: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                          <CheckCircle2 size={14} className="text-blue-600" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-blue-600 font-bold text-lg">{s.priceRange}</span>
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="w-full bg-white py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950">The SmartStack Process</h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">Our proven path from idea to production.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Discovery', desc: 'Deep dive into your goals, data flows, and bottlenecks.' },
              { step: '02', title: 'Blueprint', desc: 'Architects design your tailored technology roadmap.' },
              { step: '03', title: 'Build', desc: 'Agile implementation with continuous testing cycles.' },
              { step: '04', title: 'Deploy', desc: 'Seamless launch with ongoing monitoring and support.' },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="text-4xl font-black text-slate-100 mb-6 tracking-tighter">{p.step}</div>
                <h3 className="text-xl font-bold text-slate-950 mb-2">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="w-full bg-slate-950 py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                Tailored for <span className="text-blue-500">Global Precision.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Solutions architected to meet the unique challenges of your industry vertical.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div><div className="text-3xl font-bold text-white">50+</div><div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Projects Delivered</div></div>
                <div><div className="text-3xl font-bold text-white">20ms</div><div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Avg Response Time</div></div>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                { title: 'Healthcare', label: 'HIPAA Compliant', img: '/clinic-mockup.png' },
                { title: 'Retail & E-commerce', label: 'Autonomous Commerce', img: '/clothing-mockup.png' },
                { title: 'Enterprise', label: 'Enterprise Scale', img: '/hero-bg.png' },
              ].map((ind, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                    <Image 
                      src={ind.img} 
                      alt={ind.title} 
                      fill 
                      className="object-cover grayscale" 
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">{ind.label}</div>
                    <h3 className="text-lg font-bold text-white">{ind.title}</h3>
                  </div>
                  <ArrowUpRight size={18} className="text-white/30" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full bg-slate-50 py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 mb-3">Trusted by Innovators</h2>
            <div className="flex items-center justify-center gap-1 text-yellow-400">
              {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              <span className="text-slate-500 text-sm font-medium ml-2">500+ Happy Clients</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Sarah Jenkins', role: 'CTO, TechCorp', quote: 'SmartStack transformed our logistics pipeline. Their AI agents are truly autonomous and remarkably efficient.' },
              { name: 'Michael Chen', role: 'Head of Ops, GlobalHealth', quote: 'The level of security and HIPAA compliance they built into our system was world-class.' },
            ].map((t, i) => (
              <div
                key={i}
                className={`p-8 rounded-3xl border ${i === 0 ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-950 border-slate-800'}`}
              >
                <p className={`text-lg font-bold leading-relaxed mb-6 ${i === 0 ? 'text-slate-900' : 'text-white'}`}>
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${i === 0 ? 'text-slate-900' : 'text-white'}`}>{t.name}</div>
                    <div className={`text-xs ${i === 0 ? 'text-slate-400' : 'text-slate-500'}`}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="bg-slate-950 rounded-3xl p-10 sm:p-16 lg:p-20 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10 pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
              Ready to scale your <span className="text-blue-500">intelligence?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Book a strategy session with our architects. No fluff — just precise, actionable planning.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact" className="bg-white text-slate-950 font-bold px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-2">
                Schedule Strategy Call <ArrowRight size={18} />
              </Link>
              <Link href="/solutions" className="bg-white/5 border border-white/10 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                Explore Capabilities <Globe size={18} />
              </Link>
            </div>
            <div className="mt-10 flex items-center justify-center gap-6 opacity-30">
              <ShieldCheck size={28} />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Secure • Scalable • Reliable</span>
              <Zap size={28} />
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
