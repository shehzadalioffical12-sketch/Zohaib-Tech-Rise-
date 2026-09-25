import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLms } from '../../context/LmsContext';
import { Certificate } from '../../types/lms';
import { CertificateView } from '../common/CertificateView';
import { Award, ShieldCheck, Printer, ExternalLink, Copy, Check, ChevronLeft } from 'lucide-react';

export const StudentCertificates: React.FC = () => {
  const { currentUser } = useAuth();
  const { certificates, navigate } = useLms();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!currentUser) return null;

  const myCertificates = certificates.filter((c) => c.studentId === currentUser.uid);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/certificate-verification?id=${code}`);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/student')}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Official Certificates</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Verifiable digital credentials issued by Zohaib Tech Rise LMS — Learn Today. Innovate Tomorrow.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/certificate-verification')}
            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Public Verification Desk</span>
          </button>
        </div>

        {/* Certificates Grid */}
        {myCertificates.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto shadow-xs">
            <Award className="w-16 h-16 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Certificates Earned Yet</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Complete all required video lessons, pass the module quizzes, and submit your course assignments to automatically unlock your official certificate!
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="mt-6 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Resume Learning
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myCertificates.map((cert) => (
              <div
                key={cert.certificateId}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Verified Credential
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">{cert.verificationCode}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">{cert.courseTitle}</h3>
                    <div className="text-xs text-slate-500 mt-1">Issued to: <strong className="text-slate-800">{cert.studentName}</strong></div>
                    <div className="text-xs text-slate-500">Date of Completion: <strong className="text-slate-700">{cert.issueDate}</strong></div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Instructor: <strong>{cert.instructorName}</strong></span>
                    <span className="text-emerald-600 font-bold">Grade: 95%</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>View / Print</span>
                  </button>

                  <button
                    onClick={() => handleCopy(cert.verificationCode)}
                    className="px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    {copiedId === cert.verificationCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Share Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certificate Fullscreen / Print Modal */}
        {selectedCert && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-4xl py-6 animate-in zoom-in-95">
              <CertificateView certificate={selectedCert} onClose={() => setSelectedCert(null)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
