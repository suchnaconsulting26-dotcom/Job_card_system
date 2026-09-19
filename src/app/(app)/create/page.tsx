import { JobCardForm } from '@/components/JobCardForm';
import { getClients } from '@/lib/storage';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

interface CreateJobPageProps {
    searchParams?: Promise<{
        boxSizeL?: string;
        boxSizeW?: string;
        boxSizeH?: string;
        cuttingSize?: string;
        decalSize?: string;
        ply?: string;
        topPaper?: string;
        liner?: string;
        gsm?: string;
        quantity?: string;
        printingColor?: string;
        stitching?: string;
        boxName?: string;
        partyName?: string;
        from?: string;
    }>;
}

export default async function CreateJobPage({ searchParams }: CreateJobPageProps) {
    const [industries, resolvedParams] = await Promise.all([
        getClients(),
        searchParams ? await searchParams : undefined,
    ]);

    const isFromWebsite = Boolean(resolvedParams?.boxSizeL || resolvedParams?.cuttingSize || resolvedParams?.boxName);

    const sourceLabel = resolvedParams?.from === 'calculator'
        ? 'UNIVERSAL CORRUGATION CALCULATOR'
        : resolvedParams?.from === 'solutions'
        ? 'INDUSTRY SOLUTIONS BLUEPRINT'
        : 'WEBSITE ESTIMATOR';

    const initialData = isFromWebsite ? {
        id: '',
        jobNo: 0,
        createdAt: '',
        status: 'pending' as const,
        partyName: resolvedParams?.partyName || '',
        boxName: resolvedParams?.boxName || 'Calculated Corrugated Shipper',
        boxSize: {
            l: resolvedParams?.boxSizeL || '400',
            w: resolvedParams?.boxSizeW || '300',
            h: resolvedParams?.boxSizeH || '250',
        },
        cuttingSize: resolvedParams?.cuttingSize || '',
        decalSize: resolvedParams?.decalSize || '',
        quantity: resolvedParams?.quantity ? Number(resolvedParams.quantity) : 1000,
        ply: resolvedParams?.ply || '5',
        topPaper: resolvedParams?.topPaper || 'Virgin Golden Kraft',
        liner: resolvedParams?.liner || '140 High BF Test Liner',
        numberOfPapers: resolvedParams?.ply ? `${resolvedParams.ply} Layers` : '5 Layers',
        gsm: resolvedParams?.gsm || '180 / 140 / 150',
        printingColor: resolvedParams?.printingColor || '2-Color Flexo',
        stitching: resolvedParams?.stitching === 'true',
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        remarks: resolvedParams?.from === 'solutions'
            ? 'Specification transferred directly from Industry Solutions Catalog.'
            : 'Specification transferred directly from Website Box Estimator.',
    } : undefined;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-industrial tracking-tight">Create New Job Card</h1>
                    <p className="text-industrial/60 mt-1">Configure carton specifications and factory order parameters.</p>
                </div>

                {isFromWebsite ? (
                    <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-300 text-yellow-900 px-3 py-1.5 rounded-md font-mono text-xs font-bold shadow-xs">
                        <Sparkles className="w-4 h-4 text-yellow-600" />
                        <span>PRE-FILLED FROM {sourceLabel}</span>
                    </div>
                ) : (
                    <Link href="/" className="text-xs font-bold text-industrial/60 hover:text-industrial flex items-center gap-1">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Return to Website</span>
                    </Link>
                )}
            </div>

            <JobCardForm initialIndustries={industries} initialData={initialData} />
        </div>
    );
}
