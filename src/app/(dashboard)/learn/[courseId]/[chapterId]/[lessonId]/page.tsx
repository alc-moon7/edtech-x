"use client";

import { useStudent } from "@/lib/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, ChevronRight, PlayCircle, FileText, HelpCircle, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { getNextLesson } from "@/lib/dataHelpers";

export default function LessonPlayerPage() {
    const params = useParams();
    const navigate = useNavigate();
    const { courses, progress, markLessonComplete } = useStudent();

    const courseId = params.courseId as string;
    const chapterId = params.chapterId as string;
    const lessonId = params.lessonId as string;

    const course = courses.find(c => c.id === courseId);
    const chapter = course?.chapters.find(ch => ch.id === chapterId);
    const lesson = chapter?.lessons.find(l => l.id === lessonId);

    // Handle 404
    if (!course || !chapter || !lesson) {
        return <div className="p-8 text-center">Lesson not found.</div>;
    }

    const userProgress = progress[courseId as keyof typeof progress] || { completedLessons: [] };
    const isCompleted = userProgress.completedLessons.includes(lessonId);

    const handleComplete = () => {
        markLessonComplete(courseId, lessonId);

        // Auto-navigate to next lesson? Or just show next button?
        // Let's just mark it and maybe show a toast (omitted for MVP)
    };

    const nextLesson = getNextLesson(courseId, chapterId, lessonId);

    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] overflow-hidden">
            {/* Sidebar (Lesson List) - Hidden on Mobile for MVP simplicity, usually responsive drawer */}
            <div className="hidden md:flex w-80 flex-col border-r bg-card overflow-y-auto">
                <div className="p-4 border-b">
                    <Link to={`/courses/${courseId}`} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 mb-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Course
                    </Link>
                    <h2 className="font-bold line-clamp-1">{course.title}</h2>
                    <p className="text-xs text-muted-foreground">{chapter.title}</p>
                </div>

                <div className="flex-1 overflow-y-auto py-2">
                    {chapter.lessons.map((l) => {
                        const lCompleted = userProgress.completedLessons.includes(l.id);
                        const isActive = l.id === lessonId;

                        let TypeIcon = PlayCircle;
                        if (l.type === 'article') TypeIcon = FileText;
                        if (l.type === 'quiz') TypeIcon = HelpCircle;

                        return (
                            <Link
                                key={l.id}
                                to={`/learn/${courseId}/${chapterId}/${l.id}`}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-l-2",
                                    isActive ? "bg-primary/5 border-primary" : "border-transparent",
                                    lCompleted && !isActive ? "text-muted-foreground" : ""
                                )}
                            >
                                <div className={cn(
                                    "p-1.5 rounded-md",
                                    isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                )}>
                                    <TypeIcon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 text-sm line-clamp-2">
                                    {l.title}
                                </div>
                                {lCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background/50">
                {/* Mobile Header (simplified) */}
                <div className="md:hidden p-4 border-b bg-card flex items-center justify-between">
                    <Link to={`/courses/${courseId}`} className="text-muted-foreground">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <span className="font-semibold truncate mx-4">{lesson.title}</span>
                    <Button variant="ghost" size="sm">
                        <LayoutList className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
                    <div className="aspect-video bg-black rounded-xl shadow-lg mb-8 flex items-center justify-center relative overflow-hidden group">
                        {lesson.type === 'video' ? (
                            <div className="text-center">
                                <PlayCircle className="h-20 w-20 text-white/50 group-hover:text-white transition-colors mx-auto mb-4" />
                                <p className="text-white/70">Video Placeholder</p>
                                <p className="text-xs text-white/50">{lesson.id}</p>
                            </div>
                        ) : lesson.type === 'article' ? (
                            <div className="bg-white text-black w-full h-full p-8 overflow-y-auto text-left">
                                <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
                                <p className="text-lg leading-relaxed text-gray-700">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...
                                </p>
                            </div>
                        ) : (
                            <div className="text-center text-white">
                                <HelpCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-bold">Quiz Mode</h3>
                                <p>Click "Start Quiz" to begin</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-6 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium uppercase text-[10px] tracking-wider">
                                    {lesson.type}
                                </span>
                                <span>• {lesson.type === 'quiz' ? '5 Questions' : lesson.duration}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button
                                onClick={handleComplete}
                                variant={isCompleted ? "outline" : "default"}
                                className={cn(
                                    "flex-1 md:flex-none gap-2",
                                    isCompleted ? "text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700" : ""
                                )}
                            >
                                {isCompleted ? (
                                    <><CheckCircle className="h-4 w-4" /> Completed</>
                                ) : "Mark Complete"}
                            </Button>

                            {nextLesson && (
                                <Button
                                    variant="ghost"
                                    className="gap-2"
                                    onClick={() => navigate(`/learn/${courseId}/${nextLesson.chapterId}/${nextLesson.id}`)}
                                >
                                    Next <ChevronRight className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="prose max-w-none text-muted-foreground">
                        <h3 className="text-foreground">About this lesson</h3>
                        <p>
                            In this lesson, we will explore the fundamental concepts of {lesson.title}.
                            Ensure you have your notebook ready to take down important key points.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
