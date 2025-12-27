export type KnowledgeBaseItem = {
    id: string;
    title: string;
    category: string;
    content: string;
};

export const KB_DATA: KnowledgeBaseItem[] = [
    {
        id: 'platform-overview',
        title: 'Platform Overview',
        category: 'Getting Started',
        content: `
### What is HomeSchool?
HomeSchool is a comprehensive EdTech platform designed to provide an interactive, structured, and compliant learning environment for students in Bangladesh (Class 6-12). It replaces passive video consumption with an active learning ecosystem.

### Target Audience
*   **Students:** Primary learners seeking conceptual clarity and exam preparation.
*   **Parents:** Guardians who want transparent oversight of their child's academic progress.
*   **Institutions:** Schools and coaching centers needing a digital extension for their curriculum.

### Solving Educational Problems in Bangladesh
*   **Rote Learning:** Shifts focus from memorization to conceptual understanding through interactive quizzes and simulations.
*   **Lack of Monitoring:** Provides parents with real-time analytics, unlike traditional tuition.
*   **Content Quality:** Offers standardized, high-quality content that reaches remote areas, democratizing access to education.

### Learning Flow
1.  **Lesson:** Watch video or read article.
2.  **Assessment:** Take a concept-check quiz.
3.  **Feedback:** Review incorrect answers and explanations.
4.  **Improvement:** Use personalized revision to strengthen weak areas.
        `
    },
    {
        id: 'user-roles',
        title: 'User Roles & Access Control',
        category: 'Account Management',
        content: `
### 2.1 Student Role
**What is a Student Account?**
The core learner profile. Access is limited to learning materials, personal analytics, and study tools.

**Profile Creation:**
1.  Sign up with Name, Email/Phone, and Password.
2.  Select **Class** (Critical: determines content).
3.  Select **Group** (Science/Arts/Commerce) if applicable (Class 9+).

### 2.2 Parent Role
**Linked Accounts:**
Parents create their own account and "link" to a student using a unique **Student Code** provided in the Student's profile settings.

**Access Rights:**
*   **View:** Student progress, quiz scores, time spent, attendance (login history).
*   **Edit:** Cannot edit student answers or progress. Can update billing info.
        `
    },
    {
        id: 'content-structure',
        title: 'Learning Content Structure',
        category: 'Learning',
        content: `
### Hierarchy
**Class > Subject > Chapter > Topic**
*   *Example:* Class 10 > Mathematics > Chapter 1 (Real Numbers) > Lesson 1.1 (Classification of Real Numbers).

**Search & Recommendations:**
*   **Search:** Global search bar finds Lessons, Chapters, or Questions.
*   **Recommendations:** "Up Next" suggests the next logical lesson. "Revision" suggests prior weak topics.

**Recently Viewed:**
The Dashboard remembers the last 3 accessed chapters for quick resumption.
        `
    },
    {
        id: 'chapter-page',
        title: 'Chapter Learning Page',
        category: 'Learning',
        content: `
### Components
1.  **Written Explanations:** Concise, bullet-pointed summaries of the concept.
2.  **Animations/Videos:** 5-10 minute clips explaining complex mechanics (e.g., DNA replication, Motion). Used when text isn't enough.
3.  **Visuals:** High-quality diagrams and formula boxes (e.g., Quadratic Formula highlighted).
4.  **3D Models:** Interactive simulations (e.g., Rotate a molecule, build a circuit).
    *   *Controls:* Click and drag to rotate/zoom.
5.  **Key Takeaways:** Summary box at the bottom for quick revision.
        `
    },
    {
        id: 'assessments',
        title: 'Assessments & Exams',
        category: 'Learning',
        content: `
### Chapter-End Quizzes
*   **Purpose:** Immediate validation of learning.
*   **Format:** 5-10 Multiple Choice Questions (MCQs).
*   **Evaluation:** Instant.

### Low Score Handling
*   If Score < 60%:
    *   System suggests: "Review Lesson 1.2".
    *   Retake option becomes available immediately.
    *   The "Weak Topic" flag is set.
        `
    },
    {
        id: 'progress-tracking',
        title: 'Progress Tracking & Analytics',
        category: 'Analytics',
        content: `
### Metrics
*   **Progress Bar:** % of unique lessons completed.
*   **Completion:** Have you seen the content?
*   **Accuracy:** How well did you understand it? (Avg Quiz Score).

### Improvement Tracking (Trend)
Compares current week's average accuracy vs. last week's.
*   *Example:* Week 1 (65%) -> Week 2 (72%). Trend: +7% (Improving).

### Topic Strength
*   **Strong Topic (>80%):** Green indicator. Mastered.
*   **Weak Topic (<60%):** Red indicator. Needs revision.
        `
    },
    {
        id: 'gamification',
        title: 'Gamification System',
        category: 'Features',
        content: `
### Elements
*   **XP (Experience Points):** Earned by watching videos (10 XP) and passing quizzes (50 XP).
*   **Streak:** Number of consecutive days with at least 1 lesson completed.
*   **Badges:** Milestones (e.g., "Math Whiz" for 100 Math quizzes).

### Leaderboards
*   **Scope:** Weekly reset.
*   **Filters:** Class-wide or Subject-specific.
*   *Logic:* Based on XP earned *this week*. Promotes consistency over legacy advantage.
        `
    },
    {
        id: 'personalization',
        title: 'Personalization Engine',
        category: 'Features',
        content: `
### Adaptive Logic
The engine adapts based on user performance:
*   **Difficulty:** If a student scores 100% consistently, the system suggests "Advanced Application" questions.
*   **Pace:** If a student fails repeatedly, it recommends "Prerequisite" chapters from lower classes.

### Revision Suggestions
*   **Trigger:** A quiz score < 60% tags the topic.
*   **Action:** The "Daily Feed" on the dashboard will insert a "Quick Review" card for that topic after 3 days (Spaced Repetition).
        `
    },
    {
        id: 'productivity-tools',
        title: 'Student Productivity Tools',
        category: 'Features',
        content: `
### Included Tools
1.  **Smart Notes:**
    *   *Manual:* Rich text editor for self-notes.
    *   *AI-Assist:* "Summarize this lesson" button generates a bulleted list.
2.  **Bookmarks:** Save specific timestamps in videos or difficult diagrams.
3.  **Revision Checklist:** Auto-generated list of weak topics before an exam.
4.  **Watch Later:** Queue interesting supplementary content.
        `
    },
    {
        id: 'parent-dashboard',
        title: 'Parent Dashboard',
        category: 'Account Management',
        content: `
### Metrics Visible
*   **Time Spent:** Daily breakdown (e.g., "Monday: 45 mins").
*   **Subject Coverage:** "Math: 20%, Physics: 5%".
*   **Recent Activity:** "Completed Quiz: Motion (Score: 8/10)".

### Alerts
*   **Inactivity:** "Student hasn't logged in for 3 days."
*   **Performance:** "Score dropped below 50% in Chemistry."
        `
    },
    {
        id: 'subscription',
        title: 'Subscription & Access',
        category: 'Billing',
        content: `
### Plans
1.  **Free Tier:** Access to first chapter of every subject. Basic quizzes.
2.  **Premium (Monthly/Yearly):** Full Syllabus, Mock Tests, AI Notes, Parent Dashboard.

### Expiry Handling
*   **Grace Period:** 3 days after expiry where access continues.
*   **Data Retention:** Progress is NEVER deleted, even if subscription lapses. Resubscribing restores detailed access.
        `
    },
    {
        id: 'security-privacy',
        title: 'Security & Privacy',
        category: 'Platform',
        content: `
### Authentication
*   **JWT (JSON Web Tokens):** Secure, stateless session management.
*   **Password Hashing:** Passwords are encrypted (bcrypt) before storage. We cannot read your password.

### Privacy
*   **Data Minimization:** We only collect what is needed for education.
*   **No Ad Tracking:** Student data is NEVER sold to advertisers.
        `
    },
    {
        id: 'troubleshooting',
        title: 'Troubleshooting & FAQs',
        category: 'Support',
        content: `
### Login Issues
*   **Problem:** "Invalid Password".
*   **Fix:** Use "Forgot Password" link. Check Email for reset code.

### Progress Not Updating
*   **Problem:** "I watched the video but it says 0%".
*   **Fix:** Ensure you watched at least 90% of the duration. Refresh the page.

### Payment Failures
*   **Problem:** "Money deducted but Premium not active".
*   **Fix:** Send Transaction ID to support@homeschool.bd. We reconcile manually within 24 hours.
        `
    },
    {
        id: 'future',
        title: 'Future Enhancements',
        category: 'Platform',
        content: `
### Roadmap
1.  **Live Classes:** Real-time doubt solving sessions with expert mentors.
2.  **Offline Mode:** Download content on mobile app for study without internet.
3.  **Peer Battle:** Real-time quiz competitions between friends.

### Feedback Loop
Users can submit potential features via "Suggest a Feature" in the Settings menu. Most voted features are prioritized.
        `
    }
];
