import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Activity, Target, Zap } from "lucide-react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Case Studies | Smartstack Solutions",
  description: "Explore our portfolio of high-performance digital solutions, from enterprise AI systems to precision-engineered web applications.",
};

export const dynamic = 'force-dynamic';

export default async function CaseStudiesPage() {
  const caseStudies = await db.caseStudy.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-32 sm:pt-48 pb-20 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50/50 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            Precision Engineering
          </div>
          <h1 className="text-4xl sm:text-7xl font-bold text-slate-950 tracking-tight leading-[1.1]">
            Success in <span className="text-blue-600">Production.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            We don't just deliver code; we deliver measurable impact. Explore how our systems have transformed business operations globally.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {caseStudies.map((project) => (
            <div key={project.id} className="group flex flex-col h-full bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <div className="relative h-72 w-full bg-slate-50 overflow-hidden">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                    <Activity size={48} strokeWidth={1} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <div className="p-8 sm:p-10 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{project.client || 'Enterprise'}</div>
                    <h3 className="text-2xl font-bold text-slate-950 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                  </div>
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>

                <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-grow line-clamp-3">
                  {project.description}
                </p>

                <div className="pt-8 border-t border-slate-50 flex items-center justify-between mt-auto">
                   <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Target size={16} className="text-blue-600" />
                      <span>Case Study</span>
                   </div>
                   <Link 
                    href={`/case-studies/${project.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors"
                  >
                    View Details <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {caseStudies.length === 0 && (
          <div className="text-center py-32 space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-200">
              <Zap size={40} />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
              New Projects Deploying Soon
            </p>
          </div>
        )}
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
         <div className="bg-slate-950 rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 relative z-10">Have a project in mind?</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto relative z-10">Let's build your next high-performance digital asset together.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-slate-950 font-bold px-10 py-5 rounded-2xl hover:scale-105 transition-all shadow-2xl relative z-10">
              Schedule Consultation <ArrowRight size={20} />
            </Link>
         </div>
      </section>
    </div>
  );
}
