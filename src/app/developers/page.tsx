import React from 'react';
import { db } from "@/lib/prisma";
import Image from 'next/image';
import Link from 'next/link';
import { Globe, FileText, Code, ArrowRight, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Developer {
  id: string;
  name: string;
  role: string;
  about: string;
  image: string | null;
  portfolio: string | null;
  resume: string | null;
  skills: string[];
  projects: any;
  isActive: boolean;
}

export default async function DevelopersPage() {
  const developers = await (db as any).developer.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  }) as Developer[];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4">
            Our Talent
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 mb-6 tracking-tight">
            Meet the&nbsp;<span className="text-blue-600">Experts</span>
          </h1>
          <p className="text-lg text-slate-600">
            Our team of world-class developers and designers building the future of digital solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developers.map((dev) => (
            <div key={dev.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
              <div className="relative h-64 overflow-hidden">
                {dev.image ? (
                  <Image 
                    src={dev.image} 
                    alt={dev.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <User size={64} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="flex gap-3">
                    {dev.portfolio && (
                      <Link href={dev.portfolio} target="_blank" className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40 transition-colors">
                        <Globe size={18} />
                      </Link>
                    )}
                    {dev.resume && (
                      <Link href={dev.resume} target="_blank" className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40 transition-colors">
                        <FileText size={18} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-slate-950 mb-1">{dev.name}</h3>
                  <p className="text-blue-600 font-bold text-sm uppercase tracking-wider">{dev.role}</p>
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {dev.about}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {dev.skills.slice(0, 4).map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold">
                      {skill}
                    </span>
                  ))}
                  {dev.skills.length > 4 && (
                    <span className="px-3 py-1 text-slate-400 text-xs font-bold">+{dev.skills.length - 4} more</span>
                  )}
                </div>

                {Array.isArray(dev.projects) && dev.projects.length > 0 && (
                  <div className="mt-auto pt-6 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Projects</p>
                    <div className="space-y-2">
                      {dev.projects.slice(0, 2).map((proj: any, idx: number) => (
                        <Link 
                          key={idx} 
                          href={proj.url || '#'} 
                          target="_blank"
                          className="flex items-center justify-between group/link"
                        >
                          <span className="text-sm font-bold text-slate-700 group-hover/link:text-blue-600 transition-colors">{proj.title}</span>
                          <ArrowRight size={14} className="text-slate-300 group-hover/link:text-blue-600 transition-all group-hover/link:translate-x-1" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {developers.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <div className="max-w-md mx-auto bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
                <Code size={48} className="text-slate-100 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-950 mb-2">Team coming soon</h3>
                <p className="text-slate-500">We're currently assembling our dream team. Stay tuned!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
