import {
  User,
  CourseCategory,
  Course,
  Module,
  Enrollment,
  LessonProgress,
  Quiz,
  Assignment,
  AssignmentSubmission,
  Certificate,
  Notification,
  Announcement,
  SiteSettings
} from '../types/lms';

export const initialSiteSettings: SiteSettings = {
  settingId: 'main_settings',
  lmsName: 'Zohaib Tech Rise LMS',
  tagline: 'Learn Today. Innovate Tomorrow.',
  institutionName: 'Zohaib Tech Rise',
  logoUrl: '',
  primaryColor: '#0F2744',
  contactEmail: 'contact@zohaibtechrise.com',
  contactPhone: '+92 300 1234567',
  address: 'Zohaib Tech Rise Learning Center, Innovation Avenue, Tech Sector, Islamabad, Pakistan',
  videoProvider: 'youtube',
  videoWatchedThresholdPercent: 80,
  certificateSigningInstructor: 'Zohaib Ali',
  certificateSigningAdmin: 'Admin Team Zohaib Tech Rise LMS',
  enableStudentRegistration: true,
  firebaseConfigured: false
};

export const initialUsers: User[] = [
  {
    uid: 'admin_1',
    fullName: 'Zohaib Ali',
    email: 'admin@zohaibtechrise.com',
    role: 'super_admin',
    accountStatus: 'active',
    headline: 'Founder & Head of Innovation',
    bio: 'Senior full-stack architect and educator dedicated to transforming digital skills education.',
    profileImage: '/assets/admin_zohaib.jpg',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z'
  },
  {
    uid: 'inst_1',
    fullName: 'Zohaib Ali',
    email: 'zohaib.ali@zohaibtechrise.com',
    role: 'instructor',
    accountStatus: 'active',
    headline: 'Lead Web Development & Software Engineering Instructor',
    bio: 'Full Stack engineer with 8+ years experience building cloud applications, mentoring over 15,000 students.',
    profileImage: '/assets/admin_zohaib.jpg',
    createdAt: '2026-01-12T09:00:00Z',
    updatedAt: '2026-09-18T10:00:00Z'
  },
  {
    uid: 'inst_2',
    fullName: 'Fatima Zahra',
    email: 'fatima.zahra@zohaibtechrise.com',
    role: 'instructor',
    accountStatus: 'active',
    headline: 'Senior Multimedia Producer & Video Editing Specialist',
    bio: 'Professional video editor and colorist with industry experience producing commercials and documentary shorts.',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-09-15T12:00:00Z'
  },
  {
    uid: 'student_1',
    fullName: 'Muhammad Ali',
    email: 'ali@example.com',
    role: 'student',
    accountStatus: 'active',
    headline: 'Aspiring Full Stack Web Developer',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    bio: 'Computer Science sophomore passionate about web development, UI/UX, and cloud applications.',
    createdAt: '2026-03-01T11:00:00Z',
    updatedAt: '2026-09-22T14:00:00Z'
  },
  {
    uid: 'student_2',
    fullName: 'Ayesha Khan',
    email: 'ayesha@example.com',
    role: 'student',
    accountStatus: 'active',
    headline: 'Digital Media & Video Editing Student',
    profileImage: '/assets/student_ayesha.jpg',
    createdAt: '2026-03-05T12:30:00Z',
    updatedAt: '2026-09-24T09:00:00Z'
  },
  {
    uid: 'student_3',
    fullName: 'Sara Ahmed',
    email: 'sara@example.com',
    role: 'student',
    accountStatus: 'active',
    headline: 'Python & AI Enthusiast',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-03-10T14:15:00Z',
    updatedAt: '2026-09-21T11:00:00Z'
  },
  {
    uid: 'student_4',
    fullName: 'Usman Raza',
    email: 'usman@example.com',
    role: 'student',
    accountStatus: 'active',
    headline: 'Freelance Graphics Designer',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-03-15T16:00:00Z',
    updatedAt: '2026-09-23T15:20:00Z'
  }
];

