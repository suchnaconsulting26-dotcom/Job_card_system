import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getClients, getInventoryItemById } from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { PrintButton } from '@/components/PrintButton';
import { ArrowLeft } from 'lucide-react';

export default async function PrintInventoryItemPage({
    params,
}: {
    params: Promise<{ clientId: string; itemId: string }>;
}) {
    const { clientId, itemId } = await params;
    const [client, item] = await Promise.all([
        getClients().then((clients) => clients.find((entry) => entry.id === clientId)),
        getInventoryItemById(itemId),
    ]);

    if (!client || !item || item.clientId !== clientId) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between print:hidden">
                <Link href={`/inventory/${clientId}/items/${itemId}`}>
                    <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-industrial/80">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Item Details
                    </Button>
                </Link>
                <div className="flex gap-2">
                    <PrintButton />
                </div>
            </div>

            <div className="bg-white text-black relative print:p-0 max-w-5xl mx-auto border-2 border-black job-card-print">
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {/* Left Main Content (75%) */}
                    <div style={{ width: '75%', borderRight: '2px solid black' }}>
                        {/* Header Row */}
                        <div style={{ display: 'flex', borderBottom: '2px solid black' }}>
                            <div style={{ flex: '1', padding: '8px', borderRight: '2px solid black' }}>
                                <h1 className="text-2xl font-black text-center uppercase tracking-wider">Job Card System</h1>
                            </div>
                            <div style={{ width: '128px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
                                <p className="text-xl font-black"></p>
                            </div>
                        </div>

                        {/* Row 1: Company & Date */}
                        <div style={{ display: 'flex', borderBottom: '2px solid black', minHeight: '60px' }}>
                            <div style={{ flex: '1', borderRight: '2px solid black', padding: '8px' }}>
                                <span className="text-xs font-bold block mb-1">COMPANY NAME :-</span>
                                <p className="text-xl font-bold font-handwriting text-blue-900">{client.name}</p>
                            </div>
                            <div style={{ width: '192px', padding: '8px' }}>
                                <span className="text-xs font-bold block mb-1">DATE :</span>
                                <p className="text-lg font-bold">{new Date().toISOString().split('T')[0]}</p>
                            </div>
                        </div>

                        {/* Row 2: Box Name */}
                        <div style={{ display: 'flex', borderBottom: '2px solid black', minHeight: '60px' }}>
                            <div style={{ flex: '1', padding: '8px' }}>
                                <span className="text-xs font-bold block mb-1">BOX :-</span>
                                <p className="text-2xl font-bold text-blue-900">{item.name || '-'}</p>
                            </div>
                        </div>

                        {/* Middle Grid Section */}
                        <div style={{ borderBottom: '2px solid black' }}>
                            {/* Central Specs */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
                                {/* Box Size */}
                                <div style={{ padding: '8px', borderBottom: '2px solid black', borderRight: '2px solid black' }}>
                                    <span className="text-xs font-bold block mb-1">BOX SIZE (MM)</span>
                                    <div className="text-xl font-bold leading-none text-blue-900">
                                        <div>{item.boxSize?.l || '-'} x</div>
                                        <div>{item.boxSize?.w || '-'} x</div>
                                        <div>{item.boxSize?.h || '-'}</div>
                                    </div>
                                </div>
                                {/* Cutting Size */}
                                <div style={{ padding: '8px', borderBottom: '2px solid black', borderRight: '2px solid black' }}>
                                    <span className="text-xs font-bold block mb-1">CUTTING SIZE</span>
                                    <p className="text-xl font-bold text-blue-900">{item.cuttingSize || '-'}</p>
                                </div>
                                {/* Decal Size */}
                                <div style={{ padding: '8px', borderBottom: '2px solid black', borderRight: '2px solid black' }}>
                                    <span className="text-xs font-bold block mb-1">DECAL SIZE</span>
                                    <p className="text-xl font-bold text-blue-900">{item.decalSize || '-'}</p>
                                </div>
                                {/* Order Qty */}
                                <div style={{ padding: '8px', borderBottom: '2px solid black', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <span className="text-xs font-bold block mb-1 self-start">ORDER QUANTITY</span>
                                    <p className="text-3xl font-black text-center">{item.quantity}</p>
                                </div>

                                {/* Row 2 of Grid */}
                                <div style={{ padding: '8px', borderBottom: '2px solid black', borderRight: '2px solid black' }}>
                                    <span className="text-xs font-bold block mb-1">TOP PAPER :-</span>
                                    <p className="text-lg font-bold text-blue-900">{item.topPaper || '-'}</p>
                                </div>
                                <div style={{ padding: '8px', borderBottom: '2px solid black', borderRight: '2px solid black' }}>
                                    <span className="text-xs font-bold block mb-1">LINER :-</span>
                                    <p className="text-lg font-bold text-blue-900">{item.liner || '-'}</p>
                                </div>
                                <div style={{ gridColumn: 'span 2', padding: '8px', borderBottom: '2px solid black' }}>
                                    <span className="text-xs font-bold block mb-1">NO. OF PAPERS :-</span>
                                    <p className="text-lg font-bold text-blue-900">-</p>
                                </div>

                                {/* Row 3 of Grid */}
                                <div style={{ padding: '8px', borderBottom: '2px solid black', borderRight: '2px solid black' }}>
                                    <span className="text-xs font-bold block mb-1">GSM</span>
                                    <p className="text-lg font-bold text-blue-900">{item.gsm || '-'}</p>
                                </div>
                                <div style={{ padding: '8px', borderBottom: '2px solid black', borderRight: '2px solid black' }}>
                                    <span className="text-xs font-bold block mb-1">PLY</span>
                                    <p className="text-lg font-bold text-blue-900">{item.ply || '-'}</p>
                                </div>
                                <div style={{ gridColumn: 'span 2', padding: '8px', borderBottom: '2px solid black' }}>
                                    <span className="text-xs font-bold block mb-1">PRINTING :-</span>
                                    <p className="text-lg font-bold text-blue-900">{item.printing || 'None'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', minHeight: '150px' }}>
                            <div style={{ borderRight: '2px solid black', padding: '8px' }}>
                                <div className="mb-4">
                                    <span className="text-xs font-bold block">DISPATCH DATE :-</span>
                                    <p className="text-lg font-bold ml-4">-</p>
                                </div>
                                <div className="mb-4">
                                    <span className="text-xs font-bold block">READY QTY :-</span>
                                    <p className="text-lg font-bold ml-4">-</p>
                                </div>
                                <div className="mb-4">
                                    <span className="text-xs font-bold block">VEHICLE NO. :-</span>
                                    <p className="text-lg font-bold ml-4">-</p>
                                </div>
                            </div>
                            <div style={{ padding: '8px' }}>
                                <span className="text-xs font-bold block mb-2">REMARKS :-</span>
                                <p className="text-lg italic">{item.description || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar (25% Order Status) */}
                    <div style={{ width: '25%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ borderBottom: '2px solid black', padding: '8px', textAlign: 'center', backgroundColor: '#f3f4f6' }}>
                            <h3 className="font-bold">ORDER STATUS :-</h3>
                        </div>
                        {/* Status Grid */}
                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                            {['CORRUGATION', 'PASTING', 'PRINTING', 'PUNCHING', 'ROTARY', 'RS4', 'SLOTTING', 'STITCHING', 'BUNDLING'].map((status) => (
                                <div key={status} style={{ flex: '1', borderBottom: '1px solid black', display: 'flex', alignItems: 'center', paddingLeft: '16px', minHeight: '40px' }}>
                                    <div style={{ width: '24px', height: '24px', border: '2px solid black', marginRight: '12px' }}></div>
                                    <span className="font-bold text-sm">{status}</span>
                                </div>
                            ))}
                        </div>
                        <div className="hidden border-t-2 border-black p-2 text-center">
                            <span className="font-bold rotate-90 inline-block transform origin-center translate-y-8">STATUS</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
