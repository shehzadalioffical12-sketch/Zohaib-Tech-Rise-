import React, { useState, useEffect, useRef } from 'react';
import { useLms } from '../../context/LmsContext';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storageService';
import { Lesson, Module } from '../../types/lms';
import confetti from 'canvas-confetti';
import {
  PlayCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Clock,
  BookOpen,
  Award,
  HelpCircle,
  Menu,
  X,
  Volume2,
  Maximize2
} from 'lucide-react';

export const StudentLearnPage: React.FC = () => {
  const { route, navigate, courses, markLessonDone, refreshData } = useLms();
  const { currentUser } = useAuth();

  const courseId = route.params?.courseId || 'course_web_dev';
  const targetLessonId = route.params?.lessonId;

  const course = courses.find((c) => c.courseId === courseId) || courses[0];
  const modules = StorageService.getModules(course?.courseId);

  // Flatten all lessons for easy previous/next navigation
  const allLessons: Lesson[] = [];
  modules.forEach((m) => {
    m.lessons.forEach((l) => allLessons.push(l));
  });

  const [currentLesson, setCurrentLesson] = useState<Lesson>(() => {
    if (targetLessonId) {
      const found = allLessons.find((l) => l.lessonId === targetLessonId);
      if (found) return found;
    }
    return allLessons[0] || ({} as Lesson);
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [completedCelebration, setCompletedCelebration] = useState(false);

  // Lesson progress map for this student & course
  const progressList = currentUser
    ? StorageService.getLessonProgressList(currentUser.uid, course.courseId)
    : [];

  const isLessonCompleted = (lessonId: string) => {
    const p = progressList.find((item) => item.lessonId === lessonId);
    return p?.completionStatus === 'completed';
  };

  const currentIndex = allLessons.findIndex((l) => l.lessonId === currentLesson.lessonId);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  const handleNext = () => {
    if (hasNext) {
      setCurrentLesson(allLessons[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      setCurrentLesson(allLessons[currentIndex - 1]);
    }
  };

  const handleMarkComplete = () => {
    if (!currentUser) return;
    const res = markLessonDone(course.courseId, currentLesson.lessonId);
    refreshData();

    if (res.courseCompleted) {
      // Confetti burst for course completion!
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
      setCompletedCelebration(true);
    } else if (hasNext) {
      handleNext();
    }
  };

  const completedCount = allLessons.filter((l) => isLessonCompleted(l.lessonId)).length;
  const progressPercentage = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Classroom Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student')}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <span className="text-slate-600">|</span>
          <span className="font-bold text-white truncate max-w-sm sm:max-w-md">{course.title}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-slate-400">Course Progress:</span>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="font-bold text-emerald-400">{progressPercentage}%</span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 lg:hidden"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Lesson & Curriculum Sidebar */}
        <div
          className={`w-80 sm:w-96 bg-slate-950 border-r border-slate-800 flex flex-col flex-shrink-0 transition-all duration-300 z-20 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'
          }`}
        >
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-sky-400">Curriculum</div>
              <div className="text-[11px] text-slate-400">
                {completedCount} of {allLessons.length} lessons completed
              </div>
            </div>
            {progressPercentage >= 100 && (
              <button
                onClick={() => navigate('/student/certificates')}
                className="px-2 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] rounded flex items-center gap-1 shadow-sm"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Certificate</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
            {modules.map((mod, modIdx) => (
              <div key={mod.moduleId} className="py-2">
                <div className="px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>{mod.title}</span>
                  <span className="text-[10px] text-slate-500">{mod.lessons.length}</span>
                </div>

                <div className="space-y-0.5">
                  {mod.lessons.map((lesson) => {
                    const isSelected = lesson.lessonId === currentLesson.lessonId;
                    const isDone = isLessonCompleted(lesson.lessonId);

                    return (
                      <button
                        key={lesson.lessonId}
                        onClick={() => {
                          setCurrentLesson(lesson);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-sky-600/20 text-sky-300 font-bold border-l-4 border-sky-500'
                            : 'text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          {isDone ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <PlayCircle
                              className={`w-4 h-4 flex-shrink-0 ${
                                isSelected ? 'text-sky-400' : 'text-slate-500'
                              }`}
                            />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">
                          {lesson.durationFormatted}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center / Right Video Player & Lesson Details */}
        <div className="flex-1 overflow-y-auto bg-slate-900 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
          <div className="w-full max-w-5xl space-y-6">
            {/* The Video Player Container */}
            <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <iframe
                src={`${currentLesson.videoUrl || 'https://www.youtube.com/embed/UB1O30fR-EE'}?autoplay=0&rel=0&modestbranding=1`}
                title={currentLesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

            {/* Video Controls & Mark Complete Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={!hasPrevious}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={!hasNext}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mark Complete Button */}
              <button
                onClick={handleMarkComplete}
                className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isLessonCompleted(currentLesson.lessonId)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/30'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {isLessonCompleted(currentLesson.lessonId) ? 'Completed ✓' : 'Mark as Complete & Next'}
                </span>
              </button>
            </div>

            {/* Lesson Title, Description & Resources */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">Current Lesson</span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">{currentLesson.title}</h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  {currentLesson.description ||
                    'In this lesson, you will learn the core techniques and best practices taught by the course instructor.'}
                </p>
              </div>

              {/* Lesson Downloadable Resources */}
              {currentLesson.resources && currentLesson.resources.length > 0 && (
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Downloadable Course Resources ({currentLesson.resources.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentLesson.resources.map((res) => (
                      <div
                        key={res.id}
                        className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <FileText className="w-4 h-4 text-sky-400 flex-shrink-0" />
                          <div className="truncate">
                            <div className="font-bold text-slate-200 truncate">{res.title}</div>
                            <div className="text-[10px] text-slate-500">
                              {res.fileType} · {res.fileSize}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const blob = new Blob([`Resource: ${res.title}\nCourse: Zohaib Tech Rise LMS`], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${res.title.replace(/\s+/g, '_')}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg flex items-center gap-1 text-[11px] font-semibold"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Get</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Completion Celebration Modal */}
      {completedCelebration && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-8 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900">Congratulations! 🎉</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have successfully completed 100% of the lessons in <strong className="text-slate-800">{course.title}</strong>! Your official verified certificate has been generated and recorded.
            </p>

            <div className="pt-4 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setCompletedCelebration(false);
                  navigate('/student/certificates');
                }}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                View & Download Certificate
              </button>
              <button
                onClick={() => setCompletedCelebration(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Continue in Classroom
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
