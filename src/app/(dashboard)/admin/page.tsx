"use client";

import { useStudent } from "@/lib/store";
import { Users, FileText, BarChart3, Plus, Edit, Trash2 } from "lucide-react";

export default function AdminDashboard() {
    const { courses } = useStudent();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-heading">Admin Panel</h1>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90">
                    <Plus className="h-4 w-4" /> Add New Course
                </button>
            </div>

            {/* Analytics Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <AnalyticsCard title="Total Students" value="1,240" icon={Users} trend="+12% this month" />
                <AnalyticsCard title="Active Courses" value={courses.length.toString()} icon={FileText} trend="Stable" />
                <AnalyticsCard title="Quiz Completion" value="8,902" icon={BarChart3} trend="+5% this week" />
            </div>

            {/* Content Management Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Course Management</h3>
                    <input
                        type="search"
                        placeholder="Search subjects..."
                        className="text-sm border border-border rounded-lg px-3 py-1.5 w-64 bg-background"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Course Title</th>
                                <th className="px-6 py-4">Class</th>
                                <th className="px-6 py-4">Chapters</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 font-medium">{course.title}</td>
                                    <td className="px-6 py-4">{course.class}</td>
                                    <td className="px-6 py-4">{course.chapters.length} Chapters</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary transition-colors">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {/* Mock extra rows */}
                            <tr className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                <td className="px-6 py-4 font-medium">Biology</td>
                                <td className="px-6 py-4">Class 10</td>
                                <td className="px-6 py-4">8 Chapters</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Draft
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary transition-colors">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function AnalyticsCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend: string }) {
    return (
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground font-medium text-sm">{title}</span>
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="text-2xl font-bold font-heading">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">{trend}</p>
        </div>
    )
}
