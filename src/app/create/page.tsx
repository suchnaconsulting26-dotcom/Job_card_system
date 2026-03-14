import { JobCardForm } from '@/components/JobCardForm';

export default function CreateJobPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-industrial tracking-tight">Create New Job Card</h1>
            </div>
            <JobCardForm />
        </div>
    );
}
