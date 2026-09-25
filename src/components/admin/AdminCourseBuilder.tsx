import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storageService';
import { Course, CourseLevel, CourseStatus, Module, Lesson } from '../../types/lms';
import {
  ChevronLeft,
  Save,
  Plus,
  Trash2,
  Edit,
  Video,
  FileText,
  HelpCircle,
  Award,
  CheckCircle,
  Eye,
  Users,
  Settings,
  AlertCircle
} from 'lucide-react';

export const AdminCourseBuilder: React.FC = () => {
  const { route, navigate, categories, refreshData } = useLms();
  const { currentUser } = useAuth();

  const editCourseId = route.params?.courseId;
  const existingCourse = editCourseId ? StorageService.getCourseById(editCourseId) : null;

  // Form State
  const [title, setTitle] = useState(existingCourse?.title || '');
  const [slug, setSlug] = useState(existingCourse?.slug || '');
  const [shortDesc, setShortDesc] = useState(existingCourse?.shortDescription || '');
  const [description, setDescription] = useState(existingCourse?.description || '');
  const [thumbnail, setThumbnail] = useState(
    existingCourse?.thumbnail ||
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
  );
  const [categoryId, setCategoryId] = useState(existingCourse?.categoryId || categories[0]?.categoryId || 'cat_web');
  const [level, setLevel] = useState<CourseLevel>(existingCourse?.level || 'Beginner');
  const [language, setLanguage] = useState(existingCourse?.language || 'English / Urdu');
  const [durationWeeks, setDurationWeeks] = useState(existingCourse?.durationWeeks || 6);
  const [status, setStatus] = useState<CourseStatus>(existingCourse?.status || 'published');
  const [certificateEnabled, setCertificateEnabled] = useState(existingCourse?.certificateEnabled ?? true);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Modules State
  const [modules, setModules] = useState<Module[]>(() => {
    if (editCourseId) {
      return StorageService.getModules(editCourseId);
    }
    return [
      {
        moduleId: `mod_${Date.now()}_1`,
        courseId: editCourseId || 'new_course',
        title: 'Module 1: Course Fundamentals',
        order: 1,
        lessons: [
          {
            lessonId: `les_${Date.now()}_1`,
            courseId: editCourseId || 'new_course',
            moduleId: `mod_${Date.now()}_1`,
            title: 'Lesson 1: Welcome & Course Overview',
            description: 'Introduction to course curriculum and software tools.',
            videoProvider: 'youtube',
            videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE',
            durationMinutes: 10,
            durationFormatted: '10:00',
            isPreview: true,
            order: 1,
            resources: []
          }
        ]
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<'info' | 'curriculum'>('info');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonVideo, setNewLessonVideo] = useState('https://www.youtube.com/embed/UB1O30fR-EE');
  const [activeModuleForLesson, setActiveModuleForLesson] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editCourseId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleAddModule = () => {
    const newMod: Module = {
      moduleId: `mod_${Date.now()}`,
      courseId: editCourseId || 'new_course',
      title: `Module ${modules.length + 1}: New Topic Section`,
      order: modules.length + 1,
      lessons: []
    };
    setModules([...modules, newMod]);
  };

  const handleDeleteModule = (moduleId: string) => {
    setModules(modules.filter((m) => m.moduleId !== moduleId));
  };

  const handleAddLesson = (moduleId: string) => {
    if (!newLessonTitle.trim()) return;
    const updated = modules.map((m) => {
      if (m.moduleId === moduleId) {
        const newLesson: Lesson = {
          lessonId: `les_${Date.now()}`,
          courseId: editCourseId || 'new_course',
          moduleId,
          title: newLessonTitle,
          description: 'Lesson lecture and demonstration.',
          videoProvider: 'youtube',
          videoUrl: newLessonVideo,
          durationMinutes: 12,
          durationFormatted: '12:00',
          isPreview: m.lessons.length === 0,
          order: m.lessons.length + 1,
          resources: []
        };
        return { ...m, lessons: [...m.lessons, newLesson] };
      }
      return m;
    });
    setModules(updated);
    setNewLessonTitle('');
    setActiveModuleForLesson(null);
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    const updated = modules.map((m) => {
      if (m.moduleId === moduleId) {
        return { ...m, lessons: m.lessons.filter((l) => l.lessonId !== lessonId) };
      }
      return m;
    });
    setModules(updated);
  };

  const handleSaveCourse = () => {
    setSaveError(null);
    if (!title.trim()) {
      setSaveError('Please specify the course title before publishing or saving.');
      return;
    }

    const courseId = editCourseId || `course_${Date.now()}`;
    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

    const courseData: Course = {
      courseId,
      title,
      slug: slug || `course-${Date.now()}`,
      shortDescription: shortDesc || 'High quality course at Zohaib Tech Rise LMS.',
      description: description || 'Detailed course curriculum and hands-on exercises.',
      thumbnail,
      categoryId,
      instructorIds: existingCourse?.instructorIds || [currentUser?.uid || 'inst_1'],
      level,
      language,
      durationWeeks: Number(durationWeeks) || 6,
      estimatedHours: Number(durationWeeks) * 4 || 24,
      totalModules: modules.length,
      totalLessons,
      learningOutcomes: existingCourse?.learningOutcomes || ['Master practical trade techniques and modern standards'],
      prerequisites: existingCourse?.prerequisites || ['Basic computer operation'],
      status,
      certificateEnabled,
      rating: existingCourse?.rating || 4.8,
      ratingCount: existingCourse?.ratingCount || 1,
      enrolledCount: existingCourse?.enrolledCount || 0,
      createdAt: existingCourse?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageService.saveCourse(courseData);

    // Save modules and lessons
    modules.forEach((mod) => {
      const fixedMod: Module = { ...mod, courseId };
      StorageService.saveModule(fixedMod);
    });

    refreshData();
    navigate('/courses/detail', { id: courseId });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {editCourseId ? 'Edit Course Curriculum' : 'Add New Course'}
              </h1>
              <p className="text-xs text-slate-500">
                Structure modules, upload video lectures, and set completion requirements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveCourse()}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Course</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Bar for Admin Sections */}
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
          <button
            onClick={() => navigate('/admin')}
            className="px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Overview
          </button>
          <button
            onClick={() => navigate('/admin/courses/create')}
            className="px-3 py-1.5 bg-sky-50 text-sky-700 font-bold rounded-lg"
          >
            Courses Builder
          </button>
          <button
            onClick={() => navigate('/admin/certificates')}
            className="px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
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

        {saveError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Builder Tabs */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'info' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            1. Course Details
            {activeTab === 'info' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600"></span>}
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'curriculum' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            2. Modules & Video Lessons ({modules.length})
            {activeTab === 'curriculum' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600"></span>}
          </button>
        </div>

        {/* Tab 1: Course Info */}
        {activeTab === 'info' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Course Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Web Development with HTML, CSS & JavaScript"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Course Slug URL</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. web-development-html-css"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                >
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Difficulty Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as CourseLevel)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Duration (Weeks)</label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Course Thumbnail Image URL</label>
              <input
                type="text"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Short Description</label>
              <textarea
                rows={2}
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Brief 1-2 sentence overview for catalog cards..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Course Syllabus & Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed curriculum overview, benefits, and projects..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              ></textarea>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-8 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={certificateEnabled}
                  onChange={(e) => setCertificateEnabled(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded"
                />
                <span>Issue Verifiable Certificate upon completion</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={status === 'published'}
                  onChange={(e) => setStatus(e.target.checked ? 'published' : 'draft')}
                  className="w-4 h-4 text-sky-600 rounded"
                />
                <span>Publish Course Immediately</span>
              </label>
            </div>
          </div>
        )}

        {/* Tab 2: Curriculum Builder matching image #3 */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Modules Breakdown</span>
              <button
                onClick={handleAddModule}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Module</span>
              </button>
            </div>

            <div className="space-y-4">
              {modules.map((mod, modIdx) => (
                <div key={mod.moduleId} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => {
                        const updated = modules.map((m) =>
                          m.moduleId === mod.moduleId ? { ...m, title: e.target.value } : m
                        );
                        setModules(updated);
                      }}
                      className="font-bold text-sm text-slate-900 bg-transparent border-b border-dashed border-slate-400 focus:outline-none focus:border-sky-500"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveModuleForLesson(mod.moduleId)}
                        className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Lesson</span>
                      </button>
                      <button
                        onClick={() => handleDeleteModule(mod.moduleId)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Add Lesson inline form */}
                  {activeModuleForLesson === mod.moduleId && (
                    <div className="p-4 bg-sky-50/50 border-b border-slate-200 space-y-3">
                      <div className="text-xs font-bold text-sky-900">Add Video Lesson to {mod.title}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={newLessonTitle}
                          onChange={(e) => setNewLessonTitle(e.target.value)}
                          placeholder="Lesson Title (e.g. CSS Flexbox Layouts)"
                          className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none"
                        />
                        <input
                          type="text"
                          value={newLessonVideo}
                          onChange={(e) => setNewLessonVideo(e.target.value)}
                          placeholder="Video Embed URL (e.g. https://www.youtube.com/embed/...)"
                          className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none font-mono"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddLesson(mod.moduleId)}
                          className="px-3 py-1 bg-sky-600 text-white rounded text-xs font-bold"
                        >
                          Save Lesson
                        </button>
                        <button
                          onClick={() => setActiveModuleForLesson(null)}
                          className="px-3 py-1 text-slate-500 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lessons list */}
                  <div className="divide-y divide-slate-100">
                    {mod.lessons.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No lessons added yet in this module. Click "Add Lesson" above.
                      </div>
                    ) : (
                      mod.lessons.map((lesson) => (
                        <div
                          key={lesson.lessonId}
                          className="p-3.5 flex items-center justify-between hover:bg-slate-50/60"
                        >
                          <div className="flex items-center gap-3">
                            <Video className="w-4 h-4 text-sky-600" />
                            <div>
                              <div className="text-xs font-bold text-slate-800">{lesson.title}</div>
                              <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs">
                                {lesson.videoUrl}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-slate-500">{lesson.durationFormatted}</span>
                            <button
                              onClick={() => handleDeleteLesson(mod.moduleId, lesson.lessonId)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
