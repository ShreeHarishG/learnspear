import { LucideIcon } from "lucide-react";

interface KPICardProps {
    title: string;
    value: string;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon: LucideIcon;
    color: string;
}

export function KPICard({ title, value, change, changeType = "neutral", icon: Icon, color }: KPICardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-border-color shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color.replace("bg-", "text-")}`}>
                <Icon className="w-24 h-24 -mt-4 -mr-4 transform rotate-12" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                        <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
                    </div>
                    {change && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${changeType === "positive" ? "bg-green-100 text-green-700" :
                                changeType === "negative" ? "bg-red-100 text-red-700" :
                                    "bg-slate-100 text-slate-700"
                            }`}>
                            {change}
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-text-heading tracking-tight">{value}</h3>
                </div>
            </div>
        </div>
    );
}
