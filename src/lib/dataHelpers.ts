import { COURSES } from './mockData';

export function getCourse(courseId: string) {
    return COURSES.find(c => c.id === courseId);
}

export function getChapter(courseId: string, chapterId: string) {
    const course = getCourse(courseId);
    if (!course) return undefined;

    return course.chapters.find(ch => ch.id === chapterId);
}

export function getLesson(courseId: string, chapterId: string, lessonId: string) {
    const chapter = getChapter(courseId, chapterId);
    if (!chapter) return undefined;

    return chapter.lessons.find(l => l.id === lessonId);
}

export function getNextLesson(courseId: string, chapterId: string, lessonId: string) {
    const course = getCourse(courseId);
    if (!course) return undefined;

    // Flatten all lessons into a single array with their context
    const allLessons = course.chapters.flatMap(ch =>
        ch.lessons.map(l => ({
            ...l,
            chapterId: ch.id,
            courseId: course.id
        }))
    );

    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    if (currentIndex === -1 || currentIndex === allLessons.length - 1) return undefined;

    return allLessons[currentIndex + 1];
}
