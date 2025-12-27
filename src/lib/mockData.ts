export const COURSES = [
    {
        id: "math-10",
        title: "General Mathematics",
        class: "Class 10",
        description: "Comprehensive coverage of the NCTB Class 10 Mathematics syllabus.",
        image: "bg-blue-100",
        color: "primary",
        chapters: [
            {
                id: "ch-1",
                title: "Real Numbers",
                lessons: [
                    { id: "l-1-1", title: "Introduction to Real Numbers", type: "video", duration: "10:00" },
                    { id: "l-1-2", title: "Classification of Real Numbers", type: "video", duration: "15:00" },
                    { id: "q-1-1", title: "Real Numbers Quiz", type: "quiz", questions: 5 }
                ]
            },
            {
                id: "ch-2",
                title: "Sets and Functions",
                lessons: [
                    { id: "l-2-1", title: "Introduction to Sets", type: "video", duration: "12:00" },
                    { id: "l-2-2", title: "Set Operations", type: "article", duration: "5:00" },
                    { id: "l-2-3", title: "Functions and Relations", type: "video", duration: "20:00" },
                    { id: "q-2-1", title: "Sets Quiz", type: "quiz", questions: 10 }
                ]
            },
            {
                id: "ch-3",
                title: "Algebraic Expressions",
                lessons: [
                    { id: "l-3-1", title: "Algebraic Formulas", type: "video", duration: "12:00" },
                    { id: "l-3-2", title: "Factorization", type: "video", duration: "15:00" },
                ]
            }
        ]
    },
    {
        id: "physics-10",
        title: "Physics",
        class: "Class 10",
        description: "Explore the fundamental laws of nature with interactive experiments.",
        image: "bg-teal-100",
        color: "secondary",
        chapters: [
            {
                id: "ch-p-1",
                title: "Motion",
                lessons: [
                    { id: "l-p-1-1", title: "Scalar and Vector Quantities", type: "video", duration: "10:00" },
                    { id: "l-p-1-2", title: "Equations of Motion", type: "video", duration: "18:00" },
                    { id: "q-p-1", title: "Motion Quiz", type: "quiz", questions: 8 }
                ]
            }
        ]
    }
];

export const MOCK_QUIZ_Questions = {
    "q-1-1": [
        {
            id: 1,
            question: "Which of the following is a rational number?",
            options: ["√2", "π", "0.5", "√3"],
            correctAnswer: 2 // Index of correct answer
        },
        {
            id: 2,
            question: "What is the set of all natural numbers marked as?",
            options: ["Z", "N", "Q", "R"],
            correctAnswer: 1
        }
    ]
};

export const USER_PROGRESS = {
    "math-10": {
        completedLessons: ["l-1-1", "l-1-2"],
        quizScores: { "q-1-1": 80 }
    }
};

export const LEADERBOARD_DATA = [
    { rank: 1, name: "Arian Ahmed", points: 2450, avatar: "bg-blue-500" },
    { rank: 2, name: "Sumaiya Islam", points: 2320, avatar: "bg-teal-500" },
    { rank: 3, name: "Rahim Uddin", points: 2100, avatar: "bg-purple-500" },
    { rank: 4, name: "You", points: 1850, avatar: "bg-primary" },
    { rank: 5, name: "Nusrat Jahan", points: 1780, avatar: "bg-orange-500" },
];

export const USER_STATS = {
    streak: 5,
    totalPoints: 1850,
    weeklyActivity: [true, true, false, true, true, true, false] // Sun-Sat
};

export type UserRole = 'student' | 'parent' | 'admin';

export const USERS = [
    {
        id: 'u-1',
        role: 'student' as UserRole,
        name: 'Arian Ahmed',
        email: 'student@example.com',
        avatar: 'bg-primary'
    },
    {
        id: 'u-2',
        role: 'parent' as UserRole,
        name: 'Mr. Ahmed',
        email: 'parent@example.com',
        avatar: 'bg-blue-500'
    },
    {
        id: 'u-3',
        role: 'admin' as UserRole,
        name: 'Admin User',
        email: 'admin@example.com',
        avatar: 'bg-purple-500'
    }
];
