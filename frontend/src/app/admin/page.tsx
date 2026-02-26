import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';

export default function AdminPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <AnalyticsDashboard />
        </div>
    );
}
