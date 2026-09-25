import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storageService';
import {
  FileText,
  Upload,
  Download,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  ChevronLeft,
  Paperclip,
  Check
} from 'lucide-react';

export const StudentAssignmentPage: React.FC = () => {
  const { route, navigate, assignments, courses } = useLms();
  const { currentUser } = useAuth();

  const assignmentId = route.params?.assignmentId || 'assign_web_1';
  const assignment = assignments.find((a) => a.assignmentId === assignmentId) || assignments[0];
  const course = courses.find((c) => c.courseId === assignment?.courseId);

  const existingSubmission = currentUser
    ? StorageService.getSubmissions(currentUser.uid, assignment?.assignmentId)[0]
    : undefined;

  const [textAnswer, setTextAnswer] = useState(existingSubmission?.textAnswer || '');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string; size: string } | null>(
    existingSubmission?.fileUrls?.[0] || null
  );
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(
    existingSubmission?.status || null
  );

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        url: '#',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !assignment) return;

    const fileList = uploadedFile ? [uploadedFile] : [{ name: 'assignment_submission.zip', url: '#', size: '3.4 MB' }];
    StorageService.submitAssignment(
      assignment.assignmentId,
      currentUser.uid,
      assignment.courseId,
      textAnswer,
      fileList
    );
    setSubmittedStatus('submitted');
  };

  if (!assignment) {
    return <div className="p-12 text-center">Assignment not found.</div>;
  }

  const isGraded = existingSubmission?.status === 'graded';

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Breadcrumb Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/student')}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                {course?.title || 'Course Project'}
              </div>
              <h1 className="text-lg font-extrabold text-slate-900">{assignment.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Due: Oct 15, 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Max: {assignment.maxMarks} Marks</span>
            </div>
          </div>
        </div>

        {/* 2-Column Layout matching image #3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Instructions & Attachments (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Assignment Instructions</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {assignment.instructions}
              </p>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <div>• Allowed File Formats: <strong className="text-slate-700">{assignment.allowedFileTypes.join(', ')}</strong></div>
                <div>• Maximum File Size: <strong className="text-slate-700">{assignment.maxFileSizeMb} MB</strong></div>
                <div>• Passing Grade: <strong className="text-slate-700">{assignment.passingMarks} Marks ({((assignment.passingMarks/assignment.maxMarks)*100)}%)</strong></div>
              </div>
            </div>

            {/* Attachments Card */}
            {assignment.attachments && assignment.attachments.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Provided Project Attachments ({assignment.attachments.length})
                </h4>
                <div className="space-y-2">
                  {assignment.attachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-sky-600" />
                        <span className="font-semibold text-slate-800">{att.title}</span>
                        <span className="text-[10px] text-slate-400">({att.size})</span>
                      </div>
                      <button
                        onClick={() => {
                          const blob = new Blob([`Assignment Brief: ${att.title}\nZohaib Tech Rise LMS Course Assignment File`], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${att.title.replace(/\s+/g, '_')}.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="px-3 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg font-bold flex items-center gap-1 text-[11px]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* If Graded, show Instructor Review Card */}
            {isGraded && existingSubmission && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Graded by Instructor</span>
                  </div>
                  <div className="text-lg font-extrabold text-emerald-900">
                    {existingSubmission.marks} / {assignment.maxMarks} Marks
                  </div>
                </div>
                <div className="text-xs text-emerald-900 font-medium">Instructor Feedback:</div>
                <p className="text-xs text-emerald-800 bg-white/80 p-3 rounded-xl border border-emerald-200 leading-relaxed">
                  "{existingSubmission.feedback}"
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Submission Area (5 cols) matching image #3 */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Your Submission</h3>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                    submittedStatus === 'graded'
                      ? 'bg-emerald-100 text-emerald-800'
                      : submittedStatus === 'submitted' || submittedStatus === 'under_review'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {submittedStatus ? submittedStatus.replace('_', ' ') : 'Not Submitted'}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Drag & Drop File Upload Box */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Upload Solution File
                  </label>
                  <label className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-sky-50/30 transition-colors">
                    <input
                      type="file"
                      onChange={handleSimulatedFileUpload}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-2">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      {uploadedFile ? uploadedFile.name : 'Upload File'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Drag & drop or click to browse
                    </div>
                    <div className="text-[9px] text-slate-400 mt-1">
                      Supported: {assignment.allowedFileTypes.join(', ')} (Max {assignment.maxFileSizeMb}MB)
                    </div>
                  </label>
                </div>

                {/* Text Notes / Live Link */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student Notes / Live URL
                  </label>
                  <textarea
                    rows={4}
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="Provide explanatory notes, GitHub repository, or Google Drive link..."
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 text-slate-800"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{submittedStatus ? 'Update & Re-Submit' : 'Submit Assignment'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
