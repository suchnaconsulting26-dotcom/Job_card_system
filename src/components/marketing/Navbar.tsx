'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Box, Menu, X, ArrowRight, Sparkles, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check active session
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (isMounted.current && data?.user) {
          setUser(data.user);
        }
      }).catch(() => {});
    } catch {}

    return () => {
      isMounted.current = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Box Estimator', href: '#calculator' },
    { label: '9-Stage Flow', href: '#workflow' },
    { label: 'Print Ticket', href: '#print-preview' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 py-3.5 border-b transition-[background-color,border-color,box-shadow] duration-200 ease-out will-change-[background-color,box-shadow] ${
        isScrolled
          ? 'bg-kraft/95 backdrop-blur-md shadow-md border-kraft-dark/30'
          : 'bg-kraft/85 backdrop-blur-sm border-kraft-dark/15'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-industrial text-kraft-lighter flex items-center justify-center shadow-sm group-hover:bg-industrial/90 transition-colors border border-kraft-dark/30">
            <Box className="w-6 h-6 text-kraft-light" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-industrial">
                BOXCRAFT
              </span>
              <span className="text-[10px] uppercase font-mono font-bold bg-kraft-dark text-kraft-lighter px-1.5 py-0.5 rounded tracking-wider">
                v1.1
              </span>
            </div>
            <span className="text-[11px] font-medium text-industrial/70 tracking-tight">
              Job Card & Packaging OS
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-1.5 text-sm font-semibold text-industrial/80 hover:text-industrial hover:bg-kraft-dark/10 rounded-md transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-industrial/5 rounded-full border border-kraft-dark/20 text-xs font-bold text-industrial">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="max-w-[120px] truncate">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Active User'}
                </span>
              </div>
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="bg-industrial hover:bg-industrial/90 text-kraft-lighter font-bold shadow-sm flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-yellow-400" />
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-industrial font-semibold hover:bg-kraft-dark/15"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="bg-industrial hover:bg-industrial/90 text-kraft-lighter font-bold shadow-sm flex items-center gap-2"
                >
                  <span>Launch App</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/dashboard">
            <Button
              size="sm"
              className="bg-industrial text-kraft-lighter font-bold text-xs px-3 py-1.5"
            >
              App
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-industrial hover:bg-kraft-dark/15 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-kraft-dark/20 bg-kraft-light/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-industrial hover:bg-kraft-dark/15 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-kraft-dark/20 flex flex-col gap-2">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-bold text-kraft-lighter bg-industrial rounded-md hover:bg-industrial/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4 text-yellow-400" />
                <span>Go to Plant Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-bold text-industrial bg-kraft-dark/10 rounded-md hover:bg-kraft-dark/20 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-bold text-kraft-lighter bg-industrial rounded-md hover:bg-industrial/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>Launch Job Card Software</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
