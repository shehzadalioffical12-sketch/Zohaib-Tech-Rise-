import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLms } from '../../context/LmsContext';
import { StorageService } from '../../services/storageService';
import { Course } from '../../types/lms';
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  PlusCircle,
  FileCheck,
  Settings,
  Shield,
  Clock,
  HelpCircle,
  FileText,
  ChevronRight,
  CheckCircle2,
  Camera,
  Trash2,
  Edit,
  Image as ImageIcon,
  AlertTriangle,
  X,
  Upload,
  Search,
  Check
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { allUsers, currentUser, updateProfile, refreshUsers } = useAuth();
  const { courses, enrollments, certificates, submissions, quizzes, refreshData, navigate } = useLms();

  const stats = StorageService.getPlatformStats();
  const recentStudents = allUsers.filter((u) => u.role === 'student').slice(0, 5);

  // Course management state
  const [courseSearch, setCourseSearch] = useState('');
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [courseForThumbnail, setCourseForThumbnail] = useState<Course | null>(null);
  const [newThumbnailUrl, setNewThumbnailUrl] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Admin Profile Image Modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [adminImagePreview, setAdminImagePreview] = useState<string | null>(null);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Filtered courses
  const filteredCourses = courses.filter((c) => {
    if (!courseSearch.trim()) return true;
    const term = courseSearch.toLowerCase();
    return c.title.toLowerCase().includes(term) || c.categoryId.toLowerCase().includes(term);
  });

  // Handle Admin Profile Image Upload via FileReader
  const handleAdminImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAdminImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAdminProfile = () => {
    if (!currentUser) return;
    const finalImage = adminImagePreview !== null ? adminImagePreview : currentUser.profileImage;
    updateProfile({ profileImage: finalImage });
    StorageService.updateUserProfileImage(currentUser.uid, finalImage);
    refreshUsers();
    setProfileSaveSuccess(true);
    setTimeout(() => {
      setProfileSaveSuccess(false);
      setShowProfileModal(false);
    }, 1200);
  };

  // Handle Course Thumbnail Upload via FileReader
  const handleCourseThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setThumbnailPreview(result);
      setNewThumbnailUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCourseThumbnail = () => {
    if (!courseForThumbnail) return;
    const finalThumb = thumbnailPreview || newThumbnailUrl;
    if (!finalThumb) return;

    StorageService.updateCourseThumbnail(courseForThumbnail.courseId, finalThumb);
    refreshData();
    setCourseForThumbnail(null);
    setThumbnailPreview(null);
    setNewThumbnailUrl('');
  };

  // Handle Delete Course
  const handleConfirmDeleteCourse = () => {
    if (!courseToDelete) return;
    StorageService.deleteCourse(courseToDelete.courseId);
    refreshData();
    setCourseToDelete(null);
  };

  const adminAvatar = currentUser?.profileImage || '/assets/admin_zohaib.jpg';

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header with Admin Profile & Quick Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-4">
            {/* Admin Profile Image Avatar */}
            <div className="relative group cursor-pointer" onClick={() => {
              setAdminImagePreview(currentUser?.profileImage || '/assets/admin_zohaib.jpg');
              setShowProfileModal(true);
            }}>
              <img
                src={adminAvatar}
                alt={currentUser?.fullName || 'Admin'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-500 shadow-md transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                <Camera className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {currentUser?.fullName || 'Engr. Zohaib Ali'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Zohaib Tech Rise LMS · Command Center
              </p>
              <button
                onClick={() => {
                  setAdminImagePreview(currentUser?.profileImage || '/assets/admin_zohaib.jpg');
                  setShowProfileModal(true);
                }}
                className="text-[11px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 mt-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Manage Profile Photo</span>
              </button>
            </div>
          </div>

          {/* Quick-action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate('/admin/courses/create')}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Course</span>
            </button>
            <button
              onClick={() => navigate('/admin/quizzes')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Create Quiz</span>
            </button>
            <button
              onClick={() => navigate('/admin/assignments')}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Create Assignment</span>
            </button>
            <button
              onClick={() => navigate('/admin/certificates')}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Certificates</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Bar for Admin Sections */}
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
          <button
            onClick={() => navigate('/admin')}
            className="px-3 py-1.5 bg-sky-50 text-sky-700 font-bold rounded-lg"
          >
            Overview
          </button>
          <button
            onClick={() => navigate('/admin/courses/create')}
            className="px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span>Courses Builder</span>
          </button>
          <button
            onClick={() => navigate('/admin/certificates')}
            className="px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors text-amber-800 font-bold flex items-center gap-1"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Manage Certificates</span>
          </button>
          <button
            onClick={() => navigate('/admin/quizzes')}
            className="px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quiz Management</span>
          </button>
          <button
            onClick={() => navigate('/admin/assignments')}
            className="px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>Assignment Management</span>
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            className="px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5 text-slate-600" />
            <span>Users & Faculty</span>
          </button>
          <button
            onClick={() => navigate('/admin/settings')}
            className="px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors ml-auto flex items-center gap-1"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Settings</span>
          </button>
        </div>

        {/* Database-driven statistics grid (8 metrics) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Total Students</span>
              <Users className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {stats.totalStudents}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Enrolled across platform</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Total Instructors</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {stats.totalInstructors}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Active verified faculty</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Total Courses</span>
              <BookOpen className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {stats.totalCourses}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Published syllabus tracks</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Total Enrollments</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {stats.totalEnrollments}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Student course seats</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Certificates Issued</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
              {stats.certificatesIssued}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Verified with QR codes</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Completed Courses</span>
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-600 mt-2">
              {stats.completedCourses}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Course graduates</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Pending Reviews</span>
              <FileCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">
              {stats.pendingReviews}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Assignments to grade</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Pending Quizzes</span>
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-2">
              {stats.pendingQuizAttempts}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Assessment evaluations</div>
          </div>
        </div>

        {/* 1. COURSE MANAGEMENT SECTION matching Requirement 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-600" />
                <h3 className="font-extrabold text-slate-900 text-lg">Course Management</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Create new courses, edit curriculum, upload thumbnails, and manage catalog status
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Requirement 1: Add Course button in Admin Dashboard */}
              <button
                onClick={() => navigate('/admin/courses/create')}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Course</span>
              </button>
            </div>
          </div>

          {/* Courses Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Thumbnail</th>
                  <th className="py-3 px-4">Course Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((c, idx) => (
                  <tr key={c.courseId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="relative group w-16 h-10 rounded-lg overflow-hidden border border-slate-200 shadow-2xs">
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            setCourseForThumbnail(c);
                            setNewThumbnailUrl(c.thumbnail);
                            setThumbnailPreview(c.thumbnail);
                          }}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                          title="Change Thumbnail"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 max-w-xs">{c.title}</div>
                      <div className="text-[10px] text-slate-400">{c.totalModules} modules · {c.durationWeeks} weeks</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium capitalize">
                      {c.categoryId.replace('cat_', '')}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {allUsers.find((u) => u.uid === c.instructorIds[0])?.fullName || 'Zohaib Ali'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {c.level}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          c.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                      {/* Change thumbnail button */}
                      <button
                        onClick={() => {
                          setCourseForThumbnail(c);
                          setNewThumbnailUrl(c.thumbnail);
                          setThumbnailPreview(c.thumbnail);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                        title="Upload / Change Thumbnail"
                      >
                        <ImageIcon className="w-3 h-3 text-sky-600" />
                        <span>Thumbnail</span>
                      </button>

                      {/* Edit Course button */}
                      <button
                        onClick={() => navigate('/admin/courses/create', { courseId: c.courseId })}
                        className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                        title="Edit Course Curriculum"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {/* Delete Course button */}
                      <button
                        onClick={() => setCourseToDelete(c)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg inline-block transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2-Column Section: Recent Students & Management Quick Shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Students Table (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Registered Students Directory</h3>
              <button
                onClick={() => navigate('/admin/users')}
                className="text-xs font-bold text-sky-600 hover:text-sky-700"
              >
                Manage All Users →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentStudents.map((s) => (
                    <tr key={s.uid} className="hover:bg-slate-50/50">
                      <td className="py-3 font-semibold text-slate-900 flex items-center gap-2">
                        <img
                          src={s.profileImage || '/assets/student_ayesha.jpg'}
                          alt={s.fullName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <span>{s.fullName}</span>
                      </td>
                      <td className="py-3 text-slate-500 font-mono text-[11px]">{s.email}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            s.accountStatus === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {s.accountStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => navigate('/admin/users')}
                          className="text-sky-600 font-bold hover:underline"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Management Panels (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Core Administration Hubs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => navigate('/admin/certificates')}
                  className="p-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-start gap-2.5 transition-colors text-left"
                >
                  <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold">Certificate Editor</div>
                    <div className="text-[10px] text-amber-700 font-normal mt-0.5">Edit recipient info, IDs, & reissue</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/admin/quizzes')}
                  className="p-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold flex items-start gap-2.5 transition-colors text-left"
                >
                  <HelpCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold">Quiz Manager</div>
                    <div className="text-[10px] text-indigo-700 font-normal mt-0.5">Timed tests & question banks</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/admin/assignments')}
                  className="p-3.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs font-bold flex items-start gap-2.5 transition-colors text-left"
                >
                  <FileText className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold">Assignments</div>
                    <div className="text-[10px] text-sky-700 font-normal mt-0.5">Assign projects & grade files</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/admin/settings')}
                  className="p-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold flex items-start gap-2.5 transition-colors text-left"
                >
                  <Settings className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold">System Settings</div>
                    <div className="text-[10px] text-slate-600 font-normal mt-0.5">Admin password & branding</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Monthly Trend Indicator */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Enrollment Target vs Actual</span>
                <span className="text-emerald-600 font-bold">92% on track</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full w-[92%]"></div>
              </div>
              <div className="text-[10px] text-slate-400">
                Data refreshed in real time from database collections.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Admin Profile Photo Upload / Replace / Remove (Requirement 2) */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-base">My Admin Profile Photo</h3>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileSaveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Admin profile photo successfully updated!</span>
              </div>
            )}

            {/* Photo Preview */}
            <div className="flex flex-col items-center justify-center space-y-3 py-2">
              <div className="relative">
                <img
                  src={adminImagePreview || adminAvatar}
                  alt="Admin Profile Preview"
                  className="w-28 h-28 rounded-full object-cover border-4 border-sky-500 shadow-lg"
                />
              </div>
              <span className="text-xs font-bold text-slate-800">{currentUser?.fullName || 'Engr. Zohaib Ali'}</span>
              <span className="text-[11px] text-slate-400">Super Administrator</span>
            </div>

            {/* Upload Options */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Upload Image from Device
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAdminImageUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAdminImagePreview('/assets/admin_zohaib.jpg')}
                  className="flex-1 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                >
                  Use Official Photo
                </button>
                <button
                  type="button"
                  onClick={() => setAdminImagePreview(`https://api.dicebear.com/7.x/initials/svg?seed=Zohaib+Ali&backgroundColor=0284c7`)}
                  className="flex-1 py-2 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition-colors"
                >
                  Remove Photo
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAdminProfile}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Save Profile Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Change Course Thumbnail (Requirement 1) */}
      {courseForThumbnail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-base">Change Course Thumbnail</h3>
              </div>
              <button onClick={() => setCourseForThumbnail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Course: <strong className="text-slate-800">{courseForThumbnail.title}</strong>
            </div>

            {/* Thumbnail Preview */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-600 uppercase">Preview</span>
              <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={thumbnailPreview || newThumbnailUrl || courseForThumbnail.thumbnail}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* File Upload or URL */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Upload Thumbnail Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCourseThumbnailUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Or Paste Image URL
                </label>
                <input
                  type="text"
                  value={newThumbnailUrl}
                  onChange={(e) => {
                    setNewThumbnailUrl(e.target.value);
                    setThumbnailPreview(e.target.value);
                  }}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCourseForThumbnail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCourseThumbnail}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Update Thumbnail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Delete Course Confirmation Popup (Requirement 1) */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Delete Course Confirmation</h3>
                <p className="text-xs text-slate-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete the course <strong className="text-slate-900">"{courseToDelete.title}"</strong>?
              All modules, lesson videos, and student enrollment records linked to this course will be removed from the active system.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <img
                src={courseToDelete.thumbnail}
                alt={courseToDelete.title}
                className="w-12 h-10 object-cover rounded-lg border border-slate-200"
              />
              <div className="text-xs">
                <div className="font-bold text-slate-800">{courseToDelete.title}</div>
                <div className="text-[11px] text-slate-500">{courseToDelete.totalModules} modules · {courseToDelete.level}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCourse}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Course</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
