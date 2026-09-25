import React from 'react';
import { useLms } from '../../context/LmsContext';
import { ShieldCheck, Award, Users, BookOpen, MapPin, Mail, Phone } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useLms();

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">About Our Learning Platform</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Zohaib Tech Rise LMS
          </h1>
          <p className="text-base font-semibold text-sky-600">
            Learn Today. Innovate Tomorrow.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Pioneering accessible, industry-relevant higher learning and vocational digital skill development across Pakistan and globally.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Our Academic Mission</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To bridge the gap between academic theory and industry reality by providing modern, project-based digital courses that enable youth, women, and professionals to excel globally.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">National Accreditation & Standards</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our curriculum follows rigorous educational guidelines aligned with the Higher Education Commission (HEC) and international technical frameworks, ensuring valid, verifiable credentialing.
            </p>
          </div>
        </div>

        {/* Leadership & Faculty */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Academic Leadership</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                alt="Engr. Zohaib Ali"
                className="w-16 h-16 rounded-full object-cover border-2 border-sky-500"
              />
              <div>
                <h4 className="font-bold text-sm text-slate-900">Engr. Zohaib Ali</h4>
                <div className="text-xs text-sky-600 font-semibold">Founder & Head of Academic Tech</div>
                <div className="text-[11px] text-slate-500 mt-1">Lead Software Architect & Educator</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                alt="Fatima Zahra"
                className="w-16 h-16 rounded-full object-cover border-2 border-sky-500"
              />
              <div>
                <h4 className="font-bold text-sm text-slate-900">Fatima Zahra</h4>
                <div className="text-xs text-sky-600 font-semibold">Director of Multimedia Studies</div>
                <div className="text-[11px] text-slate-500 mt-1">Commercial Video Producer & Colorist</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
