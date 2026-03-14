'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, LayoutDashboard, PlusCircle, Menu, X, Package, User, LogOut } from 'lucide-react';
import { Button } from './ui/Button';
import { createClient } from '@/lib/supabase/client';
import { signOutAction } from '@/lib/auth-actions';

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-kraft border-b border-kraft-dark/20 flex items-center justify-between px-4 z-50 print:hidden">
                <div className="flex items-center gap-2">
                    <Box className="w-6 h-6" />
                    <span className="font-bold text-lg">Job Card System</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 z-50 h-screen w-64 bg-kraft border-r border-kraft-dark/20 
                flex flex-col p-4 transition-transform duration-300 ease-in-out print:hidden
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0
            `}>
                <div className="flex items-center gap-3 px-2 mb-10 hidden md:flex">
                    <Box className="w-8 h-8" />
                    <h1 className="text-xl font-bold tracking-tight">Job Card System</h1>
                </div>

                <nav className="space-y-2 mt-16 md:mt-0 flex-1">
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${pathname === '/' ? 'bg-kraft-dark text-kraft-lighter' : 'hover:bg-kraft-dark/10'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/create"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${pathname === '/create' ? 'bg-kraft-dark text-kraft-lighter' : 'hover:bg-kraft-dark/10'}`}
                    >
                        <PlusCircle className="w-5 h-5" />
                        New Job Card
                    </Link>
                    <Link
                        href="/inventory"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${pathname.startsWith('/inventory') ? 'bg-kraft-dark text-kraft-lighter' : 'hover:bg-kraft-dark/10'}`}
                    >
                        <Package className="w-5 h-5" />
                        Inventory
                    </Link>
                </nav>

                <div className="pt-4 mt-auto border-t border-kraft-dark/10 space-y-4">
                    {user ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-4 py-2 bg-industrial/5 rounded-lg border border-industrial/10">
                                <div className="w-8 h-8 rounded-full bg-industrial text-white flex items-center justify-center font-bold text-sm">
                                    {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-industrial truncate">
                                        {user.user_metadata?.full_name || 'Internal User'}
                                    </p>
                                    <p className="text-[10px] text-industrial/50 truncate uppercase tracking-tighter">
                                        Active Session
                                    </p>
                                </div>
                            </div>
                            <form action={signOutAction}>
                                <button
                                    type="submit"
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-bold text-red-600 uppercase tracking-wider text-xs border-2 border-red-600/10 hover:bg-red-600 hover:text-white transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-bold text-industrial uppercase tracking-wider text-xs border-2 border-industrial/10 hover:bg-industrial hover:text-white transition-all`}
                        >
                            <User className="w-4 h-4" />
                            Sign In
                        </Link>
                    )}
                    <div className="px-4 py-2">
                        <p className="text-[10px] font-mono opacity-40 text-center uppercase tracking-widest">System v1.1</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
