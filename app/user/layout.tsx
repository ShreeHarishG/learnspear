import { UserNavbar } from "@/components/UserNavbar";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <UserNavbar />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
                {children}
            </main>
        </div>
    );
}
