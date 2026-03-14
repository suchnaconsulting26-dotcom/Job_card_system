'use client';

import { useState } from 'react';
import { createJobAction, updateJobAction } from '@/lib/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2 } from 'lucide-react';
import { JobCard } from '@/lib/types';

interface JobCardFormProps {
    initialData?: JobCard;
}

export function JobCardForm({ initialData }: JobCardFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);

        // Extract data from formData
        const data = {
            partyName: formData.get('partyName') as string,
            boxName: formData.get('boxName') as string,
            boxSize: {
                l: formData.get('boxSizeL') as string,
                w: formData.get('boxSizeW') as string,
                h: formData.get('boxSizeH') as string,
            },
            cuttingSize: formData.get('cuttingSize') as string,
            decalSize: formData.get('decalSize') as string,
            quantity: Number(formData.get('quantity')),
            ply: formData.get('ply') as string,
            topPaper: formData.get('topPaper') as string,
            liner: formData.get('liner') as string,
            numberOfPapers: formData.get('numberOfPapers') as string,
            gsm: formData.get('gsm') as string,
            printingColor: formData.get('printingColor') as string,
            stitching: formData.get('stitching') === 'on',
            orderDate: formData.get('orderDate') as string,
            deliveryDate: formData.get('deliveryDate') as string,
            readyQuantity: formData.get('readyQuantity') ? Number(formData.get('readyQuantity')) : undefined,
            vehicleNumber: formData.get('vehicleNumber') as string,
            remarks: formData.get('remarks') as string,
        };

        try {
            if (initialData) {
                await updateJobAction(initialData.id, data);
            } else {
                await createJobAction(data);
            }
        } catch (error) {
            console.error('Error saving job card:', error);
            setIsSubmitting(false);
        }
    }

    return (
        <form action={handleSubmit} className="bg-white max-w-5xl mx-auto border-2 border-black text-black">

            <div className="flex flex-col md:flex-row">
                {/* Left Main Content (75%) */}
                <div className="w-full md:w-[75%] border-b-2 md:border-b-0 md:border-r-2 border-black">
                    {/* Header Row */}
                    <div className="flex border-b-2 border-black">
                        <div className="flex-1 p-4 border-r-2 border-black flex items-center justify-center">
                            <h2 className="text-2xl font-black uppercase tracking-wider">Job Card Sheet</h2>
                        </div>
                        <div className="w-48 p-2 flex flex-col justify-center bg-gray-50 text-center">
                            <span className="text-xs font-bold block mb-1">JOB NO.</span>
                            <p className="text-xl font-black">{initialData?.jobNo ? `No. ${initialData.jobNo}` : 'AUTO'}</p>
                        </div>
                    </div>

                    {/* Row 1: Company & Date */}
                    <div className="flex border-b-2 border-black">
                        <div className="flex-1 border-r-2 border-black p-4">
                            <Input name="partyName" label="COMPANY NAME" required placeholder="e.g. Acme Corp" defaultValue={initialData?.partyName} className="font-bold text-lg" />
                        </div>
                        <div className="w-48 p-4">
                            <Input name="orderDate" type="date" label="DATE" required defaultValue={initialData?.orderDate ? initialData.orderDate.split('T')[0] : ''} />
                        </div>
                    </div>

                    {/* Row 2: Box Name */}
                    <div className="border-b-2 border-black p-4">
                        <Input name="boxName" label="BOX NAME / ID" placeholder="WAB..." defaultValue={initialData?.boxName} className="font-bold text-xl" />
                    </div>

                    {/* Middle Grid Section */}
                    <div className="border-b-2 border-black">
                        {/* Central Specs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                            {/* Box Size & Dimensions Group */}
                            <div className="col-span-1 p-2 border-b-2 md:border-b-2 md:border-r-2 border-black space-y-2">
                                <span className="text-xs font-bold block">BOX SIZE (MM)</span>
                                <Input name="boxSizeL" placeholder="L" required defaultValue={initialData?.boxSize.l} />
                                <Input name="boxSizeW" placeholder="W" required defaultValue={initialData?.boxSize.w} />
                                <Input name="boxSizeH" placeholder="H" required defaultValue={initialData?.boxSize.h} />
                            </div>

                            {/* Cutting & Decal Size - Grouped nicely next to Box Size */}
                            <div className="col-span-1 p-2 border-b-2 md:border-b-0 md:border-r-2 border-black space-y-4">
                                <div>
                                    <Input name="cuttingSize" label="CUTTING SIZE" placeholder="120x340" defaultValue={initialData?.cuttingSize} />
                                </div>
                                <div className="pt-2 border-t border-gray-300">
                                    <Input name="decalSize" label="DECAL SIZE" placeholder="100x200" defaultValue={initialData?.decalSize} />
                                </div>
                            </div>

                            {/* Order Qty - Spans 2 cols for visibility */}
                            <div className="col-span-1 sm:col-span-2 p-4 border-b-2 border-black bg-gray-50 flex flex-col justify-center">
                                <Input name="quantity" type="number" label="ORDER QUANTITY" required defaultValue={initialData?.quantity} className="text-3xl font-black text-center h-16" />
                            </div>

                            {/* Materials Row 1 */}
                            <div className="col-span-1 p-2 border-b-2 md:border-b-2 md:border-r-2 border-black">
                                <Input name="topPaper" label="TOP PAPER" placeholder="Golden..." defaultValue={initialData?.topPaper} />
                            </div>
                            <div className="col-span-1 p-2 border-b-2 md:border-b-2 md:border-r-2 border-black">
                                <Input name="liner" label="LINER" placeholder="120+120" defaultValue={initialData?.liner} />
                            </div>
                            <div className="col-span-1 sm:col-span-2 p-2 border-b-2 border-black">
                                <Input name="numberOfPapers" label="NO. OF PAPERS" placeholder="3, 5..." defaultValue={initialData?.numberOfPapers} />
                            </div>

                            {/* Materials Row 2 */}
                            <div className="col-span-1 p-2 border-b-2 md:border-b-2 md:border-r-2 border-black">
                                <Input name="gsm" label="GSM" placeholder="150/150..." defaultValue={initialData?.gsm} />
                            </div>
                            <div className="col-span-1 p-2 border-b-2 md:border-b-2 md:border-r-2 border-black">
                                <Input name="ply" label="PLY" placeholder="3-Ply..." defaultValue={initialData?.ply} />
                            </div>
                            <div className="col-span-1 sm:col-span-2 p-2 border-b-2 border-black grid grid-cols-2 gap-4">
                                <Input name="printingColor" label="PRINTING" placeholder="Red, Blue..." defaultValue={initialData?.printingColor} />
                                <div className="flex items-center gap-2 mt-6">
                                    <input type="checkbox" name="stitching" id="stitching" className="w-5 h-5" defaultChecked={initialData?.stitching} />
                                    <label htmlFor="stitching" className="font-bold text-sm">STITCHING</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[150px]">
                        <div className="border-b-2 md:border-b-0 md:border-r-2 border-black p-4 space-y-4">
                            <Input name="deliveryDate" type="date" label="DISPATCH DATE" required defaultValue={initialData?.deliveryDate ? initialData.deliveryDate.split('T')[0] : ''} />
                            <Input name="readyQuantity" type="number" label="READY QTY" placeholder="Optional" defaultValue={initialData?.readyQuantity} />
                            <Input name="vehicleNumber" label="VEHICLE NO." placeholder="Optional" defaultValue={initialData?.vehicleNumber} />
                        </div>
                        <div className="p-4">
                            <Input name="remarks" label="REMARKS" placeholder="Special instructions..." defaultValue={initialData?.remarks} />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (Instructions/Actions) */}
                <div className="w-full md:w-[25%] flex flex-col bg-gray-50 border-t-2 md:border-t-0 border-black">
                    <div className="border-b-2 border-black p-4 text-center bg-gray-100">
                        <h3 className="font-bold uppercase">Actions</h3>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-4 text-sm text-gray-600">
                            <p>Fill out the job card details carefully. All bold fields are required.</p>
                            <p>The layout on the left mirrors the final print output.</p>
                        </div>

                        <Button type="submit" disabled={isSubmitting} size="lg" className="w-full mt-8">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {initialData ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                initialData ? 'Update Job Card' : 'Create Job Card'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
