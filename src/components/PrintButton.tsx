'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Printer } from 'lucide-react';
import { JobCard } from '@/lib/types';
import { TicketPrintPreviewModal, TicketData } from '@/components/TicketPrintPreviewModal';

export interface PrintButtonProps {
    card?: JobCard;
    ticket?: TicketData;
    className?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    label?: string;
}

export function PrintButton({
    card,
    ticket,
    className = '',
    variant = 'secondary',
    size = 'md',
    label = 'Print Job Card',
}: PrintButtonProps) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Intercept Ctrl+P / Cmd+P to open the print preview modal directly
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                setIsPreviewOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Resolve ticket data from card prop or ticket prop
    const resolvedTicket: TicketData = ticket || (card ? {
        jobNo: `#${card.jobNo}`,
        partyName: card.partyName || 'N/A',
        boxName: card.boxName || 'N/A',
        orderDate: card.orderDate ? card.orderDate.split('T')[0] : new Date().toISOString().split('T')[0],
        boxSize: {
            l: String(card.boxSize?.l ?? ''),
            w: String(card.boxSize?.w ?? ''),
            h: String(card.boxSize?.h ?? '')
        },
        cuttingSize: card.cuttingSize || '-',
        decalSize: card.decalSize || '-',
        quantity: card.quantity ?? 0,
        topPaper: card.topPaper || '-',
        liner: card.liner || '-',
        numberOfPapers: card.numberOfPapers || '-',
        gsm: card.gsm || '-',
        ply: card.ply || '-',
        printingColor: card.printingColor || 'None',
        deliveryDate: card.deliveryDate ? card.deliveryDate.split('T')[0] : '-',
        readyQuantity: card.readyQuantity !== undefined && card.readyQuantity !== null ? String(card.readyQuantity) : '-',
        vehicleNumber: card.vehicleNumber || '-',
        remarks: card.remarks || '-'
    } : {
        jobNo: '#1',
        partyName: 'N/A',
        boxName: 'N/A',
        orderDate: new Date().toISOString().split('T')[0],
        boxSize: { l: '-', w: '-', h: '-' },
        cuttingSize: '-',
        decalSize: '-',
        quantity: 0,
        topPaper: '-',
        liner: '-',
        numberOfPapers: '-',
        gsm: '-',
        ply: '-',
        printingColor: 'None',
        deliveryDate: '-',
        readyQuantity: '-',
        vehicleNumber: '-',
        remarks: '-'
    });

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={() => setIsPreviewOpen(true)}
                className={`print-btn ${className}`}
            >
                <Printer className="w-4 h-4 mr-2" />
                {label}
            </Button>

            {isPreviewOpen && (
                <TicketPrintPreviewModal
                    isOpen={isPreviewOpen}
                    onClose={() => setIsPreviewOpen(false)}
                    ticket={resolvedTicket}
                />
            )}
        </>
    );
}
