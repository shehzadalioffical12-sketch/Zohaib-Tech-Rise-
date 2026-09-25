import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Course,
  CourseCategory,
  Enrollment,
  Certificate,
  Notification,
  Announcement,
  SiteSettings,
  Assignment,
  Quiz,
  AssignmentSubmission
} from '../types/lms';
import { StorageService } from '../services/storageService';
import { useAuth } from './AuthContext';

export interface RouteState {
  path: string;
  params?: Record<string, string>;
}

interface LmsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  courses: Course[];
  categories: CourseCategory[];
  enrollments: Enrollment[];
  certificates: Certificate[];
  notifications: Notification[];
  announcements: Announcement[];
  assignments: Assignment[];
  quizzes: Quiz[];
  submissions: AssignmentSubmission[];
  refreshData: () => void;
  // Navigation
  route: RouteState;
  navigate: (path: string, params?: Record<string, string>) => void;
  // Actions
  enrollInCourse: (courseId: string) => { success: boolean; message: string };
  markLessonDone: (courseId: string, lessonId: string) => { completed: boolean; courseCompleted: boolean };
  unreadNotificationsCount: number;
}

const LmsContext = createContext<LmsContextType | undefined>(undefined);

export const LmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [courses, setCourses] = useState<Course[]>(StorageService.getCourses());
  const [categories, setCategories] = useState<CourseCategory[]>(StorageService.getCategories());
  const [enrollments, setEnrollments] = useState<Enrollment[]>(StorageService.getEnrollments());
  const [certificates, setCertificates] = useState<Certificate[]>(StorageService.getCertificates());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>(StorageService.getAnnouncements());
  const [assignments, setAssignments] = useState<Assignment[]>(StorageService.getAssignments());
  const [quizzes, setQuizzes] = useState<Quiz[]>(StorageService.getQuizzes());
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(StorageService.getSubmissions());

  const [route, setRoute] = useState<RouteState>({ path: '/' });

  const refreshData = () => {
    setSettings(StorageService.getSettings());
    setCourses(StorageService.getCourses());
    setCategories(StorageService.getCategories());
    setEnrollments(StorageService.getEnrollments());
    setCertificates(StorageService.getCertificates());
    setAnnouncements(StorageService.getAnnouncements());
    setAssignments(StorageService.getAssignments());
    setQuizzes(StorageService.getQuizzes());
    setSubmissions(StorageService.getSubmissions());
    if (currentUser) {
      setNotifications(StorageService.getNotifications(currentUser.uid));
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  const navigate = (path: string, params?: Record<string, string>) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setRoute({ path, params });
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updated = StorageService.updateSettings(newSettings);
    setSettings(updated);
  };

  const enrollInCourse = (courseId: string) => {
    if (!currentUser) {
      navigate('/login');
      return { success: false, message: 'Please sign in to enroll in this course.' };
    }
    const res = StorageService.enrollStudent(currentUser.uid, courseId);
    refreshData();
    return res;
  };

  const markLessonDone = (courseId: string, lessonId: string) => {
    if (!currentUser) return { completed: false, courseCompleted: false };
    const res = StorageService.markLessonComplete(currentUser.uid, courseId, lessonId);
    refreshData();
    return res;
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <LmsContext.Provider
      value={{
        settings,
        updateSettings,
        courses,
        categories,
        enrollments,
        certificates,
        notifications,
        announcements,
        assignments,
        quizzes,
        submissions,
        refreshData,
        route,
        navigate,
        enrollInCourse,
        markLessonDone,
        unreadNotificationsCount
      }}
    >
      {children}
    </LmsContext.Provider>
  );
};

export const useLms = () => {
  const context = useContext(LmsContext);
  if (!context) {
    throw new Error('useLms must be used within an LmsProvider');
  }
  return context;
};
