'use client';

import { Button } from '@/components/ui/Button';
import { Printer } from 'lucide-react';

export function PrintButton() {
    return (
        <Button variant="secondary" onClick={() => window.print()} className="print-btn">
            <Printer className="w-4 h-4 mr-2" />
            Print Job Card
        </Button>
    );
}
