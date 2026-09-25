import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storageService';
import {
  Clock,
  BookOpen,
  Award,
  Star,
  CheckCircle,
  PlayCircle,
  Lock,
  ChevronRight,
  ShieldCheck,
  Globe,
  FileText,
  UserCheck,
  Check
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { route, navigate, enrollInCourse, courses } = useLms();
  const { currentUser } = useAuth();
  const courseId = route.params?.id || 'course_web_dev';

  const course = courses.find((c) => c.courseId === courseId) || courses[0];
  const modules = StorageService.getModules(course?.courseId);
  const enrollment = currentUser ? StorageService.getEnrollment(currentUser.uid, course?.courseId) : undefined;
  const instructor = course?.instructorIds?.length ? StorageService.getUserById(course.instructorIds[0]) : null;

  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor'>('overview');
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  const [enrollMessage, setEnrollMessage] = useState<string | null>(null);

  if (!course) {
    return (
      <div className="min-h-screen p-12 text-center">
        <h2 className="text-xl font-bold">Course not found.</h2>
        <button onClick={() => navigate('/courses')} className="mt-4 px-4 py-2 bg-sky-600 text-white rounded">
          Back to Courses
        </button>
      </div>
    );
  }

  const handleEnroll = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const res = enrollInCourse(course.courseId);
    if (res.success) {
      setEnrollMessage('Enrollment successful! Redirecting to classroom...');
      setTimeout(() => {
        navigate('/student/learn', { courseId: course.courseId });
      }, 1000);
    } else {
      setEnrollMessage(res.message);
    }
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-slate-800">Home</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => navigate('/courses')} className="hover:text-slate-800">Courses</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-semibold truncate max-w-xs">{course.title}</span>
        </div>

        {/* Header Hero Banner */}
        <div className="bg-[#0F2744] text-white rounded-2xl p-6 sm:p-10 mb-8 relative overflow-hidden shadow-xl border border-sky-950">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 bg-sky-500/20 text-sky-300 font-semibold rounded-md border border-sky-500/30">
                {course.level}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">{course.language}</span>
              <span className="text-slate-400">·</span>
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{course.rating.toFixed(1)}</span>
                <span className="text-slate-300 font-normal">({course.ratingCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{course.title}</h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{course.shortDescription}</p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>{course.durationWeeks} Weeks ({course.estimatedHours} Hours)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>{modules.length} Modules · {totalLessons} Video Lessons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Certificate Included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Tabs & Curriculum (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tab Buttons */}
            <div className="flex border-b border-slate-200 gap-6">
              {(['overview', 'curriculum', 'instructor'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-bold capitalize transition-colors relative ${
                    activeTab === tab ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-8 bg-white p-6 rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">About This Course</h3>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{course.description}</p>
                </div>

                {/* What you'll learn */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">What You Will Learn</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.learningOutcomes.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prerequisites */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Prerequisites</h3>
                  <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
                    {course.prerequisites.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Curriculum */}
            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>{modules.length} Modules · {totalLessons} Lessons total</span>
                  <span>Self-paced access</span>
                </div>

                <div className="space-y-3">
                  {modules.map((mod, idx) => {
                    const isOpen = openModuleIndex === idx;
                    return (
                      <div key={mod.moduleId} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                        <button
                          onClick={() => setOpenModuleIndex(isOpen ? null : idx)}
                          className="w-full p-4 text-left flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div className="font-bold text-sm text-slate-800">
                            {mod.title}
                          </div>
                          <span className="text-xs text-slate-500 font-medium">
                            {mod.lessons.length} Lessons {isOpen ? '▲' : '▼'}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="divide-y divide-slate-100">
                            {mod.lessons.map((lesson) => (
                              <div key={lesson.lessonId} className="p-3.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                                <div className="flex items-center gap-3">
                                  {lesson.isPreview ? (
                                    <PlayCircle className="w-4 h-4 text-sky-600" />
                                  ) : (
                                    <Lock className="w-4 h-4 text-slate-400" />
                                  )}
                                  <div>
                                    <div className="text-xs font-semibold text-slate-800">{lesson.title}</div>
                                    <div className="text-[11px] text-slate-500">{lesson.description}</div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  {lesson.isPreview && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                                      Preview
                                    </span>
                                  )}
                                  <span className="text-xs font-mono text-slate-500">{lesson.durationFormatted}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Instructor */}
            {activeTab === 'instructor' && instructor && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={instructor.profileImage || (instructor.uid === 'inst_1' ? '/assets/admin_zohaib.jpg' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80')}
                    alt={instructor.fullName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-sky-500 shadow-xs"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{instructor.fullName}</h4>
                    <p className="text-xs font-semibold text-sky-600">{instructor.headline}</p>
                    <p className="text-xs text-slate-500 mt-1">{instructor.email}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {instructor.bio || 'Expert instructor dedicated to professional technological education and real-world student success.'}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Enrollment Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-6">
              {/* Preview Thumbnail with play icon */}
              <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 group">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-sky-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-7 h-7" />
                  </div>
                </div>
              </div>

              {/* Price & Status */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">FREE</span>
                  <span className="text-xs font-medium text-slate-500 line-through">Rs. 8,000</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    100% Scholarship
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Sponsored by Zohaib Tech Rise LMS Digital Empowerment Fund</p>
              </div>

              {/* Message if already enrolled */}
              {enrollMessage && (
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-xs text-sky-800 font-medium">
                  {enrollMessage}
                </div>
              )}

              {/* Action Button */}
              {enrollment ? (
                <button
                  onClick={() => navigate('/student/learn', { courseId: course.courseId })}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" />
                  <span>Continue Learning ({enrollment.progressPercentage}%)</span>
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Enroll in Course Free</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* Instructor Card with Image */}
              {instructor && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <img
                    src={instructor.profileImage || (instructor.uid === 'inst_1' ? '/assets/admin_zohaib.jpg' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80')}
                    alt={instructor.fullName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-sky-500 shadow-2xs"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">Lead Instructor</span>
                    <h5 className="text-xs font-bold text-slate-900 truncate">{instructor.fullName}</h5>
                    <p className="text-[10px] text-slate-500 truncate">{instructor.headline}</p>
                  </div>
                </div>
              )}

              {/* Course Includes List */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800">This Course Includes:</h5>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-sky-600" />
                    <span>{totalLessons} On-Demand HD Video Lessons</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>Downloadable Source Code & Assets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-600" />
                    <span>Automated Quizzes & Interactive Tests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Official Verified Certificate of Completion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-sky-600" />
                    <span>Lifetime Access on Mobile & Desktop</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
