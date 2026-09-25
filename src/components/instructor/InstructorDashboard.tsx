import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLms } from '../../context/LmsContext';
import { StorageService } from '../../services/storageService';
import { AssignmentSubmission } from '../../types/lms';
import {
  BookOpen,
  Users,
  CheckSquare,
  Clock,
  PlusCircle,
  FileText,
  Star,
  ChevronRight,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export const InstructorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { courses, assignments, submissions, navigate, refreshData } = useLms();

  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [marks, setMarks] = useState<number>(90);
  const [feedback, setFeedback] = useState<string>('Great work! Your submission meets all course requirements.');

  if (!currentUser) return null;

  // Filter courses taught by this instructor
  const myCourses = courses.filter((c) => c.instructorIds.includes(currentUser.uid) || currentUser.role === 'super_admin');
  const myCourseIds = myCourses.map((c) => c.courseId);

  // Total enrolled students across instructor's courses
  const totalStudents = myCourses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);

  // Submissions for this instructor's courses
  const relevantSubmissions = submissions.filter((s) => myCourseIds.includes(s.courseId));
  const pendingReviews = relevantSubmissions.filter((s) => s.status === 'submitted' || s.status === 'under_review');

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;
    StorageService.gradeSubmission(gradingSubmission.submissionId, marks, feedback, currentUser.uid);
    refreshData();
    setGradingSubmission(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header with Instructor Profile Image */}
        <div className="bg-gradient-to-r from-[#0F2744] via-[#103a6b] to-[#0c1e38] text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.profileImage || '/assets/admin_zohaib.jpg'}
                alt={currentUser.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-sky-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0F2744] rounded-full"></span>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold">Faculty Portal</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome, {currentUser.fullName} 👨‍🏫
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Manage your courses, review practical student assignments, and track class learning outcomes.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/admin/courses/create')}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all self-start md:self-auto flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        </div>

        {/* 4 Stats Cards matching image #3 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Courses</span>
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">{myCourses.length}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Students</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">{totalStudents}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Grading</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-amber-600 mt-2">{pendingReviews.length}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course Rating</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <Star className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">4.9 / 5.0</div>
          </div>
        </div>

        {/* 2-Column Section: My Courses & Submissions Review Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Courses List (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Courses I Teach</h2>
              <span className="text-xs text-slate-400 font-semibold">{myCourses.length} Assigned</span>
            </div>

            <div className="space-y-3">
              {myCourses.map((course) => (
                <div
                  key={course.courseId}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="truncate">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{course.title}</h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {course.level} · {course.enrolledCount} Students Enrolled
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => navigate('/admin/courses/builder', { courseId: course.courseId })}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Curriculum
                    </button>
                    <button
                      onClick={() => navigate('/courses/detail', { id: course.courseId })}
                      className="p-1.5 text-slate-400 hover:text-slate-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submissions Grading Queue (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Pending Assignment Reviews</h2>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {pendingReviews.length} Needs Review
              </span>
            </div>

            {pendingReviews.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <span>All caught up! There are no pending assignment submissions to review.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReviews.map((sub) => {
                  const student = StorageService.getUserById(sub.studentId);
                  const assign = assignments.find((a) => a.assignmentId === sub.assignmentId);

                  return (
                    <div
                      key={sub.submissionId}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-900">
                          {student?.fullName || 'Student'}
                        </div>
                        <div className="text-xs text-sky-700 font-medium">
                          {assign?.title || 'Course Assignment'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setGradingSubmission(sub);
                          setMarks(90);
                          setFeedback('Great project submission! Clean structure and well organized.');
                        }}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
                      >
                        Grade & Feedback
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal: Grade Submission */}
        {gradingSubmission && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base">Grade Student Assignment</h3>
                <button
                  onClick={() => setGradingSubmission(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Student text answer & files */}
              <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-700 block">Student Response:</span>
                  <p className="text-slate-600 mt-1 whitespace-pre-line">
                    {gradingSubmission.textAnswer || 'No written comments attached.'}
                  </p>
                </div>

                {gradingSubmission.fileUrls && gradingSubmission.fileUrls.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Attached Files:</span>
                    {gradingSubmission.fileUrls.map((f, i) => (
                      <div key={i} className="flex items-center justify-between text-slate-600 bg-white p-2 rounded border border-slate-200">
                        <span>{f.name} ({f.size})</span>
                        <span className="text-sky-600 font-bold cursor-pointer">Preview File</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveGrade} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assign Marks (out of 100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Instructor Feedback
                  </label>
                  <textarea
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 text-slate-800"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setGradingSubmission(null)}
                    className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    Save & Publish Grade
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
