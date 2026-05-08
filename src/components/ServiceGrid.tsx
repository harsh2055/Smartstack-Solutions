"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, MessageSquare, Bot, Cpu, Globe, 
  Zap, Sparkles 
} from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  priceRange: string | null;
  isPopular: boolean | null;
  features: string[];
}

export default function ServiceGrid({ initialServices }: { initialServices: Service[] }) {
  // Sort services to ensure the "Complete" one is at the end
  const sortedServices = [...initialServices].sort((a, b) => {
    if (a.slug === 'complete-business-system') return 1;
    if (b.slug === 'complete-business-system') return -1;
    return 0;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-10">
      {sortedServices.map((service, idx) => {
        const isWide = service.slug === 'complete-business-system';
        
        return (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * idx }}
            className={`group relative bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full ${
              isWide ? 'md:col-span-2 border-blue-600 shadow-xl shadow-blue-600/10 ring-1 ring-blue-600/10 bg-gradient-to-br from-white to-blue-50/20' : ''
            }`}
          >
            {service.isPopular && (
              <div className="absolute top-8 right-8 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-lg z-20">
                Most Popular
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-12 h-full">
              <div className={`flex flex-col flex-1 ${isWide ? 'lg:max-w-[50%]' : ''}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 mb-8 ${
                  isWide ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                }`}>
                  {service.slug.includes('website') && <Globe size={32} />}
                  {service.slug.includes('chatbot') && <Bot size={32} />}
                  {service.slug.includes('whatsapp') && <MessageSquare size={32} />}
                  {service.slug.includes('automation') && <Cpu size={32} />}
                  {service.slug.includes('complete') && <Sparkles size={32} />}
                  {!['website', 'chatbot', 'whatsapp', 'automation', 'complete'].some(k => service.slug.includes(k)) && <Zap size={32} />}
                </div>
                
                <h3 className="text-3xl font-black text-slate-950 mb-4 tracking-tighter leading-tight">
                  {service.title}
                </h3>
                <p className="text-slate-500 font-bold leading-relaxed mb-10 flex-1 text-sm sm:text-base">
                  {service.description}
                </p>
                
                {isWide && (
                  <div className="grid grid-cols-2 gap-y-6 mb-10">
                    {[
                      { icon: <Globe size={14} />, label: 'Website' },
                      { icon: <Bot size={14} />, label: 'AI' },
                      { icon: <MessageSquare size={14} />, label: 'WhatsApp' },
                      { icon: <Cpu size={14} />, label: 'Automation' }
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-slate-900 font-black text-xs uppercase tracking-widest">
                        <div className="w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-600">{f.icon}</div>
                        {f.label}
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">{isWide ? 'Investment Range' : 'Starting From'}</span>
                    <span className="text-blue-600 font-black text-2xl tracking-tighter">{service.priceRange || 'Contact for Quote'}</span>
                  </div>
                  <Link 
                    href={`/contact?service=${service.slug}`} 
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-50 rounded-xl text-[10px] font-black text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all uppercase tracking-[0.2em] shadow-sm active:scale-95"
                  >
                    Start Project <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {isWide && (
                <div className="hidden lg:flex flex-col justify-center items-center flex-1 border-l border-slate-100 pl-12 bg-white/40 rounded-[2rem] m-2">
                  <div className="text-center space-y-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Total Package Value</p>
                    <div className="space-y-1">
                      <span className="text-2xl font-bold text-slate-300 line-through tracking-tighter opacity-50">₹15,000 - ₹40,000</span>
                      <span className="text-6xl font-black text-slate-950 tracking-tighter block">₹15,000 - ₹40,000</span>
                    </div>
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest px-4 py-1 bg-blue-50 rounded-full inline-block">Full automation integration</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
