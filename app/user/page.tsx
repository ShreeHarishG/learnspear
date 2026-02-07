import { KPICard } from "@/components/KPICard";

export default function UserDashboardPage() {
    return (
        <div className="min-h-screen bg-bg-light p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-heading tracking-tight">My Dashboard</h1>
                <p className="text-text-muted mt-1">Welcome back, John! Here's your subscription status.</p>
            </header>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                <KPICard
                    title="Active Plan"
                    value="Pro Annual"
                    icon="⭐"
                />
                <KPICard
                    title="Next Payment Due"
                    value="Feb 28, 2026"
                    icon="📅"
                />
                <KPICard
                    title="Amount Due"
                    value="₹24,000"
                    icon="💰"
                />
                <KPICard
                    title="Total Paid (YTD)"
                    value="₹48,000"
                    icon="✅"
                />
            </div>

            <div className="rounded-2xl border border-border-color bg-white shadow-sm overflow-hidden">
                <div className="border-b border-border-color px-6 py-4 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-text-heading">My Recent Activity</h2>
                </div>
                <div className="p-6 text-text-muted">
                    <ul className="space-y-4">
                        <li className="flex items-center justify-between">
                            <span>Invoice #INV-2024-001 Paid</span>
                            <span className="text-xs text-text-muted">2 days ago</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span>Subscription Upgraded to Pro Annual</span>
                            <span className="text-xs text-text-muted">1 week ago</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
