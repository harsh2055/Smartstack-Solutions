import React from 'react';
import { db } from '@/lib/prisma';
import { Settings, ArrowRight, MessageSquare, Bot, Cpu, Globe, Layers } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import ServiceGrid from '@/components/ServiceGrid';

export const metadata: Metadata = {
  title: 'Our Services | Smartstack Solutions',
  description: 'Explore our high-performance automation, AI integration, and enterprise web solutions.',
};

export const dynamic = 'force-dynamic';

async function getServices() {
  return await db.service.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  });
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen bg-slate-50 pt-40 pb-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6">
            Engineering Excellence
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-950 font-display mb-6 tracking-tight">
            Pillars of <span className="text-blue-600">Innovation.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            From architecture to automation, we build the foundations of the modern digital enterprise.
          </p>
        </div>

        <ServiceGrid initialServices={services} />

        {services.length === 0 && (
          <div className="text-center py-24 bg-white/50 backdrop-blur-xl rounded-[4rem] border border-dashed border-slate-200">
             <h3 className="text-2xl font-bold text-slate-950 mb-2">Our engineers are working...</h3>
             <p className="text-slate-500">New service models are being architected as we speak.</p>
          </div>
        )}
      </div>
    </div>
  );
}
