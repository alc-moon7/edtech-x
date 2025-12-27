"use client";

import { useStudent } from "@/lib/store";
import { BookOpen, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function CoursesPage() {
    const { courses, progress } = useStudent();

    const getCourseProgress = (courseId: string) => {
        const courseData = courses.find(c => c.id === courseId);
        if (!courseData) return 0;

        const totalLessons = courseData.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
        if (totalLessons === 0) return 0;

        const userProgress = progress[courseId as keyof typeof progress];
        const completedCount = userProgress?.completedLessons?.length || 0;

        return Math.round((completedCount / totalLessons) * 100);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-heading">My Courses</h1>
                <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                    Browse All
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courses.map((course) => {
                    const courseProgress = getCourseProgress(course.id);
                    // Calculate total lessons dynamically
                    const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
                    // Calculate mock duration (just for display consistency) or use value from mockData if available, 
                    // stored mockData doesn't have duration on root, only on lessons. 
                    // For now we'll sum lesson durations or use a placeholder if complex.
                    // Actually checking mockData again, COURSES doesn't have duration on root. 
                    // Let's implement a helper or just static "10h" for now to match UI design.

                    return (
                        <div key={course.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                            <div className={`h-32 w-full ${course.image} relative`}>
                                <div className="absolute top-3 right-3 rounded-lg bg-background/90 px-2 py-1 text-xs font-bold backdrop-blur-sm">
                                    {course.class}
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-accent-foreground">
                                        <Star className="h-3 w-3 fill-accent text-accent" />
                                        4.8
                                    </span>
                                    <span className="text-xs text-muted-foreground">{totalLessons} Lessons</span>
                                </div>

                                <h3 className="mb-2 text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
                                    {course.title}
                                </h3>

                                <div className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    12h 30m
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-medium">
                                        <span>{courseProgress}% Complete</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full bg-primary transition-all duration-500 ease-out"
                                            style={{ width: `${courseProgress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Link
                                        to={`/courses/${course.id}`}
                                        className="inline-block w-full text-center rounded-lg border border-primary/20 bg-primary/5 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-all"
                                    >
                                        {courseProgress > 0 ? "Continue Learning" : "Start Course"}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
