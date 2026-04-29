import Link from 'next/link';
import { JobCard } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Package } from 'lucide-react';
import { DeleteJobCardButton } from './DeleteJobCardButton';

export function JobCardItem({ card }: { card: JobCard }) {
    return (
        <div className="bg-white rounded-sm shadow-sm border border-kraft-dark/20 p-6 relative overflow-hidden transition-all hover:shadow-md hover:border-kraft-dark/40 group h-full">
            {/* Texture overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]"></div>

            <div className="relative z-10 flex h-full flex-col space-y-4">
                <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1 pr-3">
                        <h3 className="text-lg font-bold text-industrial truncate w-full">{card.partyName}</h3>
                        <p className="text-sm text-industrial/60 flex items-center gap-1">
                            <Package className="w-3 h-3" /> {card.boxName || 'Standard Job'}
                        </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${card.status === 'completed' ? 'bg-green-500' :
                        card.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`} title={card.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-industrial/80 border-t border-industrial/5 pt-4">
                    <div>
                        <p className="text-xs text-industrial/40 uppercase">Qty</p>
                        <p className="font-mono font-bold">{card.quantity}</p>
                    </div>
                    <div>
                        <p className="text-xs text-industrial/40 uppercase">Due</p>
                        <p className="font-mono">{card.deliveryDate.split('T')[0]}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs text-industrial/40 uppercase">Dims</p>
                        <p className="font-mono text-xs">{card.boxSize.l} x {card.boxSize.w} x {card.boxSize.h}</p>
                    </div>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-end gap-2 border-t border-industrial/5 pt-4">
                    <Link href={`/jobs/${card.id}`} className="w-full sm:w-auto">
                        <Button size="sm" variant="ghost" className="w-full sm:w-auto">View</Button>
                    </Link>
                    <DeleteJobCardButton id={card.id} />
                </div>
            </div>
        </div>
    );
}
