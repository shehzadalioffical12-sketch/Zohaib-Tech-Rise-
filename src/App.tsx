import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LmsProvider, useLms } from './context/LmsContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Public Pages
import { HomePage } from './components/public/HomePage';
import { CourseCatalogPage } from './components/public/CourseCatalogPage';
import { CourseDetailPage } from './components/public/CourseDetailPage';
import { AboutPage } from './components/public/AboutPage';
import { ContactPage } from './components/public/ContactPage';
import { VerifyCertificatePage } from './components/public/VerifyCertificatePage';
import { LoginPage } from './components/public/LoginPage';
import { RegisterPage } from './components/public/RegisterPage';

// Student Portal
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentLearnPage } from './components/student/StudentLearnPage';
import { StudentQuizPage } from './components/student/StudentQuizPage';
import { StudentAssignmentPage } from './components/student/StudentAssignmentPage';
import { StudentCertificates } from './components/student/StudentCertificates';

// Instructor Portal
import { InstructorDashboard } from './components/instructor/InstructorDashboard';

// Admin Portal
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminCourseBuilder } from './components/admin/AdminCourseBuilder';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminCertificates } from './components/admin/AdminCertificates';
import { AdminQuizManager } from './components/admin/AdminQuizManager';
import { AdminAssignmentManager } from './components/admin/AdminAssignmentManager';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminLoginPage } from './components/admin/AdminLoginPage';

const AppRouter: React.FC = () => {
  const { route } = useLms();
  const { isSuperAdmin, isInstructor, currentUser } = useAuth();

  const renderContent = () => {
    // Dedicated Admin Login Route
    if (route.path === '/admin/login') {
      return <AdminLoginPage />;
    }

    // Role-based security guard for all Admin pages
    if (route.path.startsWith('/admin') && !isSuperAdmin) {
      return <AdminLoginPage />;
    }

    switch (route.path) {
      case '/':
        return <HomePage />;
      case '/courses':
        return <CourseCatalogPage />;
      case '/courses/detail':
        return <CourseDetailPage />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      case '/certificate-verification':
        return <VerifyCertificatePage />;
      case '/login':
        return <LoginPage />;
      case '/register':
        return <RegisterPage />;

      // Student Portal Routes
      case '/student':
      case '/student/courses':
        return <StudentDashboard />;
      case '/student/learn':
        return <StudentLearnPage />;
      case '/student/quiz':
      case '/student/quizzes':
        return <StudentQuizPage />;
      case '/student/assignment':
      case '/student/assignments':
        return <StudentAssignmentPage />;
      case '/student/certificates':
        return <StudentCertificates />;

      // Instructor Portal Routes
      case '/instructor':
      case '/instructor/courses':
      case '/instructor/submissions':
        return <InstructorDashboard />;

      // Admin Portal Routes (Authenticated Super Admin only)
      case '/admin':
        return <AdminDashboard />;
      case '/admin/courses/create':
      case '/admin/courses/builder':
        return <AdminCourseBuilder />;
      case '/admin/users':
      case '/admin/students':
      case '/admin/instructors':
        return <AdminUsers />;
      case '/admin/certificates':
        return <AdminCertificates />;
      case '/admin/quizzes':
        return <AdminQuizManager />;
      case '/admin/assignments':
        return <AdminAssignmentManager />;
      case '/admin/settings':
        return <AdminSettings />;

      default:
        return <HomePage />;
    }
  };

  // Check if we are in the immersive classroom video view (hide regular header/footer for distraction-free learning)
  const isImmersiveLearn = route.path === '/student/learn';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {!isImmersiveLearn && <Navbar />}
      <main className="flex-1">{renderContent()}</main>
      {!isImmersiveLearn && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LmsProvider>
        <AppRouter />
      </LmsProvider>
    </AuthProvider>
  );
}
