import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout() {
    return (
        <div className="relative min-h-screen bg-background">
            <Sidebar />
            <div className="flex flex-col min-h-screen md:pl-64 transition-all duration-300 ease-in-out">
                <Navbar />
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
