"use client";

import { useStudent } from "@/lib/store";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Book, CheckCircle, Circle, PlayCircle, FileText, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export default function CourseDetailPage() {
    const params = useParams();
    const { courses, progress } = useStudent();

    // In a real app, you might validate params.courseId
    const courseId = params.courseId as string;
    const course = courses.find(c => c.id === courseId);

    // Handle course not found
    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-2xl font-bold mb-4">Course not found</h2>
                <Link to="/courses" className="text-primary hover:underline flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Courses
                </Link>
            </div>
        );
    }

    const userProgress = progress[courseId as keyof typeof progress] || { completedLessons: [] };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <Link to="/courses" className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm mb-4">
                    <ArrowLeft className="h-4 w-4" /> Back to Courses
                </Link>
                <div className={`rounded-3xl p-8 text-slate-800 ${course.image} bg-opacity-30`}>
                    <div className="flex items-start justify-between">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-white/50 text-xs font-bold mb-3 border border-white/20">
                                {course.class}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
                            <p className="text-slate-700 max-w-2xl">{course.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chapters List */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Book className="h-5 w-5 text-primary" />
                    Course Content
                </h2>

                <div className="space-y-4">
                    {course.chapters.map((chapter) => (
                        <Card key={chapter.id} className="overflow-hidden">
                            <div className="bg-muted/30 p-4 border-b">
                                <h3 className="font-semibold text-lg">{chapter.title}</h3>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {chapter.lessons.length} Lessons
                                </div>
                            </div>
                            <div className="divide-y">
                                {chapter.lessons.map((lesson) => {
                                    const isCompleted = userProgress.completedLessons.includes(lesson.id);

                                    // Icon selection based on type
                                    let TypeIcon = PlayCircle;
                                    if (lesson.type === 'article') TypeIcon = FileText;
                                    if (lesson.type === 'quiz') TypeIcon = HelpCircle;

                                    return (
                                        <Link
                                            key={lesson.id}
                                            to={`/learn/${course.id}/${chapter.id}/${lesson.id}`}
                                            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "p-2 rounded-lg transition-colors",
                                                    isCompleted ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                                                )}>
                                                    <TypeIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium group-hover:text-primary transition-colors">
                                                        {lesson.title}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {lesson.type === 'quiz' ? `${// @ts-ignore
                                                            lesson.questions} Questions` : lesson.duration}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                {isCompleted ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <Circle className="h-5 w-5 text-muted-foreground/30" />
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
