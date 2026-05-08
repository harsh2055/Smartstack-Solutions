"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Share2, Globe, Mail, MapPin, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return (
    <footer className="bg-slate-950 text-white pt-24 pb-12 px-6 overflow-hidden relative">
      <div className="absolute inset-0 noise"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
              <div className="relative w-10 h-10 flex items-center justify-center bg-white rounded-xl">
                <Image 
                  src="/logo.png" 
                  alt="Smartstack Logo" 
                  width={24} 
                  height={24} 
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tighter font-display">
                Smartstack<span className="text-blue-500">.</span>
              </span>
            </Link>
            <p className="text-slate-400 text-base leading-relaxed max-w-xs">
              Humanizing automation through thoughtful design and elite engineering excellence. Architecting the future of enterprise intelligence.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Globe size={18} />, href: '#' },
                { icon: <Share2 size={18} />, href: '#' },
                { icon: <MessageCircle size={18} />, href: '#' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-xs">Intelligence</h4>
            <ul className="space-y-4">
              {[
                { name: 'AI Solutions', href: '/solutions' },
                { name: 'Automation', href: '/services' },
                { name: 'System Design', href: '/services' },
                { name: 'Architecture', href: '/services' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-blue-400 transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-xs">Resources</h4>
            <ul className="space-y-4">
              {[
                { name: 'Case Studies', href: '/case-studies' },
                { name: 'Process', href: '/process' },
                { name: 'Whitepapers', href: '#' },
                { name: 'Pricing', href: '/pricing' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-blue-400 transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-8">
            <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-xs">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Email</div>
                  <div className="text-sm font-medium text-slate-300">hello@smartstack.ai</div>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Location</div>
                  <div className="text-sm font-medium text-slate-300">Global Remote Engineering</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-medium">
            © {new Date().getFullYear()} Smartstack Solutions. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-slate-500 hover:text-white transition-colors text-xs font-medium underline underline-offset-4 decoration-white/10">Privacy Policy</Link>
            <Link href="#" className="text-slate-500 hover:text-white transition-colors text-xs font-medium underline underline-offset-4 decoration-white/10">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
