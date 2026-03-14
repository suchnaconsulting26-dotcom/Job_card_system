import React from 'react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-[100] bg-kraft-lighter flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {children}
            </div>
        </div>
    );
}
