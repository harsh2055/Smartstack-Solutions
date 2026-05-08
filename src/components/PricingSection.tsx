"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';

interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: string;
  priceYearly: string;
  description: string | null;
  features: string[];
  isPopular: boolean;
  ctaText: string;
}

export default function PricingSection({ plans = [] }: { plans: PricingPlan[] }) {
  // Sort plans: Starter, Growth, Pro (based on name or custom logic)
  const mainPlans = plans.filter(p => p.name !== 'Ongoing Maintenance').sort((a, b) => {
    const order = ['Starter Plan', 'Growth Plan', 'Pro Plan'];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  const maintenancePlan = plans.find(p => p.name === 'Ongoing Maintenance');

  return (
    <section className="px-4 sm:px-6 pt-10 pb-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-950 mb-4 tracking-tighter">
            Transparent Pricing Plans
          </h2>
          <p className="text-slate-500 font-medium">Choose the right tier for your business growth</p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {mainPlans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`bg-white p-10 rounded-[2.5rem] border flex flex-col transition-all relative group ${
                plan.isPopular 
                ? 'border-blue-600 shadow-2xl shadow-blue-600/10 scale-105 z-10' 
                : 'border-slate-100 hover:border-slate-200 shadow-sm'
              }`}
            >
              <h3 className="text-sm font-black text-slate-950 mb-4 uppercase tracking-widest">{plan.name}</h3>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-slate-950 tracking-tight">
                  {plan.priceMonthly}
                </span>
                {plan.name === 'Pro Plan' && <span className="text-3xl font-black text-slate-950">+</span>}
              </div>

              <ul className="space-y-5 mb-12 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm text-slate-500 font-bold">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={12} className="text-blue-600" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`w-full py-4 px-6 rounded-xl font-black text-sm text-center block transition-all active:scale-95 ${
                  plan.isPopular
                  ? 'bg-blue-600 border-2 border-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/30'
                  : 'bg-white border border-slate-100 text-blue-600 hover:border-blue-600 shadow-sm'
                }`}
              >
                {plan.ctaText}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Ongoing Maintenance Section - Matches Image Exactly */}
        {maintenancePlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-slate-100 rounded-[2.5rem] p-8 sm:px-12 py-10 shadow-sm relative overflow-hidden group hover:border-blue-100 transition-all"
          >
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-10">
              <div className="flex items-center gap-6 sm:gap-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <Zap size={28} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-0.5">Ongoing Maintenance</h3>
                  <p className="text-slate-400 text-xs sm:text-sm font-bold tracking-tight">
                    Hosting, AI updates, Support
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tighter">
                    {maintenancePlan.priceMonthly}
                  </span>
                  <span className="text-slate-400 font-bold text-sm">/month</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
