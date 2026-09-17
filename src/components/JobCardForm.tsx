'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createJobAction, updateJobAction, createIndustryAction, getIndustriesAction } from '@/lib/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, AlertCircle, Building2, Check, ChevronDown, Plus } from 'lucide-react';
import { JobCard, Client } from '@/lib/types';

interface JobCardFormProps {
    initialData?: JobCard;
    initialIndustries?: Client[];
}

export function JobCardForm({ initialData, initialIndustries = [] }: JobCardFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [industries, setIndustries] = useState<Client[]>(initialIndustries);
    const [companyName, setCompanyName] = useState(initialData?.partyName || '');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCreatingIndustry, setIsCreatingIndustry] = useState(false);
    const [justAddedMessage, setJustAddedMessage] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const isMounted = useRef(true);
    const router = useRouter();

    useEffect(() => {
        isMounted.current = true;
        if (initialIndustries.length > 0) {
            setIndustries(initialIndustries);
        } else {
            getIndustriesAction().then((data) => {
                if (isMounted.current && data) {
                    setIndustries(data);
                }
            }).catch(console.error);
        }

        return () => {
            isMounted.current = false;
        };
    }, [initialIndustries]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    async function handleAddNewIndustry() {
        const trimmed = companyName.trim();
        if (!trimmed || isCreatingIndustry) return;

        setIsCreatingIndustry(true);
        setError(null);
        try {
            const result = await createIndustryAction(trimmed);
            if (result?.error) {
                setError(result.error);
            } else if (result?.client) {
                setIndustries(prev => [...prev, result.client]);
                setCompanyName(result.client.name);
                setJustAddedMessage(`"${result.client.name}" registered in Industries!`);
                setTimeout(() => {
                    if (isMounted.current) {
                        setJustAddedMessage(null);
                    }
                }, 4000);
                setIsDropdownOpen(false);
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to create industry';
            setError(msg);
        } finally {
            if (isMounted.current) {
                setIsCreatingIndustry(false);
            }
        }
    }

    async function handleSubmit(formData: FormData) {
        setError(null);
        setIsSubmitting(true);

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
            // As requested, editing an existing card now creates a new duplicate card instead of overwriting
            const result = await createJobAction(data);

            if (result?.redirectTo) {
                router.push(result.redirectTo);
                router.refresh();
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to save job card';
            console.error('Error saving job card:', error);
            if (isMounted.current) {
                setError(message);
                setIsSubmitting(false);
            }
        }
    }

    const trimmedQuery = companyName.trim().toLowerCase();
    const filteredIndustries = trimmedQuery
        ? industries.filter(ind => ind.name.toLowerCase().includes(trimmedQuery))
        : industries;
    const exactMatch = industries.some(ind => ind.name.toLowerCase() === trimmedQuery);
    const showAddNew = trimmedQuery.length > 0 && !exactMatch;
    const isRegisteredIndustry = industries.some(ind => ind.name.toLowerCase() === trimmedQuery);

    return (
        <>
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-red-700">
                        <p className="font-semibold">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}
            <form action={handleSubmit} className="bg-white max-w-5xl mx-auto border-2 border-black text-black">
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-[75%] border-b-2 md:border-b-0 md:border-r-2 border-black">
                        <div className="flex border-b-2 border-black">
                            <div className="flex-1 p-4 border-r-2 border-black flex items-center justify-center">
                                <h2 className="text-2xl font-black uppercase tracking-wider">Job Card Sheet</h2>
                            </div>
                            <div className="w-48 p-2 flex flex-col justify-center bg-gray-50 text-center">
                            </div>
                        </div>

                        <div className="flex border-b-2 border-black relative">
                            <div className="flex-1 border-r-2 border-black p-4 relative" ref={containerRef}>
                                <div className="flex items-center justify-between mb-1">
                                    <label htmlFor="partyNameInput" className="text-sm font-bold text-industrial block">
                                        COMPANY NAME
                                    </label>
                                    {justAddedMessage ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded">
                                            <Check className="w-3 h-3 text-green-700" />
                                            {justAddedMessage}
                                        </span>
                                    ) : isRegisteredIndustry ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded" title="This company is registered in Industries">
                                            <Check className="w-3 h-3 text-green-600" />
                                            Registered Industry
                                        </span>
                                    ) : companyName.trim().length > 0 ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-industrial/60 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded" title="Not added to Industries. Will appear on Dashboard only.">
                                            Dashboard only
                                        </span>
                                    ) : null}
                                </div>

                                <div className="relative">
                                    <Input
                                        id="partyNameInput"
                                        name="partyName"
                                        required
                                        placeholder="e.g. Acme Corp"
                                        value={companyName}
                                        onChange={(e) => {
                                            setCompanyName(e.target.value);
                                            setIsDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        className="font-bold text-lg"
                                        autoComplete="off"
                                        rightElement={
                                            <button
                                                type="button"
                                                onClick={() => setIsDropdownOpen(prev => !prev)}
                                                className="p-1 text-industrial/40 hover:text-industrial transition-colors focus:outline-none"
                                                tabIndex={-1}
                                                title="Toggle registered industries list"
                                            >
                                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                        }
                                    />

                                    {/* Dropdown Options */}
                                    {isDropdownOpen && (
                                        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 bg-white border-2 border-black shadow-2xl overflow-hidden flex flex-col">
                                            {/* Header */}
                                            <div className="px-3 py-1.5 bg-gray-100 border-b border-gray-200 flex items-center justify-between text-[11px] font-bold text-industrial/70 uppercase tracking-wider">
                                                <span className="flex items-center gap-1.5">
                                                    <Building2 className="w-3.5 h-3.5" />
                                                    Registered Industries
                                                </span>
                                                <span className="text-[10px] font-normal text-industrial/50 lowercase">
                                                    {filteredIndustries.length} available
                                                </span>
                                            </div>

                                            {/* Options List */}
                                            <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                                                {filteredIndustries.length > 0 ? (
                                                    filteredIndustries.map((ind) => {
                                                        const isSelected = ind.name.toLowerCase() === trimmedQuery;
                                                        return (
                                                            <button
                                                                key={ind.id}
                                                                type="button"
                                                                onMouseDown={(e) => {
                                                                    e.preventDefault();
                                                                    setCompanyName(ind.name);
                                                                    setIsDropdownOpen(false);
                                                                }}
                                                                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors ${
                                                                    isSelected ? 'bg-kraft-light/50 font-bold text-black' : 'hover:bg-gray-50 text-industrial'
                                                                }`}
                                                            >
                                                                <span className="flex items-center gap-2 truncate">
                                                                    <Building2 className="w-4 h-4 text-industrial/40 flex-shrink-0" />
                                                                    <span className="truncate">{ind.name}</span>
                                                                </span>
                                                                {isSelected ? (
                                                                    <span className="flex items-center gap-1 text-[11px] font-bold text-green-700">
                                                                        <Check className="w-3.5 h-3.5" /> Selected
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[10px] uppercase font-semibold text-industrial/40 group-hover:text-industrial">
                                                                        Select
                                                                    </span>
                                                                )}
                                                            </button>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="p-3 text-center text-xs text-gray-500">
                                                        No existing industry matches &ldquo;{companyName.trim()}&rdquo;
                                                    </div>
                                                )}
                                            </div>

                                            {/* Add New Industry Option Button */}
                                            {showAddNew && (
                                                <div className="p-2 bg-kraft-lighter border-t-2 border-black">
                                                    <button
                                                        type="button"
                                                        disabled={isCreatingIndustry}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                        onClick={handleAddNewIndustry}
                                                        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-industrial hover:bg-black text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                                                    >
                                                        <span className="flex items-center gap-2 truncate">
                                                            {isCreatingIndustry ? (
                                                                <Loader2 className="w-4 h-4 animate-spin text-white flex-shrink-0" />
                                                            ) : (
                                                                <Plus className="w-4 h-4 text-white flex-shrink-0" />
                                                            )}
                                                            <span className="truncate">
                                                                {isCreatingIndustry
                                                                    ? 'Adding to Industries...'
                                                                    : <>Add &ldquo;<strong>{companyName.trim()}</strong>&rdquo; as New Industry</>}
                                                            </span>
                                                        </span>
                                                        <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded uppercase tracking-wider flex-shrink-0 font-semibold">
                                                            Save to Industries
                                                        </span>
                                                    </button>
                                                    <p className="text-[10px] text-industrial/70 mt-1.5 px-1 leading-tight">
                                                        Creates this industry in the Industries section. If you don&apos;t click Add, this job card will only appear on the Dashboard.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-48 p-4">
                                <Input name="orderDate" type="date" label="DATE" required defaultValue={initialData?.orderDate ? initialData.orderDate.split('T')[0] : ''} />
                            </div>
                        </div>

                        <div className="border-b-2 border-black p-4">
                            <Input name="boxName" label="BOX NAME / ID" required placeholder="WAB..." defaultValue={initialData?.boxName} className="font-bold text-xl" />
                        </div>

                        <div className="border-b-2 border-black">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                                <div className="col-span-1 p-2 border-b-2 md:border-b-2 md:border-r-2 border-black space-y-2">
                                    <span className="text-xs font-bold block">BOX SIZE (MM)</span>
                                    <Input name="boxSizeL" placeholder="L" required defaultValue={initialData?.boxSize.l} />
                                    <Input name="boxSizeW" placeholder="W" required defaultValue={initialData?.boxSize.w} />
                                    <Input name="boxSizeH" placeholder="H" required defaultValue={initialData?.boxSize.h} />
                                </div>

                                <div className="col-span-1 p-2 border-b-2 md:border-b-0 md:border-r-2 border-black space-y-4">
                                    <div>
                                        <Input name="cuttingSize" label="CUTTING SIZE" placeholder="120x340" defaultValue={initialData?.cuttingSize} />
                                    </div>
                                    <div className="pt-2 border-t border-gray-300">
                                        <Input name="decalSize" label="DECAL SIZE" placeholder="100x200" defaultValue={initialData?.decalSize} />
                                    </div>
                                </div>

                                <div className="col-span-1 sm:col-span-2 p-4 border-b-2 border-black bg-gray-50 flex flex-col justify-center">
                                    <Input name="quantity" type="number" label="ORDER QUANTITY" required defaultValue={initialData?.quantity} className="text-3xl font-black text-center h-16" />
                                </div>

                                <div className="col-span-1 p-2 border-b-2 md:border-b-2 md:border-r-2 border-black">
                                    <Input name="topPaper" label="TOP PAPER" required placeholder="Golden..." defaultValue={initialData?.topPaper} />
                                </div>
                                <div className="col-span-1 p-2 border-b-2 md:border-b-2 md:border-r-2 border-black">
                                    <Input name="liner" label="LINER" required placeholder="120+120" defaultValue={initialData?.liner} />
                                </div>
                                <div className="col-span-1 sm:col-span-2 p-2 border-b-2 border-black">
                                    <Input name="numberOfPapers" label="NO. OF PAPERS" placeholder="3, 5..." defaultValue={initialData?.numberOfPapers} />
                                </div>

                                <div className="col-span-1 p-2 border-b-2 md:border-b-2 md:border-r-2 border-black">
                                    <Input name="gsm" label="GSM" required placeholder="150/150..." defaultValue={initialData?.gsm} />
                                </div>
                                <div className="col-span-1 p-2 border-b-2 md:border-b-2 md:border-r-2 border-black">
                                    <Input name="ply" label="PLY" required placeholder="3-Ply..." defaultValue={initialData?.ply} />
                                </div>
                                <div className="col-span-1 sm:col-span-2 p-2 border-b-2 border-black grid grid-cols-2 gap-4">
                                    <Input name="printingColor" label="PRINTING" required placeholder="Red, Blue..." defaultValue={initialData?.printingColor} />
                                    <div className="flex items-center gap-2 mt-6">
                                        <input type="checkbox" name="stitching" id="stitching" className="w-5 h-5" defaultChecked={initialData?.stitching} />
                                        <label htmlFor="stitching" className="font-bold text-sm">STITCHING</label>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                        {initialData ? 'Saving as New...' : 'Creating...'}
                                    </>
                                ) : (
                                    initialData ? 'Save as New Job Card (Duplicate)' : 'Create Job Card'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
