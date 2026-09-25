import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLms } from '../../context/LmsContext';
import { Logo } from '../common/Logo';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchRole } = useAuth();
  const { navigate } = useLms();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    const res = login(email);
    if (res.success) {
      navigate('/student');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  const handleQuickLogin = (role: 'student' | 'instructor' | 'super_admin', targetEmail: string) => {
    switchRole(role);
    if (role === 'super_admin') navigate('/admin');
    else if (role === 'instructor') navigate('/instructor');
    else navigate('/student');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="flex justify-center cursor-pointer" onClick={() => navigate('/')}>
          <Logo variant="full" size="lg" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back!</h2>
        <p className="text-xs text-slate-500">Sign in to access your courses, quizzes, and certificates</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-lg rounded-2xl border border-slate-200 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setResetMessage('A password recovery verification code has been dispatched to your email address.')}
                  className="text-xs text-sky-600 hover:text-sky-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {resetMessage && (
                <div className="mb-2 p-2.5 bg-sky-50 border border-sky-200 rounded-lg text-xs text-sky-800">
                  {resetMessage}
                </div>
              )}
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>
          </form>

          {/* Quick Demo Sign In Panel for instant evaluation */}
          <div className="pt-4 border-t border-slate-100">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center mb-2.5">
              1-Click Demo Accounts
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('student', 'ali@example.com')}
                className="p-2 border border-slate-200 rounded-lg text-center hover:bg-sky-50 hover:border-sky-300 transition-colors"
              >
                <div className="text-[11px] font-bold text-slate-800">Student</div>
                <div className="text-[9px] text-slate-500">Muhammad Ali</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('instructor', 'zohaib.ali@zohaibtechrise.com')}
                className="p-2 border border-slate-200 rounded-lg text-center hover:bg-sky-50 hover:border-sky-300 transition-colors"
              >
                <div className="text-[11px] font-bold text-slate-800">Instructor</div>
                <div className="text-[9px] text-slate-500">Zohaib Ali</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('super_admin', 'admin@zohaibtechrise.com')}
                className="p-2 border border-slate-200 rounded-lg text-center hover:bg-sky-50 hover:border-sky-300 transition-colors"
              >
                <div className="text-[11px] font-bold text-slate-800">Super Admin</div>
                <div className="text-[9px] text-slate-500">Engr. Zohaib</div>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')} className="text-sky-600 font-bold hover:underline">
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
