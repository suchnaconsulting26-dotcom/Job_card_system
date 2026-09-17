import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CtaBanner() {
  return (
    <section className="py-20 bg-industrial text-kraft-lighter relative overflow-hidden">
      {/* Texture & Radial Kraft glow */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-kraft/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kraft/20 border border-kraft/40 text-yellow-300 text-xs font-mono font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INSTANT SHOP FLOOR ONBOARDING</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Ready to Eliminate Job Card Chaos <br className="hidden sm:inline" />
          in Your Packaging Plant?
        </h2>

        <p className="text-base sm:text-xl text-kraft-light/80 max-w-2xl mx-auto font-medium">
          Join leading corrugated box converters who trust our system to calculate dimensions, print shop tickets, and keep every machine operator in sync.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/login" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-industrial font-black h-14 px-8 text-base shadow-lg border-2 border-yellow-500 flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 text-industrial" />
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-kraft-light text-kraft-light hover:bg-kraft/20 font-bold h-14 px-8 text-base"
            >
              <span>Explore Live Software</span>
            </Button>
          </Link>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-kraft-light/70 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            14-Day Free Trial
          </span>
          <span>•</span>
          <span>No Credit Card Required</span>
          <span>•</span>
          <span>Works with Existing Printers</span>
        </div>
      </div>
    </section>
  );
}
