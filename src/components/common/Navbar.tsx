import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLms } from '../../context/LmsContext';
import { Logo } from './Logo';
import {
  Bell,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Shield,
  GraduationCap,
  BookOpen,
  Award,
  ChevronDown,
  Lock
} from 'lucide-react';
import { UserRole } from '../../types/lms';

export const Navbar: React.FC = () => {
  const { currentUser, logout, switchRole, isSuperAdmin, isInstructor, isStudent } = useAuth();
  const { route, navigate, notifications, unreadNotificationsCount } = useLms();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const getDashboardPath = () => {
    if (isSuperAdmin) return '/admin';
    if (currentUser?.role === 'instructor') return '/instructor';
    return '/student';
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' },
    { label: 'About Us', path: '/about' },
    { label: 'Verify Certificate', path: '/certificate-verification' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner with Official Branding */}
      <div className="bg-[#0F2744] text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-sky-900/40">
        <div className="flex items-center gap-2">
          <span className="text-sky-300 font-extrabold uppercase text-[10px] tracking-wider">
            Zohaib Tech Rise LMS
          </span>
          <span className="hidden sm:inline text-slate-400">·</span>
          <span className="hidden sm:inline text-slate-300 text-[11px] font-medium">
            Learn Today. Innovate Tomorrow.
          </span>
        </div>

        {/* Quick Role Switcher */}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[10px] text-slate-300 hidden md:inline">Test Role:</span>
          <button
            onClick={() => switchRole('student')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              currentUser?.role === 'student'
                ? 'bg-sky-500 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            🎓 Student Portal
          </button>
          <button
            onClick={() => switchRole('instructor')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              currentUser?.role === 'instructor'
                ? 'bg-sky-500 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            👨‍🏫 Instructor
          </button>
          <button
            onClick={() => switchRole('super_admin')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              currentUser?.role === 'super_admin'
                ? 'bg-sky-500 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            🛡️ Super Admin
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="cursor-pointer transition-opacity hover:opacity-95"
          >
            <Logo variant="full" size="md" />
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = route.path === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`text-sm font-semibold transition-colors ${
                    isActive ? 'text-sky-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Notifications & User Menu / Login */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-sky-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Notifications</span>
                        <span className="text-xs text-slate-500">{notifications.length} recent</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">No notifications yet.</div>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <div
                              key={n.notificationId}
                              onClick={() => {
                                if (n.link) navigate(n.link);
                                setNotifDropdownOpen(false);
                              }}
                              className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                                !n.read ? 'bg-sky-50/50' : ''
                              }`}
                            >
                              <div className="font-semibold text-slate-800 flex items-center justify-between">
                                <span>{n.title}</span>
                                {!n.read && <span className="w-2 h-2 rounded-full bg-sky-500"></span>}
                              </div>
                              <p className="text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard Shortcut Button */}
                <button
                  onClick={() => navigate(getDashboardPath())}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-sky-400" />
                  <span>
                    {isSuperAdmin
                      ? 'Admin Dashboard'
                      : currentUser.role === 'instructor'
                      ? 'Instructor Portal'
                      : 'My Learning'}
                  </span>
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <img
                      src={currentUser.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={currentUser.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div className="hidden md:block text-left text-xs">
                      <div className="font-bold text-slate-800 truncate max-w-[120px]">{currentUser.fullName}</div>
                      <div className="text-[10px] text-sky-600 font-semibold capitalize">{currentUser.role.replace('_', ' ')}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="text-xs font-bold text-slate-800">{currentUser.fullName}</div>
                        <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                      </div>

                      <button
                        onClick={() => {
                          navigate(getDashboardPath());
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        Dashboard
                      </button>

                      {isSuperAdmin && (
                        <button
                          onClick={() => {
                            navigate('/admin/certificates');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Award className="w-4 h-4 text-slate-500" />
                          Manage Certificates
                        </button>
                      )}

                      {isStudent && (
                        <>
                          <button
                            onClick={() => {
                              navigate('/student/courses');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <BookOpen className="w-4 h-4 text-slate-500" />
                            My Enrolled Courses
                          </button>
                          <button
                            onClick={() => {
                              navigate('/student/certificates');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Award className="w-4 h-4 text-slate-500" />
                            My Certificates
                          </button>
                        </>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate('/admin/login')}
                  className="px-3 py-1.5 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Admin</span>
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition-all"
                >
                  Join Free
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 text-sm font-semibold rounded-md ${
                  route.path === link.path ? 'bg-sky-50 text-sky-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => {
                navigate('/admin/login');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-sky-600" />
              <span>Admin Portal Login</span>
            </button>

            {currentUser && (
              <button
                onClick={() => {
                  navigate(getDashboardPath());
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-bold text-white bg-slate-900 rounded-md"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
