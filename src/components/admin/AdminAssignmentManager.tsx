import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storageService';
import { Assignment, AssignmentSubmission } from '../../types/lms';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
  Award,
  ChevronLeft,
  Search,
  CheckCircle2,
  Upload,
  Download,
  Paperclip,
  Check,
  HelpCircle,
  Settings
} from 'lucide-react';

export const AdminAssignmentManager: React.FC = () => {
  const { assignments, courses, submissions, refreshData, navigate } = useLms();
  const { allUsers, currentUser } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');

  // Modals state
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [assigningAssignment, setAssigningAssignment] = useState<Assignment | null>(null);
  const [reviewingAssignment, setReviewingAssignment] = useState<Assignment | null>(null);
  const [activeGradingSub, setActiveGradingSub] = useState<AssignmentSubmission | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.courseId || '');
  const [instructions, setInstructions] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);
  const [passingMarks, setPassingMarks] = useState(60);
  const [allowedFileTypes, setAllowedFileTypes] = useState('.zip, .pdf, .docx, .mp4');
  const [maxFileSizeMb, setMaxFileSizeMb] = useState(50);
  const [submissionType, setSubmissionType] = useState<'both' | 'file' | 'text'>('both');
  const [latePolicy, setLatePolicy] = useState<'allow' | 'disallow'>('allow');
  const [status, setStatus] = useState<'draft' | 'published'>('published');

  // Student selection state
  const [assignedStudents, setAssignedStudents] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState('');

  // Grading form state
  const [gradeMarks, setGradeMarks] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState('Excellent practical implementation!');

  const allStudents = allUsers.filter((u) => u.role === 'student');

  const filteredAssignments = assignments
    .filter((a) => (selectedCourseFilter === 'all' ? true : a.courseId === selectedCourseFilter))
    .filter((a) => {
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return a.title.toLowerCase().includes(term) || a.instructions.toLowerCase().includes(term);
    });

  const openCreateAssignment = () => {
    setEditingAssignment({} as Assignment);
    setTitle('');
    setCourseId(courses[0]?.courseId || '');
    setInstructions('Complete the project specifications and upload your solution archive or document.');
    setStartDate(new Date().toISOString().split('T')[0]);
    setDueDate(new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString().split('T')[0]);
    setMaxMarks(100);
    setPassingMarks(60);
    setAllowedFileTypes('.zip, .pdf, .docx, .mp4');
    setMaxFileSizeMb(50);
    setSubmissionType('both');
    setLatePolicy('allow');
    setStatus('published');
  };

  const openEditAssignment = (a: Assignment) => {
    setEditingAssignment(a);
    setTitle(a.title);
    setCourseId(a.courseId);
    setInstructions(a.instructions);
    setStartDate(a.startDate ? a.startDate.split('T')[0] : '');
    setDueDate(a.dueDate ? a.dueDate.split('T')[0] : '');
    setMaxMarks(a.maxMarks);
    setPassingMarks(a.passingMarks);
    setAllowedFileTypes(a.allowedFileTypes.join(', '));
    setMaxFileSizeMb(a.maxFileSizeMb);
    setSubmissionType(a.submissionType || 'both');
    setLatePolicy((a.lateSubmissionPolicy as any) || 'allow');
    setStatus(a.status);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignmentId = editingAssignment?.assignmentId || `assign_${Date.now()}`;
    const parsedTypes = allowedFileTypes.split(',').map((t) => t.trim());

    const saved: Assignment = {
      assignmentId,
      courseId,
      moduleId: 'mod_1',
      title: title.trim(),
      instructions: instructions.trim(),
      startDate,
      dueDate,
      maxMarks: Number(maxMarks),
      passingMarks: Number(passingMarks),
      allowedFileTypes: parsedTypes,
      maxFileSizeMb: Number(maxFileSizeMb),
      submissionType,
      lateSubmissionPolicy: latePolicy,
      assignedType: editingAssignment?.assignedType || 'all_enrolled',
      assignedStudentIds: editingAssignment?.assignedStudentIds || [],
      status,
      createdAt: editingAssignment?.createdAt || new Date().toISOString()
    };

    StorageService.saveAssignment(saved, true);
    refreshData();
    setEditingAssignment(null);
  };

  const openAssignModal = (a: Assignment) => {
    setAssigningAssignment(a);
    setAssignedStudents(a.assignedStudentIds || []);
  };

  const handleSaveAssignments = () => {
    if (!assigningAssignment) return;
    const updated: Assignment = {
      ...assigningAssignment,
      assignedType: assignedStudents.length > 0 ? 'selected_students' : 'all_enrolled',
      assignedStudentIds: assignedStudents
    };
    StorageService.saveAssignment(updated, true);
    refreshData();
    setAssigningAssignment(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      StorageService.deleteAssignment(id);
      refreshData();
    }
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGradingSub) return;
    const adminUser = currentUser || { uid: 'admin_1', fullName: 'Zohaib Ali' };
    StorageService.gradeSubmission(activeGradingSub.submissionId, gradeMarks, gradeFeedback, adminUser.uid);
    refreshData();
    setActiveGradingSub(null);
  };

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
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Assignment Management System</h1>
              <p className="text-xs text-slate-500">
                Publish practical projects, assign to specific cohorts, and review student file uploads
              </p>
            </div>
          </div>

          <button
            onClick={openCreateAssignment}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
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
            className="px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quiz Management</span>
          </button>
          <button
            onClick={() => navigate('/admin/assignments')}
            className="px-3 py-1.5 bg-sky-50 text-sky-700 font-bold rounded-lg flex items-center gap-1"
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
              placeholder="Search assignments by title or keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Course:</span>
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

        {/* Assignments Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Assignment Title</th>
                  <th className="py-3.5 px-4">Course</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Marks</th>
                  <th className="py-3.5 px-4">Assigned To</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssignments.map((a) => {
                  const course = courses.find((c) => c.courseId === a.courseId);
                  const relatedSubs = submissions.filter((s) => s.assignmentId === a.assignmentId);

                  return (
                    <tr key={a.assignmentId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {a.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium max-w-xs truncate">
                        {course?.title || 'General'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {new Date(a.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {a.maxMarks} (Pass: {a.passingMarks})
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-semibold text-slate-600">
                          {a.assignedType === 'selected_students'
                            ? `${a.assignedStudentIds?.length || 0} Students`
                            : 'All Enrolled'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            a.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => openEditAssignment(a)}
                          className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg font-semibold inline-flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => openAssignModal(a)}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-semibold inline-flex items-center gap-1"
                        >
                          <Users className="w-3 h-3" />
                          <span>Assign</span>
                        </button>

                        <button
                          onClick={() => setReviewingAssignment(a)}
                          className="px-2.5 py-1 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg font-semibold inline-flex items-center gap-1"
                        >
                          <span>Submissions ({relatedSubs.length})</span>
                        </button>

                        <button
                          onClick={() => handleDelete(a.assignmentId)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
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

        {/* Modal: Create / Edit Assignment */}
        {editingAssignment && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    {editingAssignment.assignmentId ? 'Edit Assignment' : 'Create Assignment'}
                  </h3>
                </div>
                <button onClick={() => setEditingAssignment(null)} className="text-slate-400">✕</button>
              </div>

              <form onSubmit={handleSaveAssignment} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Portfolio Website Project"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Due Date *</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Detailed Instructions</label>
                  <textarea
                    rows={4}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Max Marks</label>
                    <input
                      type="number"
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Pass Marks</label>
                    <input
                      type="number"
                      value={passingMarks}
                      onChange={(e) => setPassingMarks(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Max MB Size</label>
                    <input
                      type="number"
                      value={maxFileSizeMb}
                      onChange={(e) => setMaxFileSizeMb(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Allowed File Types</label>
                  <input
                    type="text"
                    value={allowedFileTypes}
                    onChange={(e) => setAllowedFileTypes(e.target.value)}
                    placeholder=".zip, .pdf, .docx, .mp4"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingAssignment(null)}
                    className="px-4 py-2 text-slate-500 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-sky-600 text-white rounded-xl font-bold shadow-xs hover:bg-sky-500"
                  >
                    Save & Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Assign to Students */}
        {assigningAssignment && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Assign Project to Students</h3>
                  <p className="text-xs text-slate-500">{assigningAssignment.title}</p>
                </div>
                <button onClick={() => setAssigningAssignment(null)} className="text-slate-400">✕</button>
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
                  onClick={() => setAssigningAssignment(null)}
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

        {/* Modal: Submissions Review & Grading */}
        {reviewingAssignment && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Student Submissions</h3>
                  <p className="text-xs text-slate-500">{reviewingAssignment.title}</p>
                </div>
                <button onClick={() => setReviewingAssignment(null)} className="text-slate-400">✕</button>
              </div>

              {(() => {
                const related = submissions.filter((s) => s.assignmentId === reviewingAssignment.assignmentId);
                if (related.length === 0) {
                  return (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No submissions received for this assignment yet.
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {related.map((sub) => {
                      const student = StorageService.getUserById(sub.studentId);
                      return (
                        <div
                          key={sub.submissionId}
                          className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-bold text-slate-900">{student?.fullName || 'Student'}</div>
                              <div className="text-[11px] text-slate-500">
                                Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                              </div>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                sub.status === 'graded'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {sub.status.replace('_', ' ')}
                            </span>
                          </div>

                          <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                            {sub.textAnswer || 'No written response provided.'}
                          </p>

                          {sub.fileUrls && sub.fileUrls.length > 0 && (
                            <div className="flex items-center gap-2">
                              {sub.fileUrls.map((f, i) => (
                                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700">
                                  <Paperclip className="w-3.5 h-3.5 text-sky-600" />
                                  <span>{f.name} ({f.size})</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                            <span className="font-bold text-slate-700">
                              {sub.marks !== undefined ? `Score: ${sub.marks} / ${reviewingAssignment.maxMarks}` : 'Ungraded'}
                            </span>
                            <button
                              onClick={() => {
                                setActiveGradingSub(sub);
                                setGradeMarks(sub.marks || 90);
                                setGradeFeedback(sub.feedback || 'Great practical solution submitted!');
                              }}
                              className="px-3.5 py-1.5 bg-sky-600 text-white rounded-lg font-bold text-xs hover:bg-sky-500"
                            >
                              {sub.status === 'graded' ? 'Update Grade' : 'Grade Submission'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              <div className="text-right pt-2 border-t border-slate-100">
                <button
                  onClick={() => setReviewingAssignment(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Grade Single Submission */}
        {activeGradingSub && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Assign Marks & Feedback</h3>
                <button onClick={() => setActiveGradingSub(null)} className="text-slate-400">✕</button>
              </div>

              <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Marks Awarded (out of {reviewingAssignment?.maxMarks || 100})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={reviewingAssignment?.maxMarks || 100}
                    value={gradeMarks}
                    onChange={(e) => setGradeMarks(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Feedback</label>
                  <textarea
                    rows={3}
                    value={gradeFeedback}
                    onChange={(e) => setGradeFeedback(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveGradingSub(null)}
                    className="px-3 py-1.5 text-slate-500 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-xs hover:bg-emerald-500"
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
