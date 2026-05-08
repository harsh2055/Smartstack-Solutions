import React from 'react';
import { db } from "@/lib/prisma";
import { notFound } from 'next/navigation';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CaseStudyDetailPage({ params }: { params: { slug: string } }) {
  const study = await db.caseStudy.findUnique({
    where: { slug: params.slug }
  });

  // Mock data if not found for demo
  const mockStudy = {
    title: 'Global Logistics Optimization',
    client: 'ShipFast Global',
    description: 'How we reduced delivery latency by 34% using predictive neural routing.',
    content: `
      ## The Challenge
      ShipFast Global was struggling with unpredictable delivery delays in their pan-Asian routes. Traditional routing algorithms couldn't account for real-time geopolitical shifts and micro-weather patterns.
      
      ## Our Solution
      We implemented a custom neural routing engine that processed over 500 unique data points per minute. This system didn't just find the shortest path; it found the "most stable" path.
      
      ## The Impact
      - 34% reduction in overall delivery latency.
      - 22% increase in fuel efficiency through optimized multi-modal transfers.
      - Automated 80% of route adjustment decisions.
    `,
    metrics: [{ label: 'Latency', value: '-34%' }, { label: 'Efficiency', value: '+22%' }],
  };

  const currentStudy = study || (params.slug === 'logistics-optimization' ? mockStudy : null);

  if (!currentStudy) {
    notFound();
  }

  return (
    <article className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/case-studies" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-12 font-medium">
          <ArrowLeft size={18} /> Back to Case Studies
        </Link>
        
        <div className="mb-16">
          <div className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">{currentStudy.client}</div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
            {currentStudy.title}
          </h1>
          <p className="text-2xl text-slate-600 leading-relaxed font-light italic border-l-4 border-blue-100 pl-8 py-2">
            "{currentStudy.description}"
          </p>
        </div>

        <div className="relative aspect-[16/9] bg-slate-900 rounded-[3rem] overflow-hidden mb-20 shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-slate-900 flex items-center justify-center">
              <div className="text-white/10 text-9xl font-black">{currentStudy.client}</div>
           </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-20">
          {(currentStudy.metrics as any[]).map((metric, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{metric.label}</div>
              <div className="text-4xl font-bold text-slate-900">{metric.value}</div>
            </div>
          ))}
        </div>

        <div className="prose prose-lg prose-slate max-w-none">
          <div className="space-y-12 text-slate-600 leading-relaxed">
            {/* Simple manual render of the markdown-like content */}
            <h2 className="text-3xl font-bold text-slate-900">The Challenge</h2>
            <p>
              ShipFast Global was struggling with unpredictable delivery delays in their pan-Asian routes. Traditional routing algorithms couldn't account for real-time geopolitical shifts and micro-weather patterns.
            </p>
            
            <h2 className="text-3xl font-bold text-slate-900">Our Solution</h2>
            <p>
              We implemented a custom neural routing engine that processed over 500 unique data points per minute. This system didn't just find the shortest path; it found the "most stable" path.
            </p>

            <div className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100 my-16">
              <h3 className="text-2xl font-bold text-primary mb-6">Key Outcomes</h3>
              <ul className="space-y-4">
                {[
                  '34% reduction in overall delivery latency.',
                  '22% increase in fuel efficiency through optimized multi-modal transfers.',
                  'Automated 80% of route adjustment decisions.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={24} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-16 border-t border-slate-100 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Want results like this?</h2>
          <Link href="/contact" className="bg-primary text-white font-bold px-12 py-5 rounded-full hover:bg-blue-700 transition-all shadow-xl inline-block">
            Start Your Strategy Session
          </Link>
        </div>
      </div>
    </article>
  );
}
