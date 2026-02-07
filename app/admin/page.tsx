import { KPICard } from "@/components/KPICard";

export default function AdminDashboardPage() {
    return (
        <div className="min-h-screen bg-bg-light p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-heading tracking-tight">Admin Dashboard</h1>
                <p className="text-text-muted mt-1">System Overview & Key Metrics</p>
            </header>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                <KPICard
                    title="Active Subscriptions"
                    value="1,245"
                    icon="📋"
                />
                <KPICard
                    title="Monthly Recurring Revenue"
                    value="₹45,20,000"
                    icon="💰"
                />
                <KPICard
                    title="Pending Invoices"
                    value="34"
                    icon="🧾"
                />
                <KPICard
                    title="Active Users"
                    value="892"
                    icon="👥"
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="rounded-2xl border border-border-color bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-border-color px-6 py-4 flex items-center justify-between bg-gray-50/50">
                        <h2 className="text-lg font-semibold text-text-heading">Recent Activity</h2>
                    </div>
                    <div className="p-6 text-text-muted">
                        <ul className="space-y-4">
                            <li className="flex items-center justify-between">
                                <span>New Subscription: Acme Corp (Enterprise Plan)</span>
                                <span className="text-xs text-text-muted">2 mins ago</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>Invoice #INV-2024-001 Paid</span>
                                <span className="text-xs text-text-muted">15 mins ago</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>New User Registered: John Doe</span>
                                <span className="text-xs text-text-muted">1 hour ago</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="rounded-2xl border border-border-color bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-border-color px-6 py-4 flex items-center justify-between bg-gray-50/50">
                        <h2 className="text-lg font-semibold text-text-heading">System Status</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-text-body font-medium">Database Connection</span>
                            <span className="text-green-600 font-bold">Online</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-text-body font-medium">Payment Gateway</span>
                            <span className="text-green-600 font-bold">Active</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-text-body font-medium">Last Backup</span>
                            <span className="text-text-muted">Today, 04:00 AM</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
