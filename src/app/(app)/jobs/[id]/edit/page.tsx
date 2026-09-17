import { notFound } from 'next/navigation';
import { getJobCardById, getClients } from '@/lib/storage';
import { JobCardForm } from '@/components/JobCardForm';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 0;

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [card, industries] = await Promise.all([
        getJobCardById(id),
        getClients(),
    ]);

    if (!card) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <Link href={`/jobs/${id}`}>
                    <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-industrial/80">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Job Card
                    </Button>
                </Link>
            </div>

            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-industrial mb-6">Edit Job Card</h1>
                <JobCardForm initialData={card} initialIndustries={industries} />
            </div>
        </div>
    );
}