export const initialCategories: CourseCategory[] = [
  {
    categoryId: 'cat_web',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Frontend, backend, HTML, CSS, JavaScript, React, and full stack modern engineering.',
    iconName: 'Code',
    order: 1,
    status: 'active'
  },
  {
    categoryId: 'cat_video',
    name: 'Video Editing',
    slug: 'video-editing',
    description: 'Adobe Premiere Pro, DaVinci Resolve, cinematic color grading, and video storytelling.',
    iconName: 'Video',
    order: 2,
    status: 'active'
  },
  {
    categoryId: 'cat_design',
    name: 'Graphic Design',
    slug: 'graphic-design',
    description: 'Photoshop, Illustrator, Figma, brand identity design, and modern vector art.',
    iconName: 'Palette',
    order: 3,
    status: 'active'
  },
  {
    categoryId: 'cat_marketing',
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'SEO, Google Ads, social media growth, email marketing, and content strategy.',
    iconName: 'TrendingUp',
    order: 4,
    status: 'active'
  },
  {
    categoryId: 'cat_ai',
    name: 'Python with AI',
    slug: 'python-with-ai',
    description: 'Python programming from scratch, data analysis, automation, and AI integrations.',
    iconName: 'Cpu',
    order: 5,
    status: 'active'
  },
  {
    categoryId: 'cat_freelance',
    name: 'Freelancing',
    slug: 'freelancing',
    description: 'Master Upwork, Fiverr, proposal writing, client communication, and international billing.',
    iconName: 'Briefcase',
    order: 6,
    status: 'active'
  }
];

