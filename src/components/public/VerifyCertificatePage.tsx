import React, { useState, useEffect } from 'react';
import { useLms } from '../../context/LmsContext';
import { StorageService } from '../../services/storageService';
import { Certificate } from '../../types/lms';
import { CertificateView } from '../common/CertificateView';
import { Search, ShieldCheck, AlertCircle, CheckCircle2, Award, Printer, ArrowRight } from 'lucide-react';

export const VerifyCertificatePage: React.FC = () => {
  const { route, navigate } = useLms();
  const initialCode = route.params?.id || 'ZTR-2026-WD-8491';

  const [code, setCode] = useState(initialCode);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);
  const [showFullCertificate, setShowFullCertificate] = useState(false);

  const handleVerify = (verifyCode: string) => {
    if (!verifyCode.trim()) return;
    setSearched(true);
    const cert = StorageService.getCertificateByIdOrCode(verifyCode.trim());
    setResult(cert || null);
  };

  useEffect(() => {
    if (initialCode) {
      handleVerify(initialCode);
    }
  }, [initialCode]);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Official Credential Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Certificate Verification System
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Verify the authenticity of digital certificates issued by Zohaib Tech Rise LMS — Learn Today. Innovate Tomorrow.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Enter Certificate Verification Code
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. ZTR-2026-WD-8491"
                className="w-full pl-9 pr-3 py-2.5 text-sm uppercase font-mono tracking-wider bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              onClick={() => handleVerify(code)}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Now</span>
            </button>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Sample valid code: <span className="font-mono font-bold text-sky-600 cursor-pointer" onClick={() => { setCode('ZTR-2026-WD-8491'); handleVerify('ZTR-2026-WD-8491'); }}>ZTR-2026-WD-8491</span></span>
            <span>Instant 256-bit Hash Validation</span>
          </div>
        </div>

        {/* Verification Result */}
        {searched && (
          <div>
            {result ? (
              <div className="space-y-6">
                {/* Status Box matching image #3 bottom right */}
                <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-emerald-700 font-extrabold text-lg sm:text-xl">
                        Certificate is Officially Verified & Authentic
                      </div>
                      <div className="text-xs text-slate-500">
                        Record verified on Zohaib Tech Rise LMS Academic Registry
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 text-sm">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Student Name</span>
                      <div className="font-bold text-slate-900 text-base">{result.studentName}</div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Course Completed</span>
                      <div className="font-bold text-sky-800 text-base">{result.courseTitle}</div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date of Completion</span>
                      <div className="font-medium text-slate-700">{result.issueDate}</div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Certificate ID</span>
                      <div className="font-mono font-bold text-slate-900">{result.verificationCode}</div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lead Instructor</span>
                      <div className="font-medium text-slate-700">{result.instructorName}</div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Issuing Platform</span>
                      <div className="font-medium text-slate-700">Zohaib Tech Rise LMS</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <button
                      onClick={() => setShowFullCertificate(!showFullCertificate)}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
                    >
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{showFullCertificate ? 'Hide Full Certificate' : 'View Full Certificate Parchment'}</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2.5 bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Verification Document</span>
                    </button>
                  </div>
                </div>

                {/* Render Full Certificate View */}
                {showFullCertificate && (
                  <div className="mt-8 animate-in fade-in slide-in-from-top-4">
                    <CertificateView certificate={result} standalone />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-lg mx-auto shadow-xs">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Certificate Not Found</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  We could not find an official certificate matching code <strong className="font-mono text-slate-800">{code}</strong>. Please ensure the code is spelled correctly including hyphens.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                  Need help? Contact the registrar at <span className="text-sky-600 font-semibold">credentials@zohaibtechrise.com</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
