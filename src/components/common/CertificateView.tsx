import React from 'react';
import { Certificate } from '../../types/lms';
import { Logo } from './Logo';
import { Printer, ExternalLink, ShieldCheck, AlertTriangle, History } from 'lucide-react';
import { useLms } from '../../context/LmsContext';

interface CertificateViewProps {
  certificate: Certificate;
  onClose?: () => void;
  standalone?: boolean;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ certificate, onClose, standalone = false }) => {
  const { navigate, settings } = useLms();

  const handlePrint = () => {
    window.print();
  };

  const isRevoked = certificate.status === 'revoked';
  const isCorrected = certificate.status === 'corrected';

  return (
    <div className={`flex flex-col items-center ${standalone ? 'w-full' : 'max-w-4xl mx-auto'}`}>
      {/* Controls Bar (hidden during print) */}
      <div className="no-print w-full flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-xl mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
              isRevoked
                ? 'bg-rose-100 text-rose-600'
                : isCorrected
                ? 'bg-amber-100 text-amber-700'
                : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            {isRevoked ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                {isRevoked ? 'Revoked Certificate' : isCorrected ? 'Corrected & Reissued Certificate' : 'Official Verified Certificate'}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  isRevoked
                    ? 'bg-rose-100 text-rose-800'
                    : isCorrected
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {certificate.status}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              ID: {certificate.verificationCode} · Issued {certificate.issueDate}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/certificate-verification', { id: certificate.verificationCode })}
            className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Verify Online
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save as PDF
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Audit History Banner if certificate was edited */}
      {certificate.editHistory && certificate.editHistory.length > 0 && (
        <div className="no-print w-full max-w-[960px] mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
          <History className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block">Administrative Edit History Logged:</span>
            <span className="text-amber-800 text-[11px]">
              This certificate was modified on{' '}
              {new Date(certificate.editHistory[certificate.editHistory.length - 1].editedAt).toLocaleString()} by{' '}
              {certificate.editHistory[certificate.editHistory.length - 1].editedByName} (Reason:{' '}
              {certificate.editHistory[certificate.editHistory.length - 1].reason || 'Administrative update'}).
            </span>
          </div>
        </div>
      )}

      {/* The Printable Certificate Parchment - Landscape Container */}
      <div className="print-certificate-container w-full max-w-[960px] aspect-[1.414/1] bg-gradient-to-br from-[#0c1e38] via-[#091b30] to-[#040e1c] p-6 sm:p-10 rounded-2xl shadow-2xl relative overflow-hidden select-none border border-slate-800 text-slate-900">
        {/* Background Decorative Tech Elements & Navy/Gold Ribbons */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-sky-500/20 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-gradient-to-tr from-amber-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        {/* Outer Gold Border Accents */}
        <div className="absolute inset-3 sm:inset-5 border border-amber-400/40 rounded-xl pointer-events-none"></div>
        <div className="absolute inset-4 sm:inset-6 border-2 border-amber-300/60 rounded-lg pointer-events-none"></div>

        {/* Certificate White Parchment Interior */}
        <div className="relative w-full h-full bg-white/98 backdrop-blur-sm rounded-lg p-6 sm:p-10 flex flex-col justify-between shadow-lg border border-amber-200">
          {/* Corner Flourishes */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500"></div>
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500"></div>
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500"></div>
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500"></div>

          {/* Revoked Watermark Stamp if revoked */}
          {isRevoked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div className="border-8 border-rose-600/30 text-rose-600/30 text-6xl sm:text-8xl font-black uppercase tracking-widest px-8 py-4 rotate-[-25deg] rounded-3xl">
                REVOKED
              </div>
            </div>
          )}

          {/* Header Row: Official Zohaib Tech Rise LMS */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
            <Logo variant="full" size="md" />
            <div className="text-right">
              <div className="text-[11px] font-extrabold text-slate-900 tracking-wider uppercase">
                Zohaib Tech Rise LMS
              </div>
              <div className="text-[9px] font-semibold text-sky-600">
                Learn Today. Innovate Tomorrow.
              </div>
              <div className="text-[8px] text-slate-500 font-mono">Academic Registry ID: {certificate.verificationCode}</div>
            </div>
          </div>

          {/* Certificate Title & Presentation matching layout */}
          <div className="text-center my-auto py-2">
            <div className="font-serif-title text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-widest text-slate-900 uppercase drop-shadow-sm">
              Certificate
            </div>
            <div className="flex items-center justify-center gap-3 my-1">
              <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
              <span className="font-serif-title text-xs sm:text-sm tracking-[0.3em] font-semibold text-amber-600 uppercase">
                Of Completion
              </span>
              <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
            </div>

            <p className="text-[11px] sm:text-xs font-semibold tracking-widest text-slate-500 uppercase mt-2">
              This certificate is proudly presented to
            </p>

            {/* Recipient Full Name */}
            <div className="my-2 sm:my-3">
              <div className="font-script text-3xl sm:text-5xl lg:text-6xl text-sky-950 font-normal leading-tight px-4 inline-block">
                {certificate.studentName}
              </div>
              <div className="w-48 sm:w-72 h-0.5 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
              For successfully completing the comprehensive course curriculum in:
            </p>

            {/* Course Title */}
            <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-[#0F2744] tracking-tight mt-1 max-w-2xl mx-auto">
              {certificate.courseTitle}
            </h2>

            <p className="text-[10px] sm:text-xs text-slate-500 max-w-xl mx-auto mt-1 leading-relaxed">
              and has demonstrated the required practical skills, quizzes, and project competencies prescribed by Zohaib Tech Rise LMS.
            </p>

            <div className="mt-2 text-[10px] sm:text-xs font-semibold text-slate-700">
              Completion Date: <span className="font-bold text-slate-900">{certificate.completionDate || certificate.issueDate}</span>
              <span className="mx-2 text-slate-400">·</span>
              Certificate ID: <span className="font-mono font-bold text-sky-900">{certificate.verificationCode}</span>
            </div>
          </div>

          {/* Bottom Endorsement Bar */}
          <div className="grid grid-cols-3 items-end pt-3 border-t border-slate-200">
            {/* Left: Instructor Signature */}
            <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
              <div className="font-script text-2xl sm:text-3xl text-slate-800 -mb-1 transform -rotate-3">
                {certificate.instructorName}
              </div>
              <div className="w-32 sm:w-40 h-px bg-slate-400"></div>
              <div className="text-[11px] font-bold text-slate-900 mt-1">{certificate.instructorName}</div>
              <div className="text-[9px] text-slate-500">Course Lead Instructor</div>
            </div>

            {/* Center: Golden 3D Ribbon Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="absolute -bottom-4 w-7 h-10 bg-amber-700 rotate-12 -z-10 rounded-sm"></div>
                <div className="absolute -bottom-4 w-7 h-10 bg-amber-700 -rotate-12 -z-10 rounded-sm"></div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-1 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-amber-600/40 bg-gradient-to-b from-amber-500 to-amber-700 flex flex-col items-center justify-center text-center p-1 text-white shadow-inner">
                    <div className="text-[7px] sm:text-[8px] font-extrabold tracking-wider uppercase">Zohaib</div>
                    <div className="text-[6px] sm:text-[7px] font-bold tracking-widest text-amber-200">TECH RISE</div>
                    <div className="text-[8px] sm:text-[9px] font-extrabold uppercase mt-0.5 text-white">LMS</div>
                    <div className="text-[5px] text-amber-200 font-semibold">VERIFIED</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Admin Signature & QR Code */}
            <div className="flex items-center justify-end gap-3 text-right">
              <div className="flex flex-col items-end">
                <div className="font-script text-2xl sm:text-3xl text-slate-800 -mb-1 transform -rotate-1">
                  {certificate.authorizedSignatory || 'Admin Team'}
                </div>
                <div className="w-32 sm:w-36 h-px bg-slate-400"></div>
                <div className="text-[11px] font-bold text-slate-900 mt-1">
                  {certificate.authorizedSignatory || 'Admin Team'}
                </div>
                <div className="text-[9px] text-slate-500">Zohaib Tech Rise LMS</div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 p-1 bg-white border border-slate-300 rounded shadow-xs flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full" fill="#0F2744">
                    <rect x="10" y="10" width="30" height="30" fill="none" stroke="#0F2744" strokeWidth="6" />
                    <rect x="20" y="20" width="10" height="10" />
                    <rect x="60" y="10" width="30" height="30" fill="none" stroke="#0F2744" strokeWidth="6" />
                    <rect x="70" y="20" width="10" height="10" />
                    <rect x="10" y="60" width="30" height="30" fill="none" stroke="#0F2744" strokeWidth="6" />
                    <rect x="20" y="70" width="10" height="10" />
                    <rect x="50" y="20" width="6" height="20" />
                    <rect x="20" y="50" width="20" height="6" />
                    <rect x="50" y="50" width="10" height="10" />
                    <rect x="65" y="50" width="8" height="15" />
                    <rect x="50" y="70" width="15" height="8" />
                    <rect x="75" y="70" width="15" height="15" />
                  </svg>
                </div>
                <span className="text-[7px] text-slate-500 font-semibold tracking-tight mt-0.5">Scan to Verify</span>
              </div>
            </div>
          </div>

          {/* Micro Footer Bar */}
          <div className="flex items-center justify-between text-[8px] text-slate-400 pt-1 border-t border-slate-100 font-mono">
            <span>SKILLS · KNOWLEDGE · SUCCESS</span>
            <span>VERIFICATION CODE: {certificate.verificationCode}</span>
            <span>ZOHAIB TECH RISE LMS · OFFICIAL REGISTRY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
