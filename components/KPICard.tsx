export function KPICard({
    title,
    value,
    icon,
}: {
    title: string;
    value: string | number;
    icon: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-border-color bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent/40">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-accent/5 transition-all group-hover:bg-accent/10"></div>
            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-text-muted uppercase tracking-wider">{title}</p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-primary">
                        {value}
                    </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 text-xl text-primary ring-1 ring-inset ring-slate-200 transition-colors group-hover:bg-primary group-hover:text-accent group-hover:ring-primary">
                    {icon}
                </div>
            </div>
        </div>
    );
}
