"use client";

import { Bell, Search, Menu, User } from "lucide-react";

export function Navbar() {
    return (
        <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
                <button type="button" className="md:hidden text-muted-foreground hover:text-foreground" aria-label="Open sidebar">
                    <Menu className="h-6 w-6" />
                </button>
                <div className="relative hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search courses..."
                        aria-label="Search courses"
                        className="h-9 w-64 rounded-xl border border-border bg-accent/50 py-2 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button type="button" className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-medium text-foreground">Student Name</span>
                        <span className="text-xs text-muted-foreground">Class 10</span>
                    </div>
                    <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20" aria-label="User menu">
                        <User className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
