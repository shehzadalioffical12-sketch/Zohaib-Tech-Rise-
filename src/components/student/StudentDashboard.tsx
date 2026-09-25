import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLms } from '../../context/LmsContext';
import { StorageService } from '../../services/storageService';
import {
  BookOpen,
  CheckCircle2,
  Award,
  TrendingUp,
  PlayCircle,
  Clock,
  AlertCircle,
  FileText,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Calendar
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { courses, enrollments, certificates, assignments, quizzes, navigate } = useLms();

  if (!currentUser) return null;

  const myEnrollments = enrollments.filter((e) => e.studentId === currentUser.uid);
  const myCertificates = certificates.filter((c) => c.studentId === currentUser.uid);
  const completedCourses = myEnrollments.filter((e) => e.status === 'completed');

  const myEnrolledCourseIds = myEnrollments.map((e) => e.courseId);

  // Requirement 6: Students should see assigned quizzes in their existing Student Dashboard
  const assignedQuizzes = quizzes.filter((q) => {
    if (q.status !== 'published') return false;
    if (q.availability === 'all_enrolled') {
      return myEnrolledCourseIds.includes(q.courseId);
    }
    return q.assignedStudentIds && q.assignedStudentIds.includes(currentUser.uid);
  });

  // Requirement 7: Students should see assigned assignments in their existing Student Dashboard
  const assignedAssignments = assignments.filter((a) => {
    if (a.status !== 'published') return false;
    if (a.assignedType === 'all_enrolled') {
      return myEnrolledCourseIds.includes(a.courseId);
    }
    return a.assignedStudentIds && a.assignedStudentIds.includes(currentUser.uid);
  });

  const totalProgress = myEnrollments.length
    ? Math.round(myEnrollments.reduce((acc, e) => acc + (e.progressPercentage || 0), 0) / myEnrollments.length)
    : 0;

  // Requirement 4: Display student profile image in existing Student profile/dashboard areas
  const studentAvatar = currentUser.profileImage || '/assets/student_ayesha.jpg';

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header with Student Profile Image */}
        <div className="bg-gradient-to-r from-[#0F2744] via-[#103a6b] to-[#0c1e38] text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative flex-shrink-0">
              <img
                src={studentAvatar}
                alt={currentUser.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-sky-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0F2744] rounded-full"></span>
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-2">
                <span>Student Portal</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-300 font-normal">{currentUser.email}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome, {currentUser.fullName} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Keep learning, keep growing! You're making continuous progress toward your certificates.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/courses')}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all self-start md:self-auto flex items-center gap-1.5"
          >
            <span>Browse More Courses</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Stats Cards matching existing design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolled Courses</span>
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">{myEnrollments.length}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Courses</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">{completedCourses.length}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Certificates Earned</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">{myCertificates.length}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Progress</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">{totalProgress}%</div>
          </div>
        </div>

        {/* Continue Learning & Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: My Courses (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Continue Learning</h2>
              <button
                onClick={() => navigate('/courses')}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                <span>View All Courses</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myEnrollments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800">You haven't enrolled in any courses yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Explore our tech courses in Web Development, Video Editing, and Freelancing and start learning today for free.
                </p>
                <button
                  onClick={() => navigate('/courses')}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold"
                >
                  Explore Course Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myEnrollments.map((enr) => {
                  const course = courses.find((c) => c.courseId === enr.courseId);
                  if (!course) return null;
                  const percent = enr.progressPercentage || 0;

                  return (
                    <div
                      key={enr.enrollmentId}
                      className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-slate-800 backdrop-blur-xs">
                            {course.level}
                          </span>
                        </div>

                        <div>
                          <div className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                            {course.categoryId.replace('cat_', '')}
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{course.title}</h4>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                          <span>{enr.completedLessonsCount || 0} / {course.totalLessons} Lessons</span>
                          <span className="font-semibold text-slate-700">{percent}%</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              percent >= 100 ? 'bg-emerald-500' : 'bg-sky-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate('/student/learn', { courseId: course.courseId })}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <PlayCircle className="w-4 h-4 text-sky-400" />
                        <span>{percent >= 100 ? 'Review Course' : 'Continue Learning'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Assigned Quizzes, Assignments & Certificates (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Requirement 6 & 7: Assigned Quizzes & Assignments Section */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Assigned Quizzes & Tasks</h3>
                <span className="text-[11px] font-bold text-slate-400 font-mono">
                  {assignedQuizzes.length + assignedAssignments.length} Assigned
                </span>
              </div>

              <div className="space-y-3">
                {/* Dynamic Assigned Quizzes */}
                {assignedQuizzes.length === 0 && assignedAssignments.length === 0 && (
                  <div className="text-center py-4 text-xs text-slate-400">
                    No active quizzes or assignments assigned currently.
                  </div>
                )}

                {assignedQuizzes.map((quiz) => {
                  const course = courses.find((c) => c.courseId === quiz.courseId);
                  return (
                    <div key={quiz.quizId} className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 line-clamp-1">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span>{quiz.title}</span>
                        </span>
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                          {quiz.timeLimitMinutes} Mins
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {course?.title || 'Enrolled Course'} · Pass: {quiz.passingPercentage}% ({quiz.maxAttempts} Attempts)
                      </div>
                      <button
                        onClick={() => navigate('/student/quiz', { quizId: quiz.quizId })}
                        className="text-xs font-bold text-amber-800 hover:underline pt-1 flex items-center gap-1"
                      >
                        <span>Start Quiz Now</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}

                {/* Dynamic Assigned Assignments */}
                {assignedAssignments.map((assign) => {
                  const course = courses.find((c) => c.courseId === assign.courseId);
                  return (
                    <div key={assign.assignmentId} className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5 line-clamp-1">
                          <FileText className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                          <span>{assign.title}</span>
                        </span>
                        {assign.dueDate && (
                          <span className="text-[10px] font-semibold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                            Due {assign.dueDate.split('T')[0]}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {course?.title || 'Enrolled Course'} · {assign.maxMarks} Total Marks
                      </div>
                      <button
                        onClick={() => navigate('/student/assignment', { assignmentId: assign.assignmentId })}
                        className="text-xs font-bold text-sky-800 hover:underline pt-1 flex items-center gap-1"
                      >
                        <span>View & Submit Assignment</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Certificates Widget */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Earned Certificates</h3>
                <span className="text-xs font-bold text-slate-400 font-mono">{myCertificates.length} Total</span>
              </div>

              {myCertificates.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-400">
                  Complete 100% of a course to unlock your official verified certificate!
                </div>
              ) : (
                <div className="space-y-3">
                  {myCertificates.map((cert) => (
                    <div
                      key={cert.certificateId}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-800 line-clamp-1">{cert.courseTitle}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Code: {cert.verificationCode}</div>
                      </div>
                      <button
                        onClick={() => navigate('/student/certificates')}
                        className="px-2.5 py-1 bg-sky-600 text-white text-[11px] font-bold rounded-lg hover:bg-sky-500"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