export const initialCourses: Course[] = [
  {
    courseId: 'course_web_dev',
    title: 'Web Development with HTML, CSS & JavaScript',
    slug: 'web-development-html-css-javascript',
    shortDescription: 'Master modern frontend fundamentals, semantic markup, responsive layouts, and interactive JavaScript.',
    description: 'This comprehensive flagship course from Zohaib Tech Rise LMS equips students with real-world skills to build responsive, accessible, and fast web pages. Starting with HTML5 fundamentals and modern CSS layouts (Flexbox & Grid), you will progress to JavaScript DOM manipulation, event-driven programming, and practical capstone projects.',
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat_web',
    instructorIds: ['inst_1'],
    level: 'Beginner',
    language: 'English / Urdu',
    durationWeeks: 8,
    estimatedHours: 40,
    totalModules: 3,
    totalLessons: 6,
    learningOutcomes: [
      'Write clean, accessible, semantic HTML5 code adhering to W3C standards',
      'Design fluid, responsive interfaces using CSS Flexbox, Grid, and media queries',
      'Implement interactive web features using core JavaScript and modern ES6+ syntax',
      'Work with browser storage, DOM events, and asynchronous web requests',
      'Deploy live websites using GitHub Pages and modern hosting platforms'
    ],
    prerequisites: [
      'Basic computer literacy and web browsing knowledge',
      'A computer with a modern web browser and VS Code installed',
      'No prior programming background required'
    ],
    status: 'published',
    certificateEnabled: true,
    isFeatured: true,
    rating: 4.9,
    ratingCount: 382,
    enrolledCount: 1420,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-09-20T12:00:00Z'
  },
  {
    courseId: 'course_video_editing',
    title: 'Video Editing Masterclass',
    slug: 'video-editing-masterclass',
    shortDescription: 'Learn professional video editing from basics to advanced level using Adobe Premiere Pro and DaVinci.',
    description: 'Step into the world of cinematic visual storytelling. This hands-on masterclass covers clip sequencing, timeline trimming, color grading, sound design, transitions, visual effects, and exporting high-impact reels for YouTube, Instagram, and commercial clients.',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat_video',
    instructorIds: ['inst_2'],
    level: 'Intermediate',
    language: 'English / Urdu',
    durationWeeks: 6,
    estimatedHours: 32,
    totalModules: 3,
    totalLessons: 5,
    learningOutcomes: [
      'Master video editing timeline workflow and cutting techniques',
      'Work with transitions, motion graphics, and audio leveling',
      'Apply professional color correction and cinematic LUTs',
      'Export high-resolution video optimized for YouTube, TikTok, and social media'
    ],
    prerequisites: [
      'Computer capable of running Adobe Premiere Pro or DaVinci Resolve',
      'Basic familiarity with digital video files'
    ],
    status: 'published',
    isFeatured: true,
    certificateEnabled: true,
    rating: 4.8,
    ratingCount: 298,
    enrolledCount: 980,
    createdAt: '2026-02-15T11:00:00Z',
    updatedAt: '2026-09-22T08:00:00Z'
  },
  {
    courseId: 'course_graphic_design',
    title: 'Graphic Design & Creative Branding',
    slug: 'graphic-design-creative-branding',
    shortDescription: 'Design your creative future with Adobe Photoshop, Illustrator, and Figma branding principles.',
    description: 'Develop an eye for typography, color harmony, visual hierarchy, logo design, and social media marketing creatives. Practice with real client briefs and build a portfolio ready for freelancing.',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat_design',
    instructorIds: ['inst_2'],
    level: 'Beginner',
    language: 'English / Urdu',
    durationWeeks: 6,
    estimatedHours: 28,
    totalModules: 2,
    totalLessons: 4,
    learningOutcomes: [
      'Master vector illustration with Adobe Illustrator',
      'Photo manipulation and retouching in Adobe Photoshop',
      'Create brand identities, logo marks, and business collateral'
    ],
    prerequisites: ['No drawing skills required. Basic computer literacy.'],
    status: 'published',
    isFeatured: true,
    certificateEnabled: true,
    rating: 4.7,
    ratingCount: 215,
    enrolledCount: 840,
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-09-18T10:00:00Z'
  },
  {
    courseId: 'course_python_ai',
    title: 'Python Programming with AI & Automation',
    slug: 'python-programming-ai-automation',
    shortDescription: 'From core Python syntax to automating tasks, web scraping, and building intelligent AI-assisted apps.',
    description: 'Learn Python programming language step-by-step with practical exercises, logic building, data handling, and integrations with modern LLMs and automated scripts.',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'cat_ai',
    instructorIds: ['inst_1'],
    level: 'Intermediate',
    language: 'English / Urdu',
    durationWeeks: 8,
    estimatedHours: 36,
    totalModules: 2,
    totalLessons: 4,
    learningOutcomes: [
      'Master fundamental Python data types, loops, and functions',
      'Automate repetitive file and web tasks with Python scripts',
      'Interact with REST APIs and build AI-powered solutions'
    ],
    prerequisites: ['Basic logical thinking.'],
    status: 'published',
    isFeatured: true,
    certificateEnabled: true,
    rating: 4.9,
    ratingCount: 310,
    enrolledCount: 1100,
    createdAt: '2026-03-05T09:00:00Z',
    updatedAt: '2026-09-21T09:00:00Z'
  }
];

