"use client";

import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    BookOpen,
    LineChart,
    Video,
    Settings,
    LogOut,
    GraduationCap,
    Users,
    Shield,
    HelpCircle
} from "lucide-react";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "My Courses",
        href: "/courses",
        icon: BookOpen,
    },
    {
        title: "Progress",
        href: "/progress",
        icon: LineChart,
    },
    {
        title: "Live Classes",
        href: "/live-classes",
        icon: Video,
    },
    {
        title: "Parent View",
        href: "/parent",
        icon: Users,
    },
    {
        title: "Help Center",
        href: "/help",
        icon: HelpCircle,
    },
    {
        title: "Admin Panel",
        href: "/admin",
        icon: Shield,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    return (
        <div className="hidden h-screen w-64 flex-col bg-card border-r border-border md:flex fixed left-0 top-0">
            <div className="p-6">
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        HomeSchool
                    </span>
                </Link>
            </div>

            <nav className="flex-1 flex flex-col gap-1 px-4 py-4" aria-label="Dashboard">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            end
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-primary"
                                )
                            }
                        >
                            <Icon className="h-5 w-5" />
                            {item.title}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
