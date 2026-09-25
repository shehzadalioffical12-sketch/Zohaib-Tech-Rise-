import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storageService';
import { Quiz, QuizQuestion, QuestionType, QuizAttempt } from '../../types/lms';
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Users,
  Clock,
  Award,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  FileCheck,
  Send,
  Save,
  Check,
  Settings,
  FileText,
  AlertCircle
} from 'lucide-react';

export const AdminQuizManager: React.FC = () => {
  const { quizzes, courses, refreshData, navigate } = useLms();
  const { allUsers } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');

  // Modals state
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [assigningQuiz, setAssigningQuiz] = useState<Quiz | null>(null);
  const [viewingAttemptsQuiz, setViewingAttemptsQuiz] = useState<Quiz | null>(null);
  const [gradingAttempt, setGradingAttempt] = useState<QuizAttempt | null>(null);

  // Form state for Quiz Create / Edit
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.courseId || '');
  const [instructions, setInstructions] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [passingPercentage, setPassingPercentage] = useState(70);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [randomizeAnswers, setRandomizeAnswers] = useState(false);
  const [availability, setAvailability] = useState<'all_enrolled' | 'selected_students'>('all_enrolled');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Question Builder Form state
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState<QuestionType>('multiple_choice');
  const [qOptions, setQOptions] = useState<string[]>(['Option 1', 'Option 2', 'Option 3', 'Option 4']);
  const [qCorrectAnswer, setQCorrectAnswer] = useState<string>('Option 1');
  const [qMarks, setQMarks] = useState<number>(5);
  const [qExplanation, setQExplanation] = useState<string>('');

  // Assign Student Selection State
  const [assignedStudents, setAssignedStudents] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState('');

  // Grading Modal State
  const [manualScores, setManualScores] = useState<Record<string, number>>({});
  const [gradingFeedback, setGradingFeedback] = useState('');
  const [quizFormError, setQuizFormError] = useState<string | null>(null);

  const filteredQuizzes = quizzes
    .filter((q) => (selectedCourseFilter === 'all' ? true : q.courseId === selectedCourseFilter))
    .filter((q) => {
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return q.title.toLowerCase().includes(term) || q.instructions.toLowerCase().includes(term);
    });

  const openCreateQuiz = () => {
    setEditingQuiz({} as Quiz);
    setTitle('');
    setDescription('');
    setCourseId(courses[0]?.courseId || '');
    setInstructions('Answer all questions within the allowed time limit.');
    setStartDate(new Date().toISOString().split('T')[0]);
    setDeadline(new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0]);
    setTimeLimitMinutes(15);
    setPassingPercentage(70);
    setMaxAttempts(3);
    setRandomizeQuestions(false);
    setRandomizeAnswers(false);
    setAvailability('all_enrolled');
    setStatus('published');
    setQuestions([
      {
        questionId: `q_${Date.now()}_1`,
        quizId: 'new',
        questionType: 'multiple_choice',
        questionText: 'What is the primary topic covered in this assessment?',
        options: ['Fundamentals', 'Advanced Theory', 'Practical Case Study', 'Summary'],
        correctAnswer: 'Fundamentals',
        marks: 5,
        explanation: 'Core fundamentals are essential.',
        order: 1
      }
    ]);
  };

  const openEditQuiz = (q: Quiz) => {
    setEditingQuiz(q);
    setTitle(q.title);
    setDescription(q.description || '');
    setCourseId(q.courseId);
    setInstructions(q.instructions);
    setStartDate(q.startDate ? q.startDate.split('T')[0] : '');
    setDeadline(q.deadline ? q.deadline.split('T')[0] : '');
    setTimeLimitMinutes(q.timeLimitMinutes);
    setPassingPercentage(q.passingPercentage);
    setMaxAttempts(q.maxAttempts);
    setRandomizeQuestions(q.randomizeQuestions ?? false);
    setRandomizeAnswers(q.randomizeAnswers ?? false);
    setAvailability(q.availability || 'all_enrolled');
    setStatus(q.status);
    setQuestions(q.questions || []);
  };

  const handleAddQuestion = () => {
    if (!qText.trim()) return;
    const newQ: QuizQuestion = {
      questionId: `q_${Date.now()}`,
      quizId: editingQuiz?.quizId || 'temp',
      questionType: qType,
      questionText: qText.trim(),
      options: qType === 'true_false' ? ['True', 'False'] : qOptions,
      correctAnswer: qType === 'true_false' ? (qCorrectAnswer === 'True' ? 'True' : 'False') : qCorrectAnswer,
      marks: Number(qMarks) || 5,
      explanation: qExplanation.trim(),
      order: questions.length + 1
    };
    setQuestions([...questions, newQ]);
    setQText('');
    setQExplanation('');
  };

  const handleDeleteQuestion = (qid: string) => {
    setQuestions(questions.filter((q) => q.questionId !== qid));
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    setQuizFormError(null);
    if (!title.trim() || questions.length === 0) {
      setQuizFormError('Please specify a quiz title and add at least one question.');
      return;
    }

    const quizId = editingQuiz?.quizId || `quiz_${Date.now()}`;
    const totalMarks = questions.reduce((acc, q) => acc + q.marks, 0);

    const savedQuiz: Quiz = {
      quizId,
      courseId,
      moduleId: 'mod_1',
      title: title.trim(),
      description: description.trim(),
      instructions: instructions.trim(),
      startDate,
      deadline,
      timeLimitMinutes: Number(timeLimitMinutes),
      passingPercentage: Number(passingPercentage),
      maxAttempts: Number(maxAttempts),
      totalMarks,
      randomizeQuestions,
      randomizeAnswers,
      availability,
      assignedStudentIds: editingQuiz?.assignedStudentIds || [],
      status,
      questions,
      createdAt: editingQuiz?.createdAt || new Date().toISOString()
    };

    StorageService.saveQuiz(savedQuiz, true);
    refreshData();
    setEditingQuiz(null);
  };

  const openAssignModal = (q: Quiz) => {
    setAssigningQuiz(q);
    setAssignedStudents(q.assignedStudentIds || []);
  };

  const handleSaveAssignments = () => {
    if (!assigningQuiz) return;
    const updatedQuiz: Quiz = {
      ...assigningQuiz,
      availability: assignedStudents.length > 0 ? 'selected_students' : 'all_enrolled',
      assignedStudentIds: assignedStudents
    };
    StorageService.saveQuiz(updatedQuiz, true);
    refreshData();
    setAssigningQuiz(null);
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      StorageService.deleteQuiz(quizId);
      refreshData();
    }
  };

  const allStudents = allUsers.filter((u) => u.role === 'student');

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quiz Management System</h1>
              <p className="text-xs text-slate-500">Create timed assessments, assign to student groups, and review auto-graded results</p>
            </div>
          </div>

          <button
            onClick={openCreateQuiz}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Quiz</span>
          </button>
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
            className="px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors"
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
            className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg flex items-center gap-1"
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

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes by title or keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter Course:</span>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            >
              <option value="all">All Courses</option>
              {courses.map((c) => (
                <option key={c.courseId} value={c.courseId}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quizzes Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Quiz Title</th>
                  <th className="py-3.5 px-4">Course</th>
                  <th className="py-3.5 px-4">Questions</th>
                  <th className="py-3.5 px-4">Time Limit</th>
                  <th className="py-3.5 px-4">Passing %</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQuizzes.map((quiz) => {
                  const course = courses.find((c) => c.courseId === quiz.courseId);
                  const attempts = StorageService.getQuizAttempts(undefined, quiz.quizId);

                  return (
                    <tr key={quiz.quizId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{quiz.title}</div>
                        <div className="text-[10px] text-slate-400">Total Marks: {quiz.totalMarks || 20}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium max-w-xs truncate">
                        {course?.title || 'General'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {quiz.questions?.length || 0}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {quiz.timeLimitMinutes} mins
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        {quiz.passingPercentage}%
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-semibold text-slate-600">
                          {quiz.availability === 'selected_students'
                            ? `${quiz.assignedStudentIds?.length || 0} Students`
                            : 'All Enrolled'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            quiz.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {quiz.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => openEditQuiz(quiz)}
                          className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg font-semibold inline-flex items-center gap-1"
                          title="Edit Quiz & Questions"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => openAssignModal(quiz)}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-semibold inline-flex items-center gap-1"
                          title="Assign to Students"
                        >
                          <Users className="w-3 h-3" />
                          <span>Assign</span>
                        </button>

                        <button
                          onClick={() => setViewingAttemptsQuiz(quiz)}
                          className="px-2.5 py-1 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg font-semibold inline-flex items-center gap-1"
                          title="View Attempts & Scores"
                        >
                          <FileCheck className="w-3 h-3" />
                          <span>Attempts ({attempts.length})</span>
                        </button>

                        <button
                          onClick={() => handleDeleteQuiz(quiz.quizId)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete Quiz"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Quiz Builder & Question Editor */}
        {editingQuiz && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {editingQuiz.quizId ? 'Edit Quiz & Questions' : 'Create New Assessment'}
                    </h3>
                    <p className="text-xs text-slate-500">Configure parameters and question items</p>
                  </div>
                </div>
                <button onClick={() => setEditingQuiz(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveQuiz} className="space-y-5 text-xs">
                {quizFormError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{quizFormError}</span>
                  </div>
                )}
                {/* Basic Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Quiz Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Web Development Quiz 1"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Course *</label>
                    <select
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    >
                      {courses.map((c) => (
                        <option key={c.courseId} value={c.courseId}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Instructions</label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Time Limit (mins)</label>
                    <input
                      type="number"
                      min="1"
                      value={timeLimitMinutes}
                      onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Passing %</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={passingPercentage}
                      onChange={(e) => setPassingPercentage(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Max Attempts</label>
                    <input
                      type="number"
                      min="1"
                      value={maxAttempts}
                      onChange={(e) => setMaxAttempts(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-bold"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                {/* Randomization toggles */}
                <div className="flex items-center gap-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={randomizeQuestions}
                      onChange={(e) => setRandomizeQuestions(e.target.checked)}
                      className="w-4 h-4 text-sky-600 rounded"
                    />
                    <span>Randomize Question Order</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={randomizeAnswers}
                      onChange={(e) => setRandomizeAnswers(e.target.checked)}
                      className="w-4 h-4 text-sky-600 rounded"
                    />
                    <span>Randomize Answer Options</span>
                  </label>
                </div>

                {/* Question Builder Header */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-extrabold text-slate-900 text-sm">Questions in this Quiz ({questions.length})</h4>
                    <span className="text-[11px] font-mono text-slate-500">
                      Total Points: {questions.reduce((a, q) => a + q.marks, 0)}
                    </span>
                  </div>

                  {/* List of existing questions */}
                  <div className="space-y-2 mb-4">
                    {questions.map((q, idx) => (
                      <div key={q.questionId} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-900">
                            {idx + 1}. {q.questionText}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Type: <span className="capitalize">{q.questionType.replace('_', ' ')}</span> · Marks: {q.marks} · Correct: <span className="font-semibold text-emerald-700">{String(q.correctAnswer)}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(q.questionId)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Question Card */}
                  <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-200 space-y-3">
                    <div className="font-bold text-sky-900 text-xs">Add Question Item</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={qText}
                          onChange={(e) => setQText(e.target.value)}
                          placeholder="Question statement (e.g. Which HTML tag defines a table?)"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <select
                          value={qType}
                          onChange={(e) => setQType(e.target.value as QuestionType)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        >
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="true_false">True or False</option>
                          <option value="short_answer">Short Answer</option>
                        </select>
                      </div>
                    </div>

                    {qType === 'multiple_choice' && (
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-600">Answer Options & Select Correct:</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {qOptions.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="correct_option"
                                checked={qCorrectAnswer === opt}
                                onChange={() => setQCorrectAnswer(opt)}
                                className="w-3.5 h-3.5 text-sky-600"
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...qOptions];
                                  updated[optIdx] = e.target.value;
                                  if (qCorrectAnswer === opt) setQCorrectAnswer(e.target.value);
                                  setQOptions(updated);
                                }}
                                className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded text-xs"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {qType === 'true_false' && (
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                          <input
                            type="radio"
                            name="tf_correct"
                            checked={qCorrectAnswer === 'True'}
                            onChange={() => setQCorrectAnswer('True')}
                          />
                          <span>Correct: True</span>
                        </label>
                        <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                          <input
                            type="radio"
                            name="tf_correct"
                            checked={qCorrectAnswer === 'False'}
                            onChange={() => setQCorrectAnswer('False')}
                          />
                          <span>Correct: False</span>
                        </label>
                      </div>
                    )}

                    {qType === 'short_answer' && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Model Answer / Keyword Match:</label>
                        <input
                          type="text"
                          value={qCorrectAnswer}
                          onChange={(e) => setQCorrectAnswer(e.target.value)}
                          placeholder="e.g. <table>"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-600">Marks:</span>
                        <input
                          type="number"
                          min="1"
                          value={qMarks}
                          onChange={(e) => setQMarks(Number(e.target.value))}
                          className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-center font-bold text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="px-3 py-1.5 bg-sky-600 text-white rounded-lg font-bold text-xs hover:bg-sky-500"
                      >
                        + Append Question
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingQuiz(null)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-xs"
                  >
                    Save & Publish Quiz
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Assign Quiz to Students (Searchable Checkbox Selection) */}
        {assigningQuiz && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Assign Quiz to Students</h3>
                  <p className="text-xs text-slate-500">{assigningQuiz.title}</p>
                </div>
                <button onClick={() => setAssigningQuiz(null)} className="text-slate-400">✕</button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Filter student by name or email..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                <span>Selected: {assignedStudents.length} Students</span>
                <button
                  type="button"
                  onClick={() =>
                    setAssignedStudents(
                      assignedStudents.length === allStudents.length ? [] : allStudents.map((s) => s.uid)
                    )
                  }
                  className="text-sky-600 font-bold hover:underline"
                >
                  {assignedStudents.length === allStudents.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
                {allStudents
                  .filter((s) => {
                    if (!studentSearch.trim()) return true;
                    const q = studentSearch.toLowerCase();
                    return s.fullName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
                  })
                  .map((student) => {
                    const isChecked = assignedStudents.includes(student.uid);
                    return (
                      <label
                        key={student.uid}
                        className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAssignedStudents([...assignedStudents, student.uid]);
                              } else {
                                setAssignedStudents(assignedStudents.filter((id) => id !== student.uid));
                              }
                            }}
                            className="w-4 h-4 text-sky-600 rounded"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{student.fullName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{student.email}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 capitalize">{student.accountStatus}</span>
                      </label>
                    );
                  })}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setAssigningQuiz(null)}
                  className="px-4 py-2 text-xs text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAssignments}
                  className="px-5 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-sky-500"
                >
                  Confirm & Notify Students
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: View Quiz Attempts & Results */}
        {viewingAttemptsQuiz && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Student Attempts & Scores</h3>
                  <p className="text-xs text-slate-500">{viewingAttemptsQuiz.title}</p>
                </div>
                <button onClick={() => setViewingAttemptsQuiz(null)} className="text-slate-400">✕</button>
              </div>

              {(() => {
                const attempts = StorageService.getQuizAttempts(undefined, viewingAttemptsQuiz.quizId);
                if (attempts.length === 0) {
                  return (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No attempts recorded for this quiz yet.
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {attempts.map((att) => {
                      const student = StorageService.getUserById(att.studentId);
                      return (
                        <div
                          key={att.attemptId}
                          className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-slate-900">{student?.fullName || 'Student'}</div>
                            <div className="text-[11px] text-slate-500">
                              Submitted: {new Date(att.submittedAt || att.startedAt).toLocaleDateString()}
                            </div>
                            <div className="text-[11px] mt-0.5">
                              Score: <strong className="text-slate-900">{att.score} / {att.totalMarks}</strong> ({att.percentage}%)
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                att.status === 'passed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : att.status === 'failed'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {att.status.replace('_', ' ')}
                            </span>

                            {att.status === 'pending_review' && (
                              <button
                                onClick={() => {
                                  setGradingAttempt(att);
                                  setGradingFeedback(att.feedback || 'Good attempt on short answers.');
                                }}
                                className="px-3 py-1 bg-amber-600 text-white font-bold rounded-lg text-[11px]"
                              >
                                Review & Grade
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              <div className="text-right pt-2 border-t border-slate-100">
                <button
                  onClick={() => setViewingAttemptsQuiz(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