export const initialModules: Module[] = [
  {
    moduleId: 'mod_web_1',
    courseId: 'course_web_dev',
    title: 'Module 1: Introduction to Web Development & HTML5',
    description: 'Understand how the web works, client-server models, document structure, and semantic elements.',
    order: 1,
    lessons: [
      {
        lessonId: 'les_web_1',
        courseId: 'course_web_dev',
        moduleId: 'mod_web_1',
        title: 'Lesson 1: Welcome to the Course & Web Basics',
        description: 'An overview of what web development is, how browsers render HTML, setting up VS Code, and course roadmap.',
        videoProvider: 'youtube',
        videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE',
        durationMinutes: 12,
        durationFormatted: '12:30',
        isPreview: true,
        order: 1,
        resources: [
          {
            id: 'res_1',
            title: 'Web Development Starter Guide.pdf',
            fileType: 'PDF',
            fileSize: '2.4 MB',
            url: '#'
          }
        ]
      },
      {
        lessonId: 'les_web_2',
        courseId: 'course_web_dev',
        moduleId: 'mod_web_1',
        title: 'Lesson 2: Semantic HTML5 Elements & Structure',
        description: 'Deep dive into headers, navigation, main, sections, articles, and semantic markup for SEO and accessibility.',
        videoProvider: 'youtube',
        videoUrl: 'https://www.youtube.com/embed/kUMe1FH4CHE',
        durationMinutes: 15,
        durationFormatted: '15:45',
        isPreview: true,
        order: 2,
        resources: []
      }
    ]
  },
  {
    moduleId: 'mod_web_2',
    courseId: 'course_web_dev',
    title: 'Module 2: Styling with Modern CSS & Flexbox',
    description: 'Master the box model, typography, CSS variables, responsive design, and Flexbox layouts.',
    order: 2,
    lessons: [
      {
        lessonId: 'les_web_3',
        courseId: 'course_web_dev',
        moduleId: 'mod_web_2',
        title: 'Lesson 3: The CSS Box Model & Selectors',
        description: 'Understanding padding, borders, margins, display types, and specificity in CSS.',
        videoProvider: 'youtube',
        videoUrl: 'https://www.youtube.com/embed/1PnVor36_40',
        durationMinutes: 18,
        durationFormatted: '18:10',
        isPreview: false,
        order: 1,
        resources: []
      },
      {
        lessonId: 'les_web_4',
        courseId: 'course_web_dev',
        moduleId: 'mod_web_2',
        title: 'Lesson 4: Building Responsive Layouts with Flexbox',
        description: 'Complete guide to flex containers, justify-content, align-items, flex-direction, and flex-wrap.',
        videoProvider: 'youtube',
        videoUrl: 'https://www.youtube.com/embed/fYq5PXgSsbE',
        durationMinutes: 20,
        durationFormatted: '20:15',
        isPreview: false,
        order: 2,
        resources: []
      }
    ]
  },
  {
    moduleId: 'mod_web_3',
    courseId: 'course_web_dev',
    title: 'Module 3: JavaScript Fundamentals & DOM Interaction',
    description: 'Learn variables, functions, conditions, loops, and manipulating the browser Document Object Model.',
    order: 3,
    lessons: [
      {
        lessonId: 'les_web_5',
        courseId: 'course_web_dev',
        moduleId: 'mod_web_3',
        title: 'Lesson 5: JavaScript Variables, Loops & Functions',
        description: 'Modern JavaScript syntax: let/const, arrow functions, template literals, and logical conditions.',
        videoProvider: 'youtube',
        videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
        durationMinutes: 22,
        durationFormatted: '22:40',
        isPreview: false,
        order: 1,
        resources: []
      },
      {
        lessonId: 'les_web_6',
        courseId: 'course_web_dev',
        moduleId: 'mod_web_3',
        title: 'Lesson 6: Dynamic DOM Manipulation & Event Handling',
        description: 'Select elements, handle click events, toggle classes, and build an interactive to-do list app.',
        videoProvider: 'youtube',
        videoUrl: 'https://www.youtube.com/embed/5fb2aPlgoys',
        durationMinutes: 25,
        durationFormatted: '25:00',
        isPreview: false,
        order: 2,
        resources: []
      }
    ]
  }
];

