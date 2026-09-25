import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { StorageService } from '../../services/storageService';
import {
  Settings,
  Shield,
  Save,
  Server,
  Key,
  Video,
  Award,
  Globe,
  CheckCircle2,
  ChevronLeft,
  FileCode,
  Check,
  Lock,
  UserCheck,
  AlertCircle,
  HelpCircle,
  FileText,
  Users
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, navigate } = useLms();

  const [lmsName, setLmsName] = useState(settings.lmsName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [institutionName, setInstitutionName] = useState(settings.institutionName);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [address, setAddress] = useState(settings.address);
  const [videoProvider, setVideoProvider] = useState(settings.videoProvider);
  const [videoThreshold, setVideoThreshold] = useState(settings.videoWatchedThresholdPercent || 80);
  const [signingInstructor, setSigningInstructor] = useState(settings.certificateSigningInstructor || 'Engr. Zohaib Ali');
  const [signingAdmin, setSigningAdmin] = useState(settings.certificateSigningAdmin || 'Admin Team Zohaib Tech Rise LMS');

  const [activeTab, setActiveTab] = useState<'general' | 'certificate' | 'video' | 'firebase' | 'security'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Security & Password state (ONLY New Password & Confirm New Password per requirements)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      lmsName,
      tagline,
      institutionName,
      contactEmail,
      contactPhone,
      address,
      videoProvider,
      videoWatchedThresholdPercent: Number(videoThreshold),
      certificateSigningInstructor: signingInstructor,
      certificateSigningAdmin: signingAdmin
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match. Please re-enter.' });
      return;
    }

    const success = StorageService.updateAdminPassword(newPassword);
    if (success) {
      setPasswordMsg({ type: 'success', text: 'Master Administrator password successfully updated!' });
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMsg({ type: 'error', text: 'Failed to update password.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Settings & Configuration</h1>
              <p className="text-xs text-slate-500">Configure platform branding, certificates, admin security, and video delivery</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Settings Saved' : 'Save Changes'}</span>
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
            className="px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-amber-800 font-bold"
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
            className="px-3 py-1.5 bg-sky-50 text-sky-700 font-bold rounded-lg ml-auto flex items-center gap-1"
          >
            <Settings className="w-3.5 h-3.5 text-sky-600" />
            <span>Settings</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'general' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Institution & Branding
            {activeTab === 'general' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600"></span>}
          </button>

          <button
            onClick={() => setActiveTab('certificate')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'certificate' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Certificate Configuration
            {activeTab === 'certificate' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600"></span>}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'security' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Security & Passwords
            {activeTab === 'security' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600"></span>}
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'video' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Video Provider & Rules
            {activeTab === 'video' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600"></span>}
          </button>

          <button
            onClick={() => setActiveTab('firebase')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'firebase' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Firebase & Cloud Rules
            {activeTab === 'firebase' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600"></span>}
          </button>
        </div>

        {/* Tab 1: General & Branding */}
        {activeTab === 'general' && (
          <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  LMS Platform Name
                </label>
                <input
                  type="text"
                  value={lmsName}
                  onChange={(e) => setLmsName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Support Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Campus / Headquarters Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Certificate Config */}
        {activeTab === 'certificate' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Lead Instructor Signatory Title
                </label>
                <input
                  type="text"
                  value={signingInstructor}
                  onChange={(e) => setSigningInstructor(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Appears on bottom-left of certificate</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Admin Team / Registrar Signatory
                </label>
                <input
                  type="text"
                  value={signingAdmin}
                  onChange={(e) => setSigningAdmin(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Appears on bottom-right of certificate</span>
              </div>
            </div>

            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-1 text-xs text-sky-900">
              <strong className="block">Certificate Security & Verification Features:</strong>
              <div>• Instant QR-code public verification linking to <code>/certificate-verification?id=...</code></div>
              <div>• Unique alphanumeric hash generation per course completion</div>
              <div>• Full high-resolution printable parchment with gold ribbon & seal matching Zohaib Tech Rise LMS standards</div>
            </div>
          </div>
        )}

        {/* Tab 3: Security & Passwords */}
        {activeTab === 'security' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Super Admin Password & Security Controls</h3>
                <p className="text-xs text-slate-500">Safeguard executive access with protected password management</p>
              </div>
            </div>

            {passwordMsg && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {passwordMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                )}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (minimum 6 characters)"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Shield className="w-4 h-4 text-sky-400" />
                <span>Update Master Password</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Video Provider */}
        {activeTab === 'video' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Default Video Delivery Service
              </label>
              <select
                value={videoProvider}
                onChange={(e) => setVideoProvider(e.target.value as any)}
                className="w-full sm:w-80 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              >
                <option value="youtube">YouTube Embed (Recommended for zero-cost hosting)</option>
                <option value="vimeo">Vimeo Player (Private/Domain-restricted video)</option>
                <option value="bunny">Bunny Stream (Dedicated low-cost CDN)</option>
                <option value="custom">Custom HTML5 / MP4 Self-Hosted</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Lesson Completion Threshold Percentage
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={videoThreshold}
                  onChange={(e) => setVideoThreshold(Number(e.target.value))}
                  className="w-28 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-bold"
                />
                <span className="text-xs text-slate-500">% of video duration must be watched before completion</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Firebase & Cloud Rules */}
        {activeTab === 'firebase' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Cloud Firestore & Security Integration</h3>
                <p className="text-xs text-slate-500">Zero-Trust Attribute Based Access Control (ABAC) Rules</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>
                  <strong>Security Rules Configured:</strong> <code>firestore.rules</code> and <code>firebase-blueprint.json</code> are configured in the codebase with full collection schemas.
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Configured Firestore Collections:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-slate-700">
                  <span className="bg-slate-100 p-2 rounded">/users/{'{userId}'}</span>
                  <span className="bg-slate-100 p-2 rounded">/courses/{'{courseId}'}</span>
                  <span className="bg-slate-100 p-2 rounded">/modules/{'{moduleId}'}</span>
                  <span className="bg-slate-100 p-2 rounded">/lessons/{'{lessonId}'}</span>
                  <span className="bg-slate-100 p-2 rounded">/enrollments/{'{enrollmentId}'}</span>
                  <span className="bg-slate-100 p-2 rounded">/certificates/{'{certId}'}</span>
                  <span className="bg-slate-100 p-2 rounded">/quizzes/{'{quizId}'}</span>
                  <span className="bg-slate-100 p-2 rounded">/assignments/{'{assignId}'}</span>
                  <span className="bg-slate-100 p-2 rounded">/siteSettings</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="font-bold text-slate-800 block mb-1">Environment Variables:</span>
                <p className="text-slate-500 text-[11px]">
                  When connecting a live Firebase project, provide your credentials in <code>.env</code> or inject into runtime config.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
