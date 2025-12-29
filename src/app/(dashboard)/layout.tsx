import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout() {
    return (
        <div className="relative min-h-screen bg-background">
            <a
                href="#dashboard-main"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary"
            >
                Skip to content
            </a>
            <Sidebar />
            <div className="flex flex-col min-h-screen md:pl-64 transition-all duration-300 ease-in-out">
                <Navbar />
                <main id="dashboard-main" className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