export const initialQuizzes: Quiz[] = [
  {
    quizId: 'quiz_web_1',
    courseId: 'course_web_dev',
    moduleId: 'mod_web_1',
    title: 'Quiz 1: HTML5 Fundamentals & Semantic Web',
    description: 'Assess fundamental understanding of modern semantic HTML5 and accessibility.',
    instructions: 'Answer all 4 questions within the time limit. Passing mark is 70%.',
    startDate: '2026-09-01T00:00:00Z',
    deadline: '2026-12-31T23:59:59Z',
    timeLimitMinutes: 15,
    passingPercentage: 70,
    maxAttempts: 3,
    totalMarks: 20,
    randomizeQuestions: false,
    randomizeAnswers: false,
    availability: 'all_enrolled',
    assignedStudentIds: ['student_1', 'student_2'],
    status: 'published',
    createdAt: '2026-02-05T10:00:00Z',
    questions: [
      {
        questionId: 'q_w1_1',
        quizId: 'quiz_web_1',
        questionType: 'multiple_choice',
        questionText: 'Which HTML5 element is specifically designed to contain the main navigation links of a website?',
        options: ['<nav>', '<menu>', '<header>', '<navigation>'],
        correctAnswer: '<nav>',
        marks: 5,
        explanation: '<nav> is the semantic HTML5 tag intended for major navigational blocks.',
        order: 1
      },
      {
        questionId: 'q_w1_2',
        quizId: 'quiz_web_1',
        questionType: 'multiple_choice',
        questionText: 'What is the correct declaration for specifying HTML5 document type?',
        options: ['<!DOCTYPE html>', '<!DOCTYPE HTML5>', '<html doctype="5">', '<?xml version="1.0"?>'],
        correctAnswer: '<!DOCTYPE html>',
        marks: 5,
        explanation: '<!DOCTYPE html> is the concise, case-insensitive doctype required for HTML5.',
        order: 2
      },
      {
        questionId: 'q_w1_3',
        quizId: 'quiz_web_1',
        questionType: 'true_false',
        questionText: 'The alt attribute in an <img> tag is optional and has no effect on accessibility or SEO.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        marks: 5,
        explanation: 'The alt attribute is essential for screen readers (accessibility) and helps search engine crawlers understand image content.',
        order: 3
      },
      {
        questionId: 'q_w1_4',
        quizId: 'quiz_web_1',
        questionType: 'multiple_choice',
        questionText: 'Which element is used to group related input fields in a web form?',
        options: ['<fieldset>', '<group>', '<form-group>', '<section>'],
        correctAnswer: '<fieldset>',
        marks: 5,
        explanation: '<fieldset> with an optional <legend> is the semantic standard for grouping related form controls.',
        order: 4
      }
    ]
  },
  {
    quizId: 'quiz_vid_1',
    courseId: 'course_video_editing',
    moduleId: 'mod_vid_1',
    title: 'Quiz 1: Video Editing Basics & Framerates',
    description: 'Test essential non-linear editing concepts, codecs, and cinema framerates.',
    instructions: 'Demonstrate your knowledge of editing terminology. Passing score is 70%.',
    startDate: '2026-09-01T00:00:00Z',
    deadline: '2026-12-31T23:59:59Z',
    timeLimitMinutes: 15,
    passingPercentage: 70,
    maxAttempts: 3,
    totalMarks: 30,
    randomizeQuestions: false,
    randomizeAnswers: false,
    availability: 'all_enrolled',
    assignedStudentIds: ['student_2'],
    status: 'published',
    createdAt: '2026-02-18T10:00:00Z',
    questions: [
      {
        questionId: 'q_v1_1',
        quizId: 'quiz_vid_1',
        questionType: 'multiple_choice',
        questionText: 'Which software is most commonly used for professional non-linear video editing?',
        options: ['Adobe Premiere Pro', 'Microsoft Word', 'Photoshop', 'Excel'],
        correctAnswer: 'Adobe Premiere Pro',
        marks: 10,
        explanation: 'Adobe Premiere Pro and DaVinci Resolve are industry standard NLE platforms.',
        order: 1
      },
      {
        questionId: 'q_v1_2',
        quizId: 'quiz_vid_1',
        questionType: 'multiple_choice',
        questionText: 'What is the standard cinema framerate used worldwide?',
        options: ['24 fps', '60 fps', '120 fps', '15 fps'],
        correctAnswer: '24 fps',
        marks: 10,
        explanation: '24 frames per second is the traditional international standard for cinematic motion blur.',
        order: 2
      },
      {
        questionId: 'q_v1_3',
        quizId: 'quiz_vid_1',
        questionType: 'true_false',
        questionText: 'A "J-Cut" means the audio of the following scene starts before the visual video cut occurs.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        marks: 10,
        explanation: 'In a J-cut, incoming audio precedes the video transition.',
        order: 3
      }
    ]
  }
];

