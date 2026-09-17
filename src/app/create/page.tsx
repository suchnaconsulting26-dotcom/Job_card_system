import { JobCardForm } from '@/components/JobCardForm';
import { getClients } from '@/lib/storage';

export const revalidate = 0;

export default async function CreateJobPage() {
    const industries = await getClients();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-industrial tracking-tight">Create New Job Card</h1>
            </div>
            <JobCardForm initialIndustries={industries} />
        </div>
    );
}
