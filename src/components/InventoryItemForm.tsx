'use client';

import type { FormEvent } from 'react';
import Link from 'next/link';
import { FileText, Package, Printer, Ruler, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { CreateInventoryItemInput } from '@/lib/types';

interface InventoryItemFormProps {
    cancelHref: string;
    initialValues?: Partial<CreateInventoryItemInput>;
    isSubmitting: boolean;
    onSubmit: (data: CreateInventoryItemInput) => Promise<void>;
    submitLabel: string;
}

function getStringValue(value: string | number | undefined) {
    return value == null ? '' : String(value);
}

function buildInventoryItemPayload(clientId: string, formData: FormData): CreateInventoryItemInput {
    return {
        clientId,
        name: getStringValue(formData.get('name') as string).trim(),
        description: getStringValue(formData.get('description') as string).trim(),
        quantity: Number(formData.get('quantity')) || 0,
        unit: getStringValue(formData.get('unit') as string).trim() || 'pcs',
        itemCode: getStringValue(formData.get('itemCode') as string).trim(),
        boxSize: {
            l: getStringValue(formData.get('length') as string).trim(),
            w: getStringValue(formData.get('width') as string).trim(),
            h: getStringValue(formData.get('height') as string).trim(),
        },
        topPaper: getStringValue(formData.get('topPaper') as string).trim(),
        liner: getStringValue(formData.get('liner') as string).trim(),
        ply: getStringValue(formData.get('ply') as string).trim(),
        gsm: getStringValue(formData.get('gsm') as string).trim(),
        cuttingSize: getStringValue(formData.get('cuttingSize') as string).trim(),
        decalSize: getStringValue(formData.get('decalSize') as string).trim(),
        printing: getStringValue(formData.get('printing') as string).trim(),
        stitching: formData.get('stitching') === 'on',
    };
}

export function InventoryItemForm({
    cancelHref,
    initialValues,
    isSubmitting,
    onSubmit,
    submitLabel,
}: InventoryItemFormProps) {
    const clientId = initialValues?.clientId;

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isSubmitting || !clientId) {
            return;
        }

        const formData = new FormData(e.currentTarget);
        await onSubmit(buildInventoryItemPayload(clientId, formData));
    }

    return (
        <form onSubmit={handleSubmit} className="bg-kraft p-8 border border-kraft-dark/10 rounded-xl shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-industrial/40 border-b border-kraft-dark/10 pb-2 flex items-center gap-2">
                        <Package className="w-4 h-4" /> Basic Details
                    </h3>
                    <Input label="Item Name" name="name" placeholder="e.g. 5 PLY MASTER BOX" required defaultValue={initialValues?.name ?? ''} className="bg-kraft-lighter border-kraft-dark/10" />
                    <Input label="Item Code" name="itemCode" placeholder="e.g. SP-2024-001" defaultValue={initialValues?.itemCode ?? ''} className="bg-kraft-lighter border-kraft-dark/10" />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Quantity" name="quantity" type="number" placeholder="0" required defaultValue={getStringValue(initialValues?.quantity)} className="bg-kraft-lighter border-kraft-dark/10" />
                        <Input label="Unit" name="unit" placeholder="pcs" required defaultValue={initialValues?.unit ?? 'pcs'} className="bg-kraft-lighter border-kraft-dark/10" />
                    </div>
                    <Input label="General Description" name="description" placeholder="Optional notes..." defaultValue={initialValues?.description ?? ''} className="bg-kraft-lighter border-kraft-dark/10" />
                </div>

                <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-industrial/40 border-b border-kraft-dark/10 pb-2 flex items-center gap-2">
                        <Ruler className="w-4 h-4" /> Box Dimensions (MM)
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <Input label="Length" name="length" placeholder="L" required defaultValue={initialValues?.boxSize?.l ?? ''} className="bg-kraft-lighter border-kraft-dark/10" />
                        <Input label="Width" name="width" placeholder="W" required defaultValue={initialValues?.boxSize?.w ?? ''} className="bg-kraft-lighter border-kraft-dark/10" />
                        <Input label="Height" name="height" placeholder="H" required defaultValue={initialValues?.boxSize?.h ?? ''} className="bg-kraft-lighter border-kraft-dark/10" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Cutting Size" name="cuttingSize" placeholder="e.g. 1200 x 800" defaultValue={initialValues?.cuttingSize ?? ''} className="bg-kraft-lighter border-kraft-dark/10" />
                        <Input label="Decal Size" name="decalSize" placeholder="e.g. 100 x 50" defaultValue={initialValues?.decalSize ?? ''} className="bg-kraft-lighter border-kraft-dark/10" />
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-industrial/40 border-b border-kraft-dark/10 pb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Material Specs
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Ply" name="ply" placeholder="3 Ply / 5 Ply" required defaultValue={initialValues?.ply ?? ''} className="bg-kraft-lighter border-kraft-dark/10" />
                        <Input label="GSM" name="gsm" placeholder="120 / 140 / 180" required defaultValue={initialValues?.gsm ?? ''} className="bg-kraft-lighter border-kraft-dark/10" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Top Paper" name="topPaper" placeholder="Golden / Kraft" required defaultValue={initialValues?.topPaper ?? ''} className="bg-kraft-lighter border-kraft-dark/10" />
                        <Input label="Liner" name="liner" placeholder="Semi-Kraft" required defaultValue={initialValues?.liner ?? ''} className="bg-kraft-lighter border-kraft-dark/10" />
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-industrial/40 border-b border-kraft-dark/10 pb-2 flex items-center gap-2">
                        <Printer className="w-4 h-4" /> Production
                    </h3>
                    <Input label="Printing" name="printing" placeholder="1 Color / 2 Color / Offset" defaultValue={initialValues?.printing ?? ''} className="bg-kraft-lighter border-kraft-dark/10" />
                    <div className="flex items-center gap-3 pt-4">
                        <input
                            type="checkbox"
                            name="stitching"
                            id="stitching"
                            defaultChecked={Boolean(initialValues?.stitching)}
                            className="w-5 h-5 rounded border-kraft-dark/20 text-industrial focus:ring-industrial bg-kraft-lighter"
                        />
                        <label htmlFor="stitching" className="text-sm font-bold text-industrial uppercase tracking-wide">
                            Requires Stitching
                        </label>
                    </div>
                </div>
            </div>

            <div className="pt-6 flex justify-end gap-3 border-t border-kraft-dark/10">
                <Link href={cancelHref}>
                    <Button type="button" variant="secondary">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                    <Save className="w-5 h-5 mr-2" />
                    {isSubmitting ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
