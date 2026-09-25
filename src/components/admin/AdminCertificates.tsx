import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storageService';
import { Certificate } from '../../types/lms';
import { CertificateView } from '../common/CertificateView';
import {
  Award,
  ShieldCheck,
  Search,
  ChevronLeft,
  Plus,
  Eye,
  Ban,
  Edit,
  Download,
  History,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Printer,
  HelpCircle,
  FileText,
  Settings,
  Users
} from 'lucide-react';

export const AdminCertificates: React.FC = () => {
  const { certificates, courses, refreshData, navigate } = useLms();
  const { allUsers, currentUser } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedCertForView, setSelectedCertForView] = useState<Certificate | null>(null);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [historyCert, setHistoryCert] = useState<Certificate | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);

  // Edit form state
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentEmail, setEditStudentEmail] = useState('');
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCompletionDate, setEditCompletionDate] = useState('');
  const [editIssueDate, setEditIssueDate] = useState('');
  const [editVerificationCode, setEditVerificationCode] = useState('');
  const [editMarks, setEditMarks] = useState<number>(95);
  const [editInstructorName, setEditInstructorName] = useState('');
  const [editSignatory, setEditSignatory] = useState('');
  const [editStatus, setEditStatus] = useState<'valid' | 'revoked' | 'corrected'>('valid');
  const [editReason, setEditReason] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // Manual issuance state
  const [selectedStudentId, setSelectedStudentId] = useState(
    allUsers.filter((u) => u.role === 'student')[0]?.uid || ''
  );
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.courseId || '');

  const filteredCerts = certificates.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.studentName.toLowerCase().includes(q) ||
      (c.studentEmail && c.studentEmail.toLowerCase().includes(q)) ||
      c.courseTitle.toLowerCase().includes(q) ||
      c.verificationCode.toLowerCase().includes(q)
    );
  });

  const openEditModal = (cert: Certificate) => {
    setEditingCert(cert);
    setEditStudentName(cert.studentName);
    setEditStudentEmail(cert.studentEmail || '');
    setEditCourseTitle(cert.courseTitle);
    setEditCompletionDate(cert.completionDate || cert.issueDate);
    setEditIssueDate(cert.issueDate);
    setEditVerificationCode(cert.verificationCode);
    setEditMarks(cert.completionScore || 95);
    setEditInstructorName(cert.instructorName);
    setEditSignatory(cert.authorizedSignatory || 'Admin Team Zohaib Tech Rise LMS');
    setEditStatus(cert.status);
    setEditReason('');
    setEditError(null);
  };

  const handleSaveCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    if (!editStudentName.trim() || !editCourseTitle.trim() || !editVerificationCode.trim()) {
      setEditError('Student Name, Course Title, and Certificate ID are required.');
      return;
    }

    const adminUser = currentUser || { uid: 'admin_1', fullName: 'Zohaib Ali' };

    const res = StorageService.updateCertificate(
      editingCert.certificateId,
      {
        studentName: editStudentName.trim(),
        studentEmail: editStudentEmail.trim(),
        courseTitle: editCourseTitle.trim(),
        completionDate: editCompletionDate.trim(),
        issueDate: editIssueDate.trim(),
        verificationCode: editVerificationCode.trim().toUpperCase(),
        completionScore: Number(editMarks),
        instructorName: editInstructorName.trim(),
        authorizedSignatory: editSignatory.trim(),
        status: editStatus
      },
      { uid: adminUser.uid, fullName: adminUser.fullName },
      editReason.trim() || 'Certificate information updated by Administrator'
    );

    if (res.success) {
      refreshData();
      setEditingCert(null);
    } else {
      setEditError(res.message);
    }
  };

  const handleManualIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCourseId) return;

    StorageService.issueCertificateIfEligible(selectedStudentId, selectedCourseId);
    refreshData();
    setShowIssueModal(false);
  };

  const handleQuickRevoke = (cert: Certificate) => {
    if (confirm(`Are you sure you want to revoke the certificate for ${cert.studentName} (${cert.verificationCode})?`)) {
      const adminUser = currentUser || { uid: 'admin_1', fullName: 'Zohaib Ali' };
      StorageService.revokeCertificate(cert.certificateId, { uid: adminUser.uid, fullName: adminUser.fullName }, 'Administrative revocation');
      refreshData();
    }
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
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Certificate Management & Registry
              </h1>
              <p className="text-xs text-slate-500">
                Audit, edit recipient details, verify QR codes, and reissue official credentials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/certificate-verification')}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-sky-600" />
              <span>Verification Portal</span>
            </button>
            <button
              onClick={() => setShowIssueModal(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Certificate</span>
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
            className="px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Courses Builder
          </button>
          <button
            onClick={() => navigate('/admin/certificates')}
            className="px-3 py-1.5 bg-amber-50 text-amber-800 font-bold rounded-lg flex items-center gap-1"
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

        {/* Search and Summary */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, email, course, or ID..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
            />
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span><strong>{filteredCerts.length}</strong> Total Records</span>
            <span>·</span>
            <span className="text-emerald-700 font-bold">{certificates.filter((c) => c.status === 'valid').length} Valid</span>
            <span>·</span>
            <span className="text-amber-700 font-bold">{certificates.filter((c) => c.status === 'corrected').length} Corrected</span>
            <span>·</span>
            <span className="text-rose-700 font-bold">{certificates.filter((c) => c.status === 'revoked').length} Revoked</span>
          </div>
        </div>

        {/* Certificates Table matching section 2 specifications */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Certificate ID</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Student Email</th>
                  <th className="py-3.5 px-4">Course Name</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCerts.map((c) => (
                  <tr key={c.certificateId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-900">
                      {c.verificationCode}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c.studentName}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{c.studentEmail || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium max-w-xs truncate">{c.courseTitle}</td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{c.issueDate}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          c.status === 'valid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : c.status === 'corrected'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => openEditModal(c)}
                        className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                        title="Edit Certificate Information"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setSelectedCertForView(c)}
                        className="px-2.5 py-1 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                        title="View Full Certificate Parchment"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => setSelectedCertForView(c)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 inline-block"
                        title="Download / Print PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => navigate('/certificate-verification', { id: c.verificationCode })}
                        className="p-1.5 text-emerald-600 hover:text-emerald-800 rounded hover:bg-emerald-50 inline-block"
                        title="Verify Certificate Online"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>

                      {c.editHistory && c.editHistory.length > 0 && (
                        <button
                          onClick={() => setHistoryCert(c)}
                          className="p-1.5 text-amber-600 hover:text-amber-800 rounded hover:bg-amber-50 inline-block"
                          title="View Edit History Audit Log"
                        >
                          <History className="w-4 h-4" />
                        </button>
                      )}

                      {c.status === 'valid' && (
                        <button
                          onClick={() => handleQuickRevoke(c)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 inline-block"
                          title="Revoke Certificate"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Certificate Modal */}
        {editingCert && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                    <Edit className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Edit Student Certificate</h3>
                    <p className="text-xs text-slate-500">ID: {editingCert.verificationCode}</p>
                  </div>
                </div>
                <button onClick={() => setEditingCert(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                  ✕
                </button>
              </div>

              {editError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                  {editError}
                </div>
              )}

              <form onSubmit={handleSaveCertificate} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      value={editStudentName}
                      onChange={(e) => setEditStudentName(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Student Email Address
                    </label>
                    <input
                      type="email"
                      value={editStudentEmail}
                      onChange={(e) => setEditStudentEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={editCourseTitle}
                    onChange={(e) => setEditCourseTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Completion Date
                    </label>
                    <input
                      type="text"
                      value={editCompletionDate}
                      onChange={(e) => setEditCompletionDate(e.target.value)}
                      placeholder="e.g. 25 September 2026"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Certificate Issue Date
                    </label>
                    <input
                      type="text"
                      value={editIssueDate}
                      onChange={(e) => setEditIssueDate(e.target.value)}
                      placeholder="e.g. 25 September 2026"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Marks / Grade %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editMarks}
                      onChange={(e) => setEditMarks(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Certificate ID (Unique Verification Code) *
                    </label>
                    <input
                      type="text"
                      value={editVerificationCode}
                      onChange={(e) => setEditVerificationCode(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono font-bold uppercase text-sky-900"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Used for online verification and QR code</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Certificate Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-bold"
                    >
                      <option value="valid">Valid (Active Verified)</option>
                      <option value="corrected">Corrected & Reissued</option>
                      <option value="revoked">Revoked (Invalidated)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Instructor Name (Signatory 1)
                    </label>
                    <input
                      type="text"
                      value={editInstructorName}
                      onChange={(e) => setEditInstructorName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Authorized Signatory (Signatory 2)
                    </label>
                    <input
                      type="text"
                      value={editSignatory}
                      onChange={(e) => setEditSignatory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Reason for Change (Logged in Audit Trail)
                  </label>
                  <input
                    type="text"
                    value={editReason}
                    onChange={(e) => setEditReason(e.target.value)}
                    placeholder="e.g. Corrected student surname spelling per CNIC document"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCertForView({
                        ...editingCert,
                        studentName: editStudentName,
                        courseTitle: editCourseTitle,
                        verificationCode: editVerificationCode,
                        completionDate: editCompletionDate,
                        issueDate: editIssueDate,
                        status: editStatus
                      });
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Updated Parchment</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingCert(null)}
                      className="px-4 py-2 text-slate-500 hover:text-slate-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-sm transition-colors"
                    >
                      Save Changes & Update Registry
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Audit History Modal */}
        {historyCert && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Certificate Audit History Log</h3>
                </div>
                <button onClick={() => setHistoryCert(null)} className="text-slate-400">✕</button>
              </div>

              <div className="text-xs text-slate-500">
                Certificate ID: <strong className="font-mono text-slate-900">{historyCert.verificationCode}</strong> ({historyCert.studentName})
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto">
                {!historyCert.editHistory || historyCert.editHistory.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No prior edits recorded. Original issuance unmodified.</div>
                ) : (
                  historyCert.editHistory.map((log, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>Edited by {log.editedByName}</span>
                        <span className="text-[10px] text-slate-400">{new Date(log.editedAt).toLocaleString()}</span>
                      </div>
                      <div className="text-slate-600 text-[11px]">Reason: {log.reason || 'None specified'}</div>
                      <div className="pt-1 border-t border-slate-200/60 font-mono text-[10px] text-slate-500">
                        {Object.entries(log.changes).map(([k, v]) => (
                          <div key={k}>
                            {k}: <span className="line-through text-rose-500">{String(v.oldVal)}</span> → <span className="text-emerald-600 font-bold">{String(v.newVal)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="text-right pt-2 border-t border-slate-100">
                <button
                  onClick={() => setHistoryCert(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Manual Certificate Issue */}
        {showIssueModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Issue New Certificate</h3>
                <button onClick={() => setShowIssueModal(false)} className="text-slate-400">✕</button>
              </div>

              <form onSubmit={handleManualIssue} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Select Student</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    {allUsers.filter((u) => u.role === 'student').map((s) => (
                      <option key={s.uid} value={s.uid}>
                        {s.fullName} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Select Course</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.courseId} value={c.courseId}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="px-3 py-1.5 text-slate-500 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-600 text-white rounded-lg font-bold"
                  >
                    Generate & Issue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Full Certificate Parchment Modal */}
        {selectedCertForView && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-4xl py-6 animate-in zoom-in-95">
              <CertificateView certificate={selectedCertForView} onClose={() => setSelectedCertForView(null)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
