export default function AdminQuotationsPage() {
    const list = [
        { id: 1, name: "SQ/2026/001", customer: "Vishwa Corp", amount: 1200, state: "Draft" },
        { id: 2, name: "SQ/2026/002", customer: "Tech Solutions", amount: 800, state: "Sent" },
    ];

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-text-heading">Quotations</h1>
            <p className="mt-2 text-text-muted">Create and manage subscription quotations (Mocked).</p>
            <div className="mt-6 overflow-x-auto rounded-xl border border-border-color bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-border-color bg-gray-50/80">
                        <tr>
                            <th className="px-4 py-3 font-medium text-text-heading">Quot. Number</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Customer</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Amount</th>
                            <th className="px-4 py-3 font-medium text-text-heading">State</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                        {list.map((q) => (
                            <tr key={q.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium">{q.name}</td>
                                <td className="px-4 py-3">{q.customer}</td>
                                <td className="px-4 py-3">₹{q.amount}</td>
                                <td className="px-4 py-3">{q.state}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