export const initialAssignments: Assignment[] = [
  {
    assignmentId: 'assign_web_1',
    courseId: 'course_web_dev',
    moduleId: 'mod_web_2',
    title: 'Assignment 1: Responsive Portfolio Landing Page',
    instructions: 'Build a single-page responsive personal portfolio using semantic HTML5 and modern CSS Flexbox. It must include a Hero section, About Me, Skills grid, and Contact Form. Ensure it adapts smoothly to mobile screens (min-width: 375px).',
    maxMarks: 100,
    passingMarks: 60,
    startDate: '2026-09-01T00:00:00Z',
    dueDate: '2026-10-15T23:59:59Z',
    allowedFileTypes: ['.zip', '.html', '.css', '.pdf'],
    maxFileSizeMb: 25,
    submissionType: 'both',
    lateSubmissionPolicy: 'allow',
    assignedType: 'all_enrolled',
    assignedStudentIds: ['student_1', 'student_2'],
    status: 'published',
    attachments: [
      {
        title: 'Portfolio Design Specifications & Wireframe.pdf',
        url: '#',
        size: '1.8 MB'
      }
    ],
    createdAt: '2026-02-10T10:00:00Z'
  },
  {
    assignmentId: 'assign_vid_1',
    courseId: 'course_video_editing',
    moduleId: 'mod_vid_2',
    title: 'Assignment 1: Practice Editing - 60 Second Cinematic Reel',
    instructions: 'Create a 1-minute video using provided raw footage. Add transitions, text title, synchronized background music, and upload your final video file or Google Drive/Vimeo link along with notes.',
    maxMarks: 100,
    passingMarks: 60,
    startDate: '2026-09-01T00:00:00Z',
    dueDate: '2026-10-20T23:59:59Z',
    allowedFileTypes: ['.mp4', '.mov', '.zip', '.pdf'],
    maxFileSizeMb: 100,
    submissionType: 'both',
    lateSubmissionPolicy: 'allow',
    assignedType: 'all_enrolled',
    assignedStudentIds: ['student_2'],
    status: 'published',
    attachments: [
      {
        title: 'Sample Footage.zip',
        url: '#',
        size: '25 MB'
      }
    ],
    createdAt: '2026-02-22T10:00:00Z'
  }
];

export const initialEnrollments: Enrollment[] = [
  {
    enrollmentId: 'enr_ali_web',
    studentId: 'student_1', // Muhammad Ali
    courseId: 'course_web_dev',
    enrollmentDate: '2026-03-02T10:00:00Z',
    status: 'completed',
    progressPercentage: 100,
    completedLessonsCount: 6,
    completionDate: '2026-09-25T14:30:00Z'
  },
  {
    enrollmentId: 'enr_ayesha_vid',
    studentId: 'student_2', // Ayesha Khan
    courseId: 'course_video_editing',
    enrollmentDate: '2026-03-08T11:00:00Z',
    status: 'active',
    progressPercentage: 32,
    completedLessonsCount: 2
  },
  {
    enrollmentId: 'enr_ayesha_web',
    studentId: 'student_2',
    courseId: 'course_web_dev',
    enrollmentDate: '2026-03-12T14:00:00Z',
    status: 'active',
    progressPercentage: 16,
    completedLessonsCount: 1
  }
];

export const initialLessonProgress: LessonProgress[] = [
  {
    progressId: 'lp_1',
    studentId: 'student_1',
    courseId: 'course_web_dev',
    lessonId: 'les_web_1',
    lastPlaybackPosition: 750,
    completionStatus: 'completed',
    completedAt: '2026-03-03T11:00:00Z',
    updatedAt: '2026-03-03T11:00:00Z'
  },
  {
    progressId: 'lp_2',
    studentId: 'student_1',
    courseId: 'course_web_dev',
    lessonId: 'les_web_2',
    lastPlaybackPosition: 945,
    completionStatus: 'completed',
    completedAt: '2026-03-04T12:00:00Z',
    updatedAt: '2026-03-04T12:00:00Z'
  },
  {
    progressId: 'lp_3',
    studentId: 'student_1',
    courseId: 'course_web_dev',
    lessonId: 'les_web_3',
    lastPlaybackPosition: 1090,
    completionStatus: 'completed',
    completedAt: '2026-03-06T15:00:00Z',
    updatedAt: '2026-03-06T15:00:00Z'
  },
  {
    progressId: 'lp_4',
    studentId: 'student_1',
    courseId: 'course_web_dev',
    lessonId: 'les_web_4',
    lastPlaybackPosition: 1215,
    completionStatus: 'completed',
    completedAt: '2026-03-08T16:00:00Z',
    updatedAt: '2026-03-08T16:00:00Z'
  },
  {
    progressId: 'lp_5',
    studentId: 'student_1',
    courseId: 'course_web_dev',
    lessonId: 'les_web_5',
    lastPlaybackPosition: 1360,
    completionStatus: 'completed',
    completedAt: '2026-03-12T14:00:00Z',
    updatedAt: '2026-03-12T14:00:00Z'
  },
  {
    progressId: 'lp_6',
    studentId: 'student_1',
    courseId: 'course_web_dev',
    lessonId: 'les_web_6',
    lastPlaybackPosition: 1500,
    completionStatus: 'completed',
    completedAt: '2026-09-24T12:00:00Z',
    updatedAt: '2026-09-24T12:00:00Z'
  }
];

