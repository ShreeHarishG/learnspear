import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans">
            <AdminSidebar />
            <div className="flex flex-1 flex-col pl-64 transition-all duration-300">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
                   {children}
                </main>
            </div>
        </div>
    );
}
