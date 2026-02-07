export default function AdminReportsPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-text-heading">Reports & Analytics</h1>
            <p className="mt-2 text-text-muted">View system performance and financial reports (Mocked).</p>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white p-6 rounded-2xl border border-border-color shadow-sm">
                    <h3 className="text-lg font-semibold text-text-heading mb-4">Revenue Growth</h3>
                    <div className="h-40 bg-gray-50 rounded-xl flex items-end justify-between px-4 pb-4">
                        <div className="w-8 bg-blue-200 h-[40%] rounded-t-sm"></div>
                        <div className="w-8 bg-blue-300 h-[60%] rounded-t-sm"></div>
                        <div className="w-8 bg-blue-400 h-[50%] rounded-t-sm"></div>
                        <div className="w-8 bg-blue-500 h-[80%] rounded-t-sm"></div>
                        <div className="w-8 bg-blue-600 h-[75%] rounded-t-sm"></div>
                        <div className="w-8 bg-blue-700 h-[90%] rounded-t-sm"></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-border-color shadow-sm">
                    <h3 className="text-lg font-semibold text-text-heading mb-4">Subscription Types</h3>
                    <div className="flex items-center justify-center h-40">
                        <div className="w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center relative">
                            <div className="absolute inset-0 border-8 border-green-500 rounded-full clip-path-half"></div>
                            <span className="text-2xl font-bold text-text-heading">85%</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-2 text-sm text-text-muted">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Premium</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-200"></div> Basic</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-border-color shadow-sm">
                    <h3 className="text-lg font-semibold text-text-heading mb-4">Churn Rate</h3>
                    <div className="flex flex-col justify-center h-40">
                        <div className="text-5xl font-bold text-red-500">2.4%</div>
                        <p className="text-text-muted mt-2">↓ 0.5% from last month</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
