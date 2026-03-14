export default function DashboardLoading() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="h-9 w-40 bg-kraft-dark/10 rounded animate-pulse" />
                    <div className="h-5 w-64 bg-kraft-dark/10 rounded animate-pulse mt-2" />
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-10 w-48 bg-kraft-dark/10 rounded-lg animate-pulse" />
                    <div className="h-10 w-36 bg-kraft-dark/10 rounded-lg animate-pulse" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="p-6 bg-kraft border border-kraft-dark/10 rounded-xl space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="h-5 w-16 bg-kraft-dark/10 rounded animate-pulse" />
                            <div className="h-6 w-20 bg-kraft-dark/10 rounded-full animate-pulse" />
                        </div>
                        <div className="h-6 w-32 bg-kraft-dark/10 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-kraft-dark/10 rounded animate-pulse" />
                        <div className="flex gap-2 pt-2">
                            <div className="h-4 w-20 bg-kraft-dark/10 rounded animate-pulse" />
                            <div className="h-4 w-20 bg-kraft-dark/10 rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
