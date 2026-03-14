export default function InventoryLoading() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="h-9 w-32 bg-kraft-dark/10 rounded animate-pulse" />
                    <div className="h-5 w-56 bg-kraft-dark/10 rounded animate-pulse mt-2" />
                </div>
                <div className="h-10 w-40 bg-kraft-dark/10 rounded-lg animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="p-6 bg-kraft border border-kraft-dark/10 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-industrial/5 rounded-lg">
                                    <div className="w-6 h-6 bg-kraft-dark/10 rounded animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-6 w-32 bg-kraft-dark/10 rounded animate-pulse" />
                                    <div className="h-3 w-24 bg-kraft-dark/10 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
