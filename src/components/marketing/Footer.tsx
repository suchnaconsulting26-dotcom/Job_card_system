import Link from 'next/link';
import { Box, ShieldCheck, Heart, ArrowUpRight, Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-industrial text-kraft-lighter border-t-4 border-kraft-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-industrial-muted/40">
          
          {/* Col 1 & 2: Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-kraft text-industrial flex items-center justify-center font-black">
                <Box className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-white">
                  BOXCRAFT
                </span>
                <span className="block text-[10px] uppercase font-mono tracking-wider text-kraft-light/70">
                  Job Card & Packaging OS v1.1
                </span>
              </div>
            </Link>

            <p className="text-sm text-kraft-light/70 max-w-sm leading-relaxed font-normal">
              The high-precision manufacturing operating system for modern corrugated carton plants, sheet converters, and packaging lines. Zero math errors, perfect A4 shop floor tickets, and complete 9-stage tracking.
            </p>

            {/* Live Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-industrial-muted/30 border border-kraft-dark/30 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-kraft-lighter font-semibold">
                All Plant Cloud Systems Operational
              </span>
            </div>
          </div>

          {/* Col 3: Product Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-kraft">
              Product & Tools
            </h4>
            <ul className="space-y-2 text-sm text-kraft-light/80">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Core Plant Features
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-white transition-colors">
                  Interactive Box Estimator
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-white transition-colors">
                  9-Stage Factory Pipeline
                </a>
              </li>
              <li>
                <a href="#print-preview" className="hover:text-white transition-colors">
                  A4 Printable Ticket Blueprint
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition-colors">
                  Industry Packaging Specs
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  SaaS Plant Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Software Direct Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-kraft">
              Launch Software
            </h4>
            <ul className="space-y-2 text-sm text-kraft-light/80">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Plant Dashboard</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Create Job Card</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Industry Catalog</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Operator Sign In</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Register Plant Account</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Standards & Certifications */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-kraft">
              Standards Supported
            </h4>
            <div className="space-y-2 text-xs text-kraft-light/70">
              <div className="p-2.5 rounded bg-industrial-muted/20 border border-kraft-dark/30">
                <p className="font-bold text-white">FEFCO & TAPPI</p>
                <p className="text-[11px] text-kraft-light/60">Standard international carton styles</p>
              </div>
              <div className="p-2.5 rounded bg-industrial-muted/20 border border-kraft-dark/30">
                <p className="font-bold text-white">ISO-9001 Ready</p>
                <p className="text-[11px] text-kraft-light/60">Audit-proof operator sign-off flow</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-kraft-light/60">
          <p>© {new Date().getFullYear()} Job Card System / BOXCRAFT OS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Engineered with Kraft Theme Precision</span>
            <span>v1.1 Release</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