export const initialCertificates: Certificate[] = [
  {
    certificateId: 'cert_ali_wd',
    studentId: 'student_1',
    studentName: 'Muhammad Ali',
    studentEmail: 'ali@example.com',
    courseId: 'course_web_dev',
    courseTitle: 'Web Development with HTML, CSS & JavaScript',
    instructorName: 'Zohaib Ali',
    authorizedSignatory: 'Admin Team Zohaib Tech Rise LMS',
    issueDate: '25 September 2026',
    completionDate: '25 September 2026',
    verificationCode: 'ZTR-2026-WD-8491',
    verificationUrl: '/certificate-verification?id=ZTR-2026-WD-8491',
    status: 'valid',
    completionScore: 95,
    editHistory: []
  }
];

export const initialAssignmentSubmissions: AssignmentSubmission[] = [
  {
    submissionId: 'sub_1',
    assignmentId: 'assign_web_1',
    studentId: 'student_1',
    courseId: 'course_web_dev',
    textAnswer: 'I have implemented the complete portfolio layout with semantic HTML5, Flexbox grid, and responsive media queries. Hosted preview and ZIP attached.',
    fileUrls: [
      {
        name: 'muhammad_ali_portfolio.zip',
        url: '#',
        size: '4.2 MB'
      }
    ],
    status: 'graded',
    marks: 95,
    feedback: 'Excellent semantic structure and clean styling! Great use of flexbox properties and accessible image attributes. Keep up the high standard.',
    submittedAt: '2026-09-20T14:30:00Z',
    gradedAt: '2026-09-22T10:00:00Z',
    gradedBy: 'inst_1'
  },
  {
    submissionId: 'sub_2',
    assignmentId: 'assign_vid_1',
    studentId: 'student_2',
    courseId: 'course_video_editing',
    textAnswer: 'Here is my practice editing reel. I timed the transitions to the music beat and color corrected the outdoor shots.',
    fileUrls: [
      {
        name: 'ayesha_khan_sample_reel.mp4',
        url: '#',
        size: '48 MB'
      }
    ],
    status: 'under_review',
    submittedAt: '2026-09-23T18:00:00Z'
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    announcementId: 'ann_1',
    title: 'Admissions Open for Autumn Batch 2026 at Zohaib Tech Rise LMS',
    content: 'Zohaib Tech Rise LMS is pleased to announce new seats across Web Development, Python AI, and Multimedia tracks. All enrolled students can access 24/7 video learning, practical assignments, and mentorship.',
    audience: 'all',
    publishedAt: '2026-09-01T08:00:00Z',
    createdBy: 'admin_1',
    authorName: 'Zohaib Ali',
    status: 'published'
  }
];

export const initialNotifications: Notification[] = [
  {
    notificationId: 'notif_1',
    userId: 'student_1',
    title: 'Certificate of Completion Issued!',
    message: 'Congratulations! You have completed all requirements for Web Development with HTML, CSS & JavaScript at Zohaib Tech Rise LMS. Your official certificate is ready.',
    type: 'certificate',
    read: false,
    link: '/student/certificates',
    createdAt: '2026-09-25T14:35:00Z'
  }
];
