import React from 'react';
import { db } from '@/lib/prisma';
import PricingSection from '@/components/PricingSection';
import ServiceGrid from '@/components/ServiceGrid';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | SmartStack Solutions',
  description: 'Choose the right tier for your business growth. Transparent pricing for website development, AI chatbots, and full automation systems.',
};

export const dynamic = 'force-dynamic';

async function getData() {
  const [plans, services] = await Promise.all([
    db.pricingPlan.findMany({ orderBy: { createdAt: 'asc' } }),
    db.service.findMany({ 
      where: { isActive: true },
      orderBy: { createdAt: 'asc' } 
    }),
  ]);
  return { plans, services };
}

export default async function PricingPage() {
  const { plans, services } = await getData();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Our Services Section - Top of Image */}
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-950 mb-4 tracking-tight">
              Our Services
            </h2>
            <p className="text-slate-500 font-medium">
              Smart solutions to automate and grow your business
            </p>
          </div>
          <ServiceGrid initialServices={services as any} />
        </div>
      </section>

      {/* Main Pricing Section - Middle of Image */}
      <section className="pb-16">
        <PricingSection plans={plans} />
      </section>

      {/* Ready to Automate Section - Bottom of Image */}
      <section className="bg-[#050B1A] py-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
            Ready to Automate Your Business?
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Take the first step towards a more efficient, scalable, and modern enterprise.
          </p>
          <div className="pt-4">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-5 rounded-xl transition-all shadow-2xl shadow-blue-600/30 active:scale-95 text-lg"
            >
              Get Free Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
