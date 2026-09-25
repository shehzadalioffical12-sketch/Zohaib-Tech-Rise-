export type UserRole = 'super_admin' | 'instructor' | 'student';

export interface User {
  uid: string;
  fullName: string;
  email: string;
  profileImage?: string;
  role: UserRole;
  accountStatus: 'active' | 'pending' | 'suspended';
  phone?: string;
  bio?: string;
  qualification?: string;
  headline?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type CourseStatus = 'draft' | 'published' | 'archived';

export interface CourseCategory {
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  iconName?: string;
  order: number;
  status: 'active' | 'inactive';
}

export interface LessonResource {
  id: string;
  title: string;
  fileType: string;
  fileSize: string;
  url: string;
}

export interface Lesson {
  lessonId: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  videoProvider: 'youtube' | 'vimeo' | 'mp4' | 'custom';
  videoUrl: string;
  videoAssetId?: string;
  durationMinutes: number;
  durationFormatted: string; // e.g., "12:45"
  resources: LessonResource[];
  isPreview: boolean;
  order: number;
}

export interface Module {
  moduleId: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
  quizzes?: Quiz[];
  assignments?: Assignment[];
}

export interface Course {
  courseId: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  bannerImage?: string;
  categoryId: string;
  instructorIds: string[];
  level: CourseLevel;
  language: string;
  durationWeeks: number;
  estimatedHours: number;
  totalModules: number;
  totalLessons: number;
  learningOutcomes: string[];
  prerequisites: string[];
  status: CourseStatus;
  certificateEnabled: boolean;
  isFeatured?: boolean;
  rating: number;
  ratingCount: number;
  enrolledCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'dropped';
  progressPercentage: number;
  completedLessonsCount: number;
  completionDate?: string;
}

export interface LessonProgress {
  progressId: string;
  studentId: string;
  courseId: string;
  lessonId: string;
  lastPlaybackPosition: number; // in seconds
  completionStatus: 'in_progress' | 'completed';
  completedAt?: string;
  updatedAt: string;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'multiple_select' | 'short_answer';

export interface QuizQuestion {
  questionId: string;
  quizId: string;
  questionType: QuestionType;
  questionText: string;
  options: string[];
  correctAnswer: string | string[]; // string for MCQ/TF/Short answer, array for multi select
  marks: number;
  explanation?: string;
  order: number;
}

export interface Quiz {
  quizId: string;
  courseId: string;
  moduleId: string;
  lessonId?: string;
  title: string;
  description?: string;
  instructions: string;
  startDate?: string;
  deadline?: string;
  timeLimitMinutes: number;
  passingPercentage: number;
  maxAttempts: number;
  totalMarks?: number;
  randomizeQuestions?: boolean;
  randomizeAnswers?: boolean;
  availability?: 'all_enrolled' | 'selected_students';
  assignedStudentIds?: string[];
  status: 'draft' | 'published';
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizAttempt {
  attemptId: string;
  quizId: string;
  studentId: string;
  answers: Record<string, string | string[]>;
  score: number;
  totalMarks: number;
  percentage: number;
  status: 'in_progress' | 'passed' | 'failed' | 'pending_review';
  feedback?: string;
  manualScores?: Record<string, number>;
  startedAt: string;
  submittedAt?: string;
  gradedAt?: string;
}

export interface Assignment {
  assignmentId: string;
  courseId: string;
  moduleId: string;
  lessonId?: string;
  title: string;
  instructions: string;
  maxMarks: number;
  passingMarks: number;
  startDate?: string;
  dueDate: string;
  allowedFileTypes: string[]; // e.g. ['.pdf', '.zip', '.docx', '.png', '.mp4']
  maxFileSizeMb: number;
  submissionType?: 'file' | 'text' | 'both';
  lateSubmissionPolicy?: 'allow' | 'disallow' | 'deduct_points';
  assignedType?: 'all_enrolled' | 'selected_students';
  assignedStudentIds?: string[];
  status: 'draft' | 'published';
  attachments?: { title: string; url: string; size: string }[];
  createdAt: string;
}

export type SubmissionStatus =
  | 'assigned'
  | 'not_started'
  | 'draft'
  | 'submitted'
  | 'late'
  | 'under_review'
  | 'graded'
  | 'resubmission_required';

export interface AssignmentSubmission {
  submissionId: string;
  assignmentId: string;
  studentId: string;
  courseId: string;
  textAnswer?: string;
  fileUrls: { name: string; url: string; size: string }[];
  status: SubmissionStatus;
  marks?: number;
  feedback?: string;
  submittedAt: string;
  gradedAt?: string;
  gradedBy?: string;
}

export interface CertificateEditLog {
  editedBy: string;
  editedByName: string;
  editedAt: string;
  changes: Record<string, { oldVal: any; newVal: any }>;
  reason?: string;
}

export interface Certificate {
  certificateId: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  authorizedSignatory?: string;
  issueDate: string;
  completionDate?: string;
  verificationCode: string;
  verificationUrl: string;
  status: 'valid' | 'revoked' | 'corrected';
  completionScore?: number;
  editHistory?: CertificateEditLog[];
}

export interface Notification {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: 'enrollment' | 'quiz' | 'assignment' | 'certificate' | 'announcement' | 'system';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Announcement {
  announcementId: string;
  title: string;
  content: string;
  audience: 'all' | 'students' | 'instructors' | 'course';
  courseId?: string;
  publishedAt: string;
  createdBy: string;
  authorName: string;
  status: 'published' | 'draft';
}

export interface SiteSettings {
  settingId: string;
  lmsName: string;
  tagline: string;
  institutionName: string;
  logoUrl?: string;
  primaryColor: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  videoProvider: 'custom' | 'youtube' | 'vimeo' | 'bunny' | 'mux';
  videoWatchedThresholdPercent: number; // e.g. 85%
  certificateSigningInstructor: string;
  certificateSigningAdmin: string;
  enableStudentRegistration: boolean;
  firebaseConfigured: boolean;
  adminPasswordHash?: string;
}
