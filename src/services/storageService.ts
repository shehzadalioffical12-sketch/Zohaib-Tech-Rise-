import {
  User,
  CourseCategory,
  Course,
  Module,
  Enrollment,
  LessonProgress,
  Quiz,
  QuizAttempt,
  Assignment,
  AssignmentSubmission,
  Certificate,
  CertificateEditLog,
  Notification,
  Announcement,
  SiteSettings,
  Lesson
} from '../types/lms';
import {
  initialSiteSettings,
  initialUsers,
  initialCategories,
  initialCourses,
  initialModules,
  initialQuizzes,
  initialAssignments,
  initialEnrollments,
  initialLessonProgress,
  initialCertificates,
  initialAssignmentSubmissions,
  initialAnnouncements,
  initialNotifications
} from '../data/initialData';
import { hashPassword, isHashedPassword } from './cryptoUtils';

const STORAGE_KEYS = {
  USERS: 'ztr_lms_users',
  CATEGORIES: 'ztr_lms_categories',
  COURSES: 'ztr_lms_courses',
  MODULES: 'ztr_lms_modules',
  ENROLLMENTS: 'ztr_lms_enrollments',
  LESSON_PROGRESS: 'ztr_lms_lesson_progress',
  QUIZZES: 'ztr_lms_quizzes',
  QUIZ_ATTEMPTS: 'ztr_lms_quiz_attempts',
  ASSIGNMENTS: 'ztr_lms_assignments',
  ASSIGNMENT_SUBMISSIONS: 'ztr_lms_assignment_submissions',
  CERTIFICATES: 'ztr_lms_certificates',
  ANNOUNCEMENTS: 'ztr_lms_announcements',
  NOTIFICATIONS: 'ztr_lms_notifications',
  SETTINGS: 'ztr_lms_settings',
  ADMIN_AUTH: 'ztr_lms_admin_auth'
};

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save to localStorage (${key}):`, err);
  }
}

export class StorageService {
  // --- SETTINGS & ADMIN AUTH ---
  static getSettings(): SiteSettings {
    return getFromStorage<SiteSettings>(STORAGE_KEYS.SETTINGS, initialSiteSettings);
  }

  static updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    saveToStorage(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  static getAdminPasswordHash(): string {
    const settings = this.getSettings();
    if (!settings.adminPasswordHash) {
      // Default initial secure salted hash
      const defaultHash = hashPassword('Admin@ZTR2026');
      this.updateSettings({ adminPasswordHash: defaultHash });
      return defaultHash;
    }
    // If an existing entry was stored in plain text, migrate it immediately to a salted hash
    if (!isHashedPassword(settings.adminPasswordHash)) {
      const migratedHash = hashPassword(settings.adminPasswordHash);
      this.updateSettings({ adminPasswordHash: migratedHash });
      return migratedHash;
    }
    return settings.adminPasswordHash;
  }

  static verifyAdminPassword(password: string): boolean {
    if (!password) return false;
    const currentHash = this.getAdminPasswordHash();
    const inputHash = hashPassword(password);
    return currentHash === inputHash;
  }

  static updateAdminPassword(newPassword: string): boolean {
    if (!newPassword || newPassword.length < 6) return false;
    // Compute secure cryptographic hash. Plain text is NEVER stored.
    const secureHash = hashPassword(newPassword);
    this.updateSettings({ adminPasswordHash: secureHash });
    return true;
  }

  // --- USERS ---
  static getUsers(): User[] {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, initialUsers);
    let changed = false;
    users.forEach((u) => {
      if ((u.uid === 'admin_1' || u.uid === 'inst_1') && (!u.profileImage || u.profileImage.includes('unsplash'))) {
        u.profileImage = '/assets/admin_zohaib.jpg';
        changed = true;
      }
      if (u.uid === 'student_2' && (!u.profileImage || u.profileImage.includes('unsplash'))) {
        u.profileImage = '/assets/student_ayesha.jpg';
        changed = true;
      }
    });
    if (changed) {
      saveToStorage(STORAGE_KEYS.USERS, users);
    }
    return users;
  }

  static updateUserProfileImage(uid: string, profileImage?: string): User | undefined {
    const users = this.getUsers();
    const user = users.find((u) => u.uid === uid);
    if (user) {
      user.profileImage = profileImage;
      user.updatedAt = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.USERS, users);
      return user;
    }
    return undefined;
  }

  static getUserById(uid: string): User | undefined {
    return this.getUsers().find((u) => u.uid === uid);
  }

  static getUserByEmail(email: string): User | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  static saveUser(user: User): User {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.uid === user.uid);
    if (index >= 0) {
      users[index] = { ...users[index], ...user, updatedAt: new Date().toISOString() };
    } else {
      users.push(user);
    }
    saveToStorage(STORAGE_KEYS.USERS, users);
    return user;
  }

  static updateUserRole(uid: string, role: User['role']): void {
    const users = this.getUsers();
    const user = users.find((u) => u.uid === uid);
    if (user) {
      user.role = role;
      user.updatedAt = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.USERS, users);
    }
  }

  static toggleUserStatus(uid: string): void {
    const users = this.getUsers();
    const user = users.find((u) => u.uid === uid);
    if (user) {
      user.accountStatus = user.accountStatus === 'active' ? 'suspended' : 'active';
      user.updatedAt = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.USERS, users);
    }
  }

  // --- CATEGORIES ---
  static getCategories(): CourseCategory[] {
    return getFromStorage<CourseCategory[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
  }

  static saveCategory(category: CourseCategory): void {
    const cats = this.getCategories();
    const idx = cats.findIndex((c) => c.categoryId === category.categoryId);
    if (idx >= 0) {
      cats[idx] = category;
    } else {
      cats.push(category);
    }
    saveToStorage(STORAGE_KEYS.CATEGORIES, cats);
  }

  static deleteCategory(categoryId: string): void {
    const cats = this.getCategories().filter((c) => c.categoryId !== categoryId);
    saveToStorage(STORAGE_KEYS.CATEGORIES, cats);
  }

  // --- COURSES ---
  static getCourses(): Course[] {
    return getFromStorage<Course[]>(STORAGE_KEYS.COURSES, initialCourses);
  }

  static getCourseById(courseId: string): Course | undefined {
    return this.getCourses().find((c) => c.courseId === courseId);
  }

  static getCourseBySlug(slug: string): Course | undefined {
    return this.getCourses().find((c) => c.slug === slug);
  }

  static saveCourse(course: Course): Course {
    const courses = this.getCourses();
    const idx = courses.findIndex((c) => c.courseId === course.courseId);
    if (idx >= 0) {
      courses[idx] = { ...courses[idx], ...course, updatedAt: new Date().toISOString() };
    } else {
      courses.unshift(course);
    }
    saveToStorage(STORAGE_KEYS.COURSES, courses);
    return course;
  }

  static deleteCourse(courseId: string): void {
    const courses = this.getCourses().filter((c) => c.courseId !== courseId);
    saveToStorage(STORAGE_KEYS.COURSES, courses);
  }

  static updateCourseThumbnail(courseId: string, thumbnail: string): Course | undefined {
    const courses = this.getCourses();
    const course = courses.find((c) => c.courseId === courseId);
    if (course) {
      course.thumbnail = thumbnail;
      course.updatedAt = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.COURSES, courses);
      return course;
    }
    return undefined;
  }

  // --- MODULES & LESSONS ---
  static getModules(courseId?: string): Module[] {
    const all = getFromStorage<Module[]>(STORAGE_KEYS.MODULES, initialModules);
    if (courseId) {
      return all.filter((m) => m.courseId === courseId).sort((a, b) => a.order - b.order);
    }
    return all;
  }

  static saveModule(mod: Module): void {
    const modules = this.getModules();
    const idx = modules.findIndex((m) => m.moduleId === mod.moduleId);
    if (idx >= 0) {
      modules[idx] = mod;
    } else {
      modules.push(mod);
    }
    saveToStorage(STORAGE_KEYS.MODULES, modules);
  }

  static deleteModule(moduleId: string): void {
    const modules = this.getModules().filter((m) => m.moduleId !== moduleId);
    saveToStorage(STORAGE_KEYS.MODULES, modules);
  }

  static saveLesson(courseId: string, moduleId: string, lesson: Lesson): void {
    const modules = this.getModules();
    const targetMod = modules.find((m) => m.moduleId === moduleId && m.courseId === courseId);
    if (targetMod) {
      const idx = targetMod.lessons.findIndex((l) => l.lessonId === lesson.lessonId);
      if (idx >= 0) {
        targetMod.lessons[idx] = lesson;
      } else {
        targetMod.lessons.push(lesson);
      }
      saveToStorage(STORAGE_KEYS.MODULES, modules);
    }
  }

  static deleteLesson(courseId: string, moduleId: string, lessonId: string): void {
    const modules = this.getModules();
    const targetMod = modules.find((m) => m.moduleId === moduleId && m.courseId === courseId);
    if (targetMod) {
      targetMod.lessons = targetMod.lessons.filter((l) => l.lessonId !== lessonId);
      saveToStorage(STORAGE_KEYS.MODULES, modules);
    }
  }

  // --- ENROLLMENTS & COMPLETION ---
  static getEnrollments(studentId?: string): Enrollment[] {
    const all = getFromStorage<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, initialEnrollments);
    if (studentId) {
      return all.filter((e) => e.studentId === studentId);
    }
    return all;
  }

  static getEnrollment(studentId: string, courseId: string): Enrollment | undefined {
    return this.getEnrollments().find((e) => e.studentId === studentId && e.courseId === courseId);
  }

  static enrollStudent(studentId: string, courseId: string): { success: boolean; message: string; enrollment?: Enrollment } {
    const existing = this.getEnrollment(studentId, courseId);
    if (existing) {
      return { success: false, message: 'Student is already enrolled in this course.' };
    }

    const newEnrollment: Enrollment = {
      enrollmentId: `enr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId,
      courseId,
      enrollmentDate: new Date().toISOString(),
      status: 'active',
      progressPercentage: 0,
      completedLessonsCount: 0
    };

    const all = this.getEnrollments();
    all.push(newEnrollment);
    saveToStorage(STORAGE_KEYS.ENROLLMENTS, all);

    const course = this.getCourseById(courseId);
    if (course) {
      this.saveCourse({ ...course, enrolledCount: (course.enrolledCount || 0) + 1 });
    }

    this.addNotification({
      notificationId: `notif_${Date.now()}`,
      userId: studentId,
      title: 'Enrolled in ' + (course?.title || 'Course'),
      message: 'You have enrolled successfully in Zohaib Tech Rise LMS! Start watching lessons and preparing for quizzes.',
      type: 'enrollment',
      read: false,
      link: `/student/learn/${courseId}`,
      createdAt: new Date().toISOString()
    });

    return { success: true, message: 'Enrollment successful!', enrollment: newEnrollment };
  }

  // --- LESSON PROGRESS ---
  static getLessonProgressList(studentId?: string, courseId?: string): LessonProgress[] {
    let all = getFromStorage<LessonProgress[]>(STORAGE_KEYS.LESSON_PROGRESS, initialLessonProgress);
    if (studentId) all = all.filter((p) => p.studentId === studentId);
    if (courseId) all = all.filter((p) => p.courseId === courseId);
    return all;
  }

  static markLessonComplete(studentId: string, courseId: string, lessonId: string): { completed: boolean; courseCompleted: boolean } {
    const list = this.getLessonProgressList();
    const idx = list.findIndex((p) => p.studentId === studentId && p.courseId === courseId && p.lessonId === lessonId);
    const now = new Date().toISOString();

    if (idx >= 0) {
      list[idx].completionStatus = 'completed';
      list[idx].completedAt = list[idx].completedAt || now;
      list[idx].updatedAt = now;
    } else {
      list.push({
        progressId: `lp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        studentId,
        courseId,
        lessonId,
        lastPlaybackPosition: 0,
        completionStatus: 'completed',
        completedAt: now,
        updatedAt: now
      });
    }
    saveToStorage(STORAGE_KEYS.LESSON_PROGRESS, list);
    return this.recalculateCourseProgress(studentId, courseId);
  }

  static recalculateCourseProgress(studentId: string, courseId: string): { completed: boolean; courseCompleted: boolean } {
    const modules = this.getModules(courseId);
    let totalLessons = 0;
    const lessonIds: string[] = [];

    modules.forEach((m) => {
      m.lessons.forEach((l) => {
        totalLessons++;
        lessonIds.push(l.lessonId);
      });
    });

    const progressList = this.getLessonProgressList(studentId, courseId);
    const completedLessons = progressList.filter((p) => p.completionStatus === 'completed' && lessonIds.includes(p.lessonId)).length;
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const enrollments = this.getEnrollments();
    const enrIdx = enrollments.findIndex((e) => e.studentId === studentId && e.courseId === courseId);
    let isCourseCompleted = false;

    if (enrIdx >= 0) {
      enrollments[enrIdx].completedLessonsCount = completedLessons;
      enrollments[enrIdx].progressPercentage = progressPercent;

      if (progressPercent >= 100 && enrollments[enrIdx].status !== 'completed') {
        enrollments[enrIdx].status = 'completed';
        enrollments[enrIdx].completionDate = new Date().toISOString();
        isCourseCompleted = true;

        this.issueCertificateIfEligible(studentId, courseId);
      }
      saveToStorage(STORAGE_KEYS.ENROLLMENTS, enrollments);
    }

    return { completed: true, courseCompleted: isCourseCompleted };
  }

  // --- CERTIFICATE MANAGEMENT (With Edit History Audit Trail) ---
  static getCertificates(studentId?: string): Certificate[] {
    const all = getFromStorage<Certificate[]>(STORAGE_KEYS.CERTIFICATES, initialCertificates);
    if (studentId) {
      return all.filter((c) => c.studentId === studentId);
    }
    return all;
  }

  static getCertificateByIdOrCode(codeOrId: string): Certificate | undefined {
    const clean = codeOrId.trim().toUpperCase();
    return this.getCertificates().find(
      (c) => c.certificateId.toUpperCase() === clean || c.verificationCode.toUpperCase() === clean
    );
  }

  static issueCertificateIfEligible(studentId: string, courseId: string): Certificate | null {
    const existing = this.getCertificates().find((c) => c.studentId === studentId && c.courseId === courseId);
    if (existing) return existing;

    const course = this.getCourseById(courseId);
    const user = this.getUserById(studentId);
    if (!course || !user || !course.certificateEnabled) return null;

    const instructor = course.instructorIds?.length ? this.getUserById(course.instructorIds[0]) : null;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const categoryPrefix = course.title.includes('Web') ? 'WD' : course.title.includes('Video') ? 'VE' : 'ZTR';
    const year = new Date().getFullYear();
    const verificationCode = `ZTR-${year}-${categoryPrefix}-${randomNum}`;
    const todayFormatted = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

    const newCert: Certificate = {
      certificateId: `cert_${Date.now()}`,
      studentId: user.uid,
      studentName: user.fullName,
      studentEmail: user.email,
      courseId: course.courseId,
      courseTitle: course.title,
      instructorName: instructor?.fullName || 'Zohaib Ali',
      authorizedSignatory: 'Admin Team Zohaib Tech Rise LMS',
      issueDate: todayFormatted,
      completionDate: todayFormatted,
      verificationCode,
      verificationUrl: `/certificate-verification?id=${verificationCode}`,
      status: 'valid',
      completionScore: 95,
      editHistory: []
    };

    const certs = this.getCertificates();
    certs.unshift(newCert);
    saveToStorage(STORAGE_KEYS.CERTIFICATES, certs);

    this.addNotification({
      notificationId: `notif_cert_${Date.now()}`,
      userId: studentId,
      title: 'Official Certificate of Completion Issued!',
      message: `Congratulations! You completed ${course.title} at Zohaib Tech Rise LMS. Your certificate is verified and ready.`,
      type: 'certificate',
      read: false,
      link: '/student/certificates',
      createdAt: new Date().toISOString()
    });

    return newCert;
  }

  /**
   * Update student certificate information with full audit trail logging
   */
  static updateCertificate(
    certificateId: string,
    updatedFields: Partial<Certificate>,
    editorAdmin: { uid: string; fullName: string },
    reason?: string
  ): { success: boolean; message: string; certificate?: Certificate } {
    const certs = this.getCertificates();
    const idx = certs.findIndex((c) => c.certificateId === certificateId);
    if (idx === -1) {
      return { success: false, message: 'Certificate record not found.' };
    }

    const currentCert = certs[idx];

    // Prevent duplicate verification code if changed
    if (updatedFields.verificationCode && updatedFields.verificationCode !== currentCert.verificationCode) {
      const isDuplicate = certs.some(
        (c) => c.certificateId !== certificateId && c.verificationCode.toUpperCase() === updatedFields.verificationCode?.trim().toUpperCase()
      );
      if (isDuplicate) {
        return { success: false, message: 'This Certificate ID/Code is already assigned to another certificate.' };
      }
    }

    // Build changes diff for audit history
    const changes: Record<string, { oldVal: any; newVal: any }> = {};
    const trackedKeys: (keyof Certificate)[] = [
      'studentName',
      'studentEmail',
      'courseTitle',
      'completionDate',
      'issueDate',
      'verificationCode',
      'completionScore',
      'instructorName',
      'authorizedSignatory',
      'status'
    ];

    trackedKeys.forEach((key) => {
      if (updatedFields[key] !== undefined && updatedFields[key] !== currentCert[key]) {
        changes[key] = {
          oldVal: currentCert[key],
          newVal: updatedFields[key]
        };
      }
    });

    const editLog: CertificateEditLog = {
      editedBy: editorAdmin.uid,
      editedByName: editorAdmin.fullName,
      editedAt: new Date().toISOString(),
      changes,
      reason: reason || 'Administrative correction/update'
    };

    const updatedCert: Certificate = {
      ...currentCert,
      ...updatedFields,
      editHistory: [...(currentCert.editHistory || []), editLog]
    };

    certs[idx] = updatedCert;
    saveToStorage(STORAGE_KEYS.CERTIFICATES, certs);

    // If verificationCode changed, update verification URL
    if (updatedCert.verificationCode) {
      updatedCert.verificationUrl = `/certificate-verification?id=${updatedCert.verificationCode}`;
    }

    // Send notification to student
    this.addNotification({
      notificationId: `notif_${Date.now()}`,
      userId: updatedCert.studentId,
      title: 'Certificate Information Updated',
      message: `Your certificate for ${updatedCert.courseTitle} was updated by administration. Check your certificates tab.`,
      type: 'certificate',
      read: false,
      link: '/student/certificates',
      createdAt: new Date().toISOString()
    });

    return { success: true, message: 'Certificate updated and audit trail logged successfully.', certificate: updatedCert };
  }

  static revokeCertificate(certificateId: string, editorAdmin: { uid: string; fullName: string }, reason?: string): void {
    this.updateCertificate(certificateId, { status: 'revoked' }, editorAdmin, reason || 'Certificate revoked by administrator');
  }

  static deleteCertificate(certificateId: string): void {
    const certs = this.getCertificates().filter((c) => c.certificateId !== certificateId);
    saveToStorage(STORAGE_KEYS.CERTIFICATES, certs);
  }

  // --- QUIZ MANAGEMENT ---
  static getQuizzes(courseId?: string): Quiz[] {
    const all = getFromStorage<Quiz[]>(STORAGE_KEYS.QUIZZES, initialQuizzes);
    if (courseId) {
      return all.filter((q) => q.courseId === courseId);
    }
    return all;
  }

  static getQuizById(quizId: string): Quiz | undefined {
    return this.getQuizzes().find((q) => q.quizId === quizId);
  }

  static saveQuiz(quiz: Quiz, notifyAssigned: boolean = false): Quiz {
    const all = this.getQuizzes();
    const idx = all.findIndex((q) => q.quizId === quiz.quizId);
    if (idx >= 0) {
      all[idx] = quiz;
    } else {
      all.unshift(quiz);
    }
    saveToStorage(STORAGE_KEYS.QUIZZES, all);

    if (notifyAssigned && quiz.status === 'published') {
      const studentIds = quiz.availability === 'selected_students' && quiz.assignedStudentIds?.length
        ? quiz.assignedStudentIds
        : this.getEnrollments().filter((e) => e.courseId === quiz.courseId).map((e) => e.studentId);

      studentIds.forEach((sid) => {
        this.addNotification({
          notificationId: `notif_q_${Date.now()}_${sid}`,
          userId: sid,
          title: `New Quiz Assigned: ${quiz.title}`,
          message: `A new quiz has been published in your course. Deadline: ${quiz.deadline ? new Date(quiz.deadline).toLocaleDateString() : 'Self-paced'}.`,
          type: 'quiz',
          read: false,
          link: `/student/quiz?id=${quiz.quizId}`,
          createdAt: new Date().toISOString()
        });
      });
    }

    return quiz;
  }

  static deleteQuiz(quizId: string): void {
    const all = this.getQuizzes().filter((q) => q.quizId !== quizId);
    saveToStorage(STORAGE_KEYS.QUIZZES, all);
  }

  static getQuizAttempts(studentId?: string, quizId?: string): QuizAttempt[] {
    let all = getFromStorage<QuizAttempt[]>(STORAGE_KEYS.QUIZ_ATTEMPTS, []);
    if (studentId) all = all.filter((a) => a.studentId === studentId);
    if (quizId) all = all.filter((a) => a.quizId === quizId);
    return all;
  }

  static submitQuizAttempt(
    quizId: string,
    studentId: string,
    answers: Record<string, string | string[]>
  ): QuizAttempt {
    const quiz = this.getQuizById(quizId);
    if (!quiz) throw new Error('Quiz not found');

    let totalMarks = 0;
    let earnedMarks = 0;
    let hasShortAnswer = false;

    quiz.questions.forEach((q) => {
      totalMarks += q.marks;
      const given = answers[q.questionId];

      if (q.questionType === 'short_answer') {
        hasShortAnswer = true;
      } else if (Array.isArray(q.correctAnswer)) {
        if (Array.isArray(given) && q.correctAnswer.sort().join(',') === given.sort().join(',')) {
          earnedMarks += q.marks;
        }
      } else {
        if (typeof given === 'string' && given.trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
          earnedMarks += q.marks;
        }
      }
    });

    const percentage = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;
    const passed = percentage >= quiz.passingPercentage;

    const attempt: QuizAttempt = {
      attemptId: `att_${Date.now()}`,
      quizId,
      studentId,
      answers,
      score: earnedMarks,
      totalMarks,
      percentage,
      status: hasShortAnswer ? 'pending_review' : passed ? 'passed' : 'failed',
      startedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      submittedAt: new Date().toISOString(),
      gradedAt: hasShortAnswer ? undefined : new Date().toISOString()
    };

    const all = this.getQuizAttempts();
    all.unshift(attempt);
    saveToStorage(STORAGE_KEYS.QUIZ_ATTEMPTS, all);

    this.addNotification({
      notificationId: `notif_${Date.now()}`,
      userId: studentId,
      title: `Quiz Submitted: ${quiz.title}`,
      message: hasShortAnswer
        ? 'Your answers have been submitted and are pending instructor review.'
        : `You scored ${percentage}% (${earnedMarks}/${totalMarks}). Status: ${passed ? 'PASSED' : 'FAILED'}.`,
      type: 'quiz',
      read: false,
      link: '/student/quizzes',
      createdAt: new Date().toISOString()
    });

    return attempt;
  }

  static gradeQuizAttempt(attemptId: string, manualScores: Record<string, number>, feedback: string): void {
    const attempts = this.getQuizAttempts();
    const att = attempts.find((a) => a.attemptId === attemptId);
    if (!att) return;

    const quiz = this.getQuizById(att.quizId);
    if (!quiz) return;

    let earned = 0;
    quiz.questions.forEach((q) => {
      if (manualScores[q.questionId] !== undefined) {
        earned += Number(manualScores[q.questionId]);
      } else {
        const given = att.answers[q.questionId];
        if (typeof given === 'string' && given.trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
          earned += q.marks;
        }
      }
    });

    att.score = earned;
    att.percentage = Math.round((earned / att.totalMarks) * 100);
    att.status = att.percentage >= quiz.passingPercentage ? 'passed' : 'failed';
    att.feedback = feedback;
    att.gradedAt = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.QUIZ_ATTEMPTS, attempts);

    this.addNotification({
      notificationId: `notif_${Date.now()}`,
      userId: att.studentId,
      title: `Quiz Graded: ${quiz.title}`,
      message: `Your quiz has been reviewed. Final score: ${att.percentage}% (${att.status.toUpperCase()}). Feedback: ${feedback}`,
      type: 'quiz',
      read: false,
      link: '/student/quizzes',
      createdAt: new Date().toISOString()
    });
  }

  // --- ASSIGNMENT MANAGEMENT ---
  static getAssignments(courseId?: string): Assignment[] {
    const all = getFromStorage<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, initialAssignments);
    if (courseId) {
      return all.filter((a) => a.courseId === courseId);
    }
    return all;
  }

  static getAssignmentById(assignmentId: string): Assignment | undefined {
    return this.getAssignments().find((a) => a.assignmentId === assignmentId);
  }

  static saveAssignment(assignment: Assignment, notifyAssigned: boolean = false): Assignment {
    const all = this.getAssignments();
    const idx = all.findIndex((a) => a.assignmentId === assignment.assignmentId);
    if (idx >= 0) {
      all[idx] = assignment;
    } else {
      all.unshift(assignment);
    }
    saveToStorage(STORAGE_KEYS.ASSIGNMENTS, all);

    if (notifyAssigned && assignment.status === 'published') {
      const studentIds = assignment.assignedType === 'selected_students' && assignment.assignedStudentIds?.length
        ? assignment.assignedStudentIds
        : this.getEnrollments().filter((e) => e.courseId === assignment.courseId).map((e) => e.studentId);

      studentIds.forEach((sid) => {
        this.addNotification({
          notificationId: `notif_a_${Date.now()}_${sid}`,
          userId: sid,
          title: `New Assignment: ${assignment.title}`,
          message: `A new assignment has been assigned. Due Date: ${new Date(assignment.dueDate).toLocaleDateString()}. Total Marks: ${assignment.maxMarks}.`,
          type: 'assignment',
          read: false,
          link: `/student/assignment?id=${assignment.assignmentId}`,
          createdAt: new Date().toISOString()
        });
      });
    }

    return assignment;
  }

  static deleteAssignment(assignmentId: string): void {
    const all = this.getAssignments().filter((a) => a.assignmentId !== assignmentId);
    saveToStorage(STORAGE_KEYS.ASSIGNMENTS, all);
  }

  static getSubmissions(studentId?: string, assignmentId?: string): AssignmentSubmission[] {
    let all = getFromStorage<AssignmentSubmission[]>(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS, initialAssignmentSubmissions);
    if (studentId) all = all.filter((s) => s.studentId === studentId);
    if (assignmentId) all = all.filter((s) => s.assignmentId === assignmentId);
    return all;
  }

  static submitAssignment(
    assignmentId: string,
    studentId: string,
    courseId: string,
    textAnswer: string,
    fileUrls: { name: string; url: string; size: string }[],
    isDraft: boolean = false
  ): AssignmentSubmission {
    const submissions = this.getSubmissions();
    const existingIdx = submissions.findIndex((s) => s.assignmentId === assignmentId && s.studentId === studentId);

    const submission: AssignmentSubmission = {
      submissionId: existingIdx >= 0 ? submissions[existingIdx].submissionId : `sub_${Date.now()}`,
      assignmentId,
      studentId,
      courseId,
      textAnswer,
      fileUrls,
      status: isDraft ? 'draft' : 'submitted',
      submittedAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      submissions[existingIdx] = submission;
    } else {
      submissions.unshift(submission);
    }
    saveToStorage(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS, submissions);

    if (!isDraft) {
      const course = this.getCourseById(courseId);
      const instructorId = course?.instructorIds?.[0] || 'inst_1';
      this.addNotification({
        notificationId: `notif_${Date.now()}`,
        userId: instructorId,
        title: 'New Student Submission to Grade',
        message: `A student submitted an assignment for review in ${course?.title || 'course'}.`,
        type: 'assignment',
        read: false,
        link: '/instructor/submissions',
        createdAt: new Date().toISOString()
      });
    }

    return submission;
  }

  static gradeSubmission(submissionId: string, marks: number, feedback: string, gradedBy: string): void {
    const submissions = this.getSubmissions();
    const sub = submissions.find((s) => s.submissionId === submissionId);
    if (sub) {
      sub.marks = marks;
      sub.feedback = feedback;
      sub.status = 'graded';
      sub.gradedAt = new Date().toISOString();
      sub.gradedBy = gradedBy;
      saveToStorage(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS, submissions);

      this.addNotification({
        notificationId: `notif_${Date.now()}`,
        userId: sub.studentId,
        title: 'Assignment Graded!',
        message: `Your assignment submission received ${marks} marks. Feedback: "${feedback}".`,
        type: 'assignment',
        read: false,
        link: '/student/assignments',
        createdAt: new Date().toISOString()
      });
    }
  }

  // --- ANNOUNCEMENTS ---
  static getAnnouncements(): Announcement[] {
    return getFromStorage<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
  }

  static addAnnouncement(ann: Announcement): void {
    const all = this.getAnnouncements();
    all.unshift(ann);
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, all);
  }

  // --- NOTIFICATIONS ---
  static getNotifications(userId?: string): Notification[] {
    const all = getFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    if (userId) {
      return all.filter((n) => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return all;
  }

  static addNotification(notif: Notification): void {
    const all = this.getNotifications();
    all.unshift(notif);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
  }

  // --- DATABASE-DRIVEN PLATFORM STATS ---
  static getPlatformStats() {
    const users = this.getUsers();
    const courses = this.getCourses();
    const enrollments = this.getEnrollments();
    const certificates = this.getCertificates();
    const submissions = this.getSubmissions();
    const quizAttempts = this.getQuizAttempts();

    const studentsCount = users.filter((u) => u.role === 'student').length;
    const instructorsCount = users.filter((u) => u.role === 'instructor').length;
    const publishedCoursesCount = courses.filter((c) => c.status === 'published').length;
    const completedEnrollmentsCount = enrollments.filter((e) => e.status === 'completed').length;
    const pendingReviewsCount = submissions.filter((s) => s.status === 'submitted' || s.status === 'under_review').length;
    const pendingQuizCount = quizAttempts.filter((q) => q.status === 'pending_review').length;

    return {
      totalStudents: studentsCount,
      totalInstructors: instructorsCount,
      totalCourses: courses.length,
      publishedCourses: publishedCoursesCount,
      totalEnrollments: enrollments.length,
      completedCourses: completedEnrollmentsCount,
      certificatesIssued: certificates.filter((c) => c.status === 'valid' || c.status === 'corrected').length,
      totalCertificates: certificates.length,
      pendingReviews: pendingReviewsCount,
      pendingQuizAttempts: pendingQuizCount
    };
  }
}
