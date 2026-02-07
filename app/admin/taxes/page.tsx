export default function AdminTaxesPage() {
    const taxes = [
        { id: 1, name: "GST 18%", type: "Sales Tax", rate: "18.00%", scope: "Sales" },
        { id: 2, name: "GST 5%", type: "Sales Tax", rate: "5.00%", scope: "Sales" },
    ];

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-text-heading">Tax Management</h1>
            <p className="mt-2 text-text-muted">Set up tax rates and rules (Mocked).</p>
            <div className="mt-6 overflow-x-auto rounded-xl border border-border-color bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-border-color bg-gray-50/80">
                        <tr>
                            <th className="px-4 py-3 font-medium text-text-heading">Name</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Type</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Rate</th>
                            <th className="px-4 py-3 font-medium text-text-heading">Scope</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                        {taxes.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium">{t.name}</td>
                                <td className="px-4 py-3">{t.type}</td>
                                <td className="px-4 py-3">{t.rate}</td>
                                <td className="px-4 py-3">{t.scope}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
