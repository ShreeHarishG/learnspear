export default function AdminDiscountsPage() {
    const discounts = [
        { id: 1, name: "New Year Sale", type: "Percentage", value: "20%", status: "Active" },
        { id: 2, name: "Startup Discount", type: "Fixed Amount", value: "₹500", status: "Inactive" },
    ];

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-text-heading">Discount Management</h1>
            <p className="mt-2 text-text-muted">Configure discount rules and coupons (Mocked).</p>
            <div className="mt-6 overflow-x-auto rounded-xl border border-border-color bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-border-color bg-gray-50/80">
                        <tr>
                            <th className="px-4 py-3 font-medium text-text-heading">Name</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Type</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Value</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                        {discounts.map((d) => (
                            <tr key={d.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium">{d.name}</td>
                                <td className="px-4 py-3">{d.type}</td>
                                <td className="px-4 py-3">{d.value}</td>
                                <td className="px-4 py-3">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${d.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                                        {d.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
