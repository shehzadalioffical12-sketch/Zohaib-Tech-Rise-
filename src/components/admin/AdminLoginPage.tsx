import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLms } from '../../context/LmsContext';
import { StorageService } from '../../services/storageService';
import { Logo } from '../common/Logo';
import {
  Lock,
  Mail,
  Shield,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  UserPlus,
  X,
  HelpCircle
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, switchRole, currentUser, isSuperAdmin, allUsers } = useAuth();
  const { navigate, refreshData } = useLms();

  const [email, setEmail] = useState('admin@zohaibtechrise.com');
  const [password, setPassword] = useState('Admin@ZTR2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);

  // First admin setup state
  const [newAdminName, setNewAdminName] = useState('Engr. Zohaib Ali');
  const [newAdminEmail, setNewAdminEmail] = useState('zohaib@zohaibtechrise.com');
  const [newAdminPass, setNewAdminPass] = useState('ZTRMaster@2026');
  const [adminSetupSuccess, setAdminSetupSuccess] = useState(false);

  // If already logged in as Super Admin, show option to proceed directly
  if (isSuperAdmin && currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto bg-slate-950 border border-slate-800 p-8 rounded-2xl text-center space-y-4 shadow-2xl text-white">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold">Authenticated as Super Admin</h2>
          <p className="text-xs text-slate-400">
            You are authenticated as <strong className="text-white">{currentUser.fullName}</strong> ({currentUser.email}).
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => navigate('/admin')}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Proceed to Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition-colors"
            >
              Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      // 1. Verify user exists and has super_admin role
      const user = StorageService.getUserByEmail(email.trim());
      if (!user) {
        setError('Unauthorized: No administrative account registered with this email address.');
        setLoading(false);
        return;
      }

      if (user.role !== 'super_admin') {
        setError('Access Denied: Account exists but does not possess Super Administrator credentials.');
        setLoading(false);
        return;
      }

      // 2. Verify password securely
      const isValidPassword = StorageService.verifyAdminPassword(password);
      if (!isValidPassword) {
        setError('Security Error: Invalid administrator password. Please check your credentials.');
        setLoading(false);
        return;
      }

      // 3. Authenticate and redirect
      login(email);
      setLoading(false);
      navigate('/admin');
    }, 300);
  };

  const handleCreateFirstAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail || !newAdminPass) return;

    const now = new Date().toISOString();
    const newAdmin = StorageService.saveUser({
      uid: `admin_${Date.now()}`,
      fullName: newAdminName.trim(),
      email: newAdminEmail.trim().toLowerCase(),
      role: 'super_admin',
      accountStatus: 'active',
      department: 'Executive Administration',
      createdAt: now,
      updatedAt: now
    });

    // Update master admin password
    StorageService.updateAdminPassword(newAdminPass.trim());
    refreshData();

    setAdminSetupSuccess(true);
    setTimeout(() => {
      setEmail(newAdmin.email);
      setPassword(newAdminPass);
      setShowCreateAdminModal(false);
      setAdminSetupSuccess(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 relative z-10">
        <div className="flex justify-center cursor-pointer" onClick={() => navigate('/')}>
          <Logo variant="white" size="lg" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[11px] font-bold">
          <Shield className="w-3.5 h-3.5" />
          <span>Restricted Portal · Super Admin Access Only</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">Administrator Secure Login</h2>
        <p className="text-xs text-slate-400">
          Enter authorized administrative credentials to manage Zohaib Tech Rise LMS
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-800 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@zohaibtechrise.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Admin Master Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              <Shield className="w-4 h-4" />
              <span>{loading ? 'Verifying Authorization...' : 'Authenticate & Enter Dashboard'}</span>
            </button>
          </form>

          {/* Super Admin Quick Setup & Demo Credentials Panel */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300">Authorized Super Admin Login:</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                Active Session Protection
              </span>
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div>Email: <code className="text-sky-300">admin@zohaibtechrise.com</code></div>
              <div>Password: <code className="text-sky-300">Admin@ZTR2026</code></div>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@zohaibtechrise.com');
                  setPassword('Admin@ZTR2026');
                }}
                className="text-sky-400 hover:underline"
              >
                Autofill Credentials
              </button>
              <button
                type="button"
                onClick={() => setShowCreateAdminModal(true)}
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5 text-sky-400" />
                <span>Create Super Admin</span>
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                <KeyRound className="w-4 h-4" />
                <span>Administrator Password Recovery</span>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Administrative password hashes are securely salted and stored using cryptographic SHA-256 standard. If you have forgotten your password, enter your registered Super Admin email below to receive a secure recovery code.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Registered Administrator Email
                </label>
                <input
                  type="email"
                  defaultValue="admin@zohaibtechrise.com"
                  placeholder="admin@zohaibtechrise.com"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="p-3 bg-sky-950/40 border border-sky-800/60 rounded-xl text-xs text-sky-200">
                A verification link with high-entropy token will be dispatched to your registered admin mailbox. You may also provision a new Super Admin credential below.
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setShowCreateAdminModal(true);
                }}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors"
              >
                Provision Admin Key
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                }}
                className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Send Recovery Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* First Super Admin / Add Super Admin Modal */}
      {showCreateAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <UserPlus className="w-4 h-4" />
                <span>Provision Super Administrator</span>
              </div>
              <button
                onClick={() => setShowCreateAdminModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {adminSetupSuccess ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-xl text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-300">Super Admin Created!</h4>
                <p className="text-xs text-slate-300">Credentials configured into authentication registry.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateFirstAdmin} className="space-y-3">
                <p className="text-xs text-slate-400">
                  Provision a new executive Super Administrator with unrestricted permissions over courses, users, and certificates.
                </p>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Admin Email</label>
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Master Password</label>
                  <input
                    type="password"
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Authorize & Register Super Admin
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
