"use client";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    BookOpen,
    LineChart,
    Video,
    Settings,
    LogOut,
    Users,
    HelpCircle
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTranslate } from "@/lib/i18n";

const sidebarItems = [
    {
        title: { en: "Dashboard", bn: "ড্যাশবোর্ড" },
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: { en: "My Courses", bn: "আমার কোর্স" },
        href: "/courses",
        icon: BookOpen,
    },
    {
        title: { en: "Progress", bn: "অগ্রগতি" },
        href: "/progress",
        icon: LineChart,
    },
    {
        title: { en: "Live Classes", bn: "লাইভ ক্লাস" },
        href: "/live-classes",
        icon: Video,
    },
    {
        title: { en: "Parent View", bn: "অভিভাবক ভিউ" },
        href: "/parent",
        icon: Users,
    },
    {
        title: { en: "Help Center", bn: "সহায়তা কেন্দ্র" },
        href: "/help",
        icon: HelpCircle,
    },
    {
        title: { en: "Settings", bn: "সেটিংস" },
        href: "/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const navigate = useNavigate();
    const { signOut, user } = useAuth();
    const t = useTranslate();
    const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || t({ en: "Student", bn: "শিক্ষার্থী" });

    const handleSignOut = async () => {
        await signOut();
        navigate("/login");
    };

    return (
        <div className="hidden h-screen w-64 flex-col bg-card border-r border-border md:flex fixed left-0 top-0">
            <div className="p-6">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="HomeSchool" className="h-10 w-auto" loading="lazy" />
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
                            {t(item.title)}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="mb-3 text-xs text-muted-foreground">
                    {t({ en: "Signed in as", bn: "সাইন ইন" })}: {displayName}
                </div>
                <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    {t({ en: "Sign Out", bn: "সাইন আউট" })}
                </button>
            </div>
        </div>
    );
}
