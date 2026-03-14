'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/Input';
import { Search } from 'lucide-react';

interface SearchBarProps {
    placeholder?: string;
}

export function SearchBar({ placeholder = 'Search by Company or Box Name...' }: SearchBarProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative w-full md:w-96">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-industrial/40" />
            <Input
                className="pl-8"
                placeholder={placeholder}
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('query')?.toString()}
            />
        </div>
    );
}
