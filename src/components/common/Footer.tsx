import React from 'react';
import { Logo } from './Logo';
import { useLms } from '../../context/LmsContext';
import { Mail, Phone, MapPin, ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, categories, settings } = useLms();

  return (
    <footer className="no-print bg-[#0c1e38] text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="white" size="lg" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Zohaib Tech Rise LMS empowers students and working professionals with in-demand digital skills, certified by industry leaders and verified through digital credentials.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-md text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Industry Standard Curriculum</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-md text-xs text-slate-300">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Verified QR Credentials</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Explore LMS</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/courses')} className="hover:text-white transition-colors">
                  All Courses
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/certificate-verification')} className="hover:text-white transition-colors text-sky-400 font-medium">
                  Verify Certificate
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin/login')} className="hover:text-white transition-colors text-slate-400">
                  Admin Login
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
                  Help & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Categories</h4>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.categoryId}>
                  <button
                    onClick={() => navigate('/courses', { category: cat.slug })}
                    className="hover:text-white transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Campus & Support</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>{settings.address || 'Zohaib Tech Rise Learning Center, Islamabad, Pakistan'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>{settings.contactEmail || 'contact@zohaibtechrise.com'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>{settings.contactPhone || '+92 300 1234567'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Zohaib Tech Rise LMS. All rights reserved. Learn Today. Innovate Tomorrow.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/about')} className="hover:text-slate-300">Privacy Policy</button>
            <button onClick={() => navigate('/about')} className="hover:text-slate-300">Terms of Service</button>
            <button onClick={() => navigate('/certificate-verification')} className="hover:text-slate-300">Credential Registry</button>
            <button onClick={() => navigate('/admin/login')} className="hover:text-slate-300 text-sky-400 font-semibold">Admin Portal</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
