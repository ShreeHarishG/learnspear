import { UserSidebar } from "@/components/UserSidebar";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-bg-light">
            <UserSidebar />
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
}
