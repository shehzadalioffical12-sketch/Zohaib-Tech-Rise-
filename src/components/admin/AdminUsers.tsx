import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLms } from '../../context/LmsContext';
import { StorageService } from '../../services/storageService';
import { User, UserRole } from '../../types/lms';
import {
  Search,
  Shield,
  User as UserIcon,
  GraduationCap,
  ChevronLeft,
  Plus,
  CheckCircle,
  Ban,
  Award,
  HelpCircle,
  FileText,
  Settings,
  Users,
  Camera,
  X,
  Check,
  Upload,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { allUsers, refreshUsers } = useAuth();
  const { navigate, refreshData } = useLms();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [newProfileImage, setNewProfileImage] = useState('');

  // Profile Photo Upload / Replace / Remove Modal State
  const [userForPhoto, setUserForPhoto] = useState<User | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [photoUrlInput, setPhotoUrlInput] = useState<string>('');
  const [photoSuccessMsg, setPhotoSuccessMsg] = useState(false);

  const studentsCount = allUsers.filter((u) => u.role === 'student').length;
  const instructorsCount = allUsers.filter((u) => u.role === 'instructor').length;
  const adminsCount = allUsers.filter((u) => u.role === 'super_admin').length;

  const filteredUsers = allUsers.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  const handleToggleStatus = (uid: string) => {
    StorageService.toggleUserStatus(uid);
    refreshUsers();
  };

  const handleChangeRole = (uid: string, newR: UserRole) => {
    StorageService.updateUserRole(uid, newR);
    refreshUsers();
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail) return;
    const defaultAvatar = newProfileImage ||
      (newRole === 'instructor'
        ? '/assets/admin_zohaib.jpg'
        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newFullName)}&backgroundColor=0F2744`);

    StorageService.saveUser({
      uid: `user_${Date.now()}`,
      fullName: newFullName,
      email: newEmail,
      role: newRole,
      accountStatus: 'active',
      profileImage: defaultAvatar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    refreshUsers();
    setShowAddModal(false);
    setNewFullName('');
    setNewEmail('');
    setNewProfileImage('');
  };

  const openPhotoModal = (u: User) => {
    setUserForPhoto(u);
    const current = u.profileImage || '';
    setPhotoPreview(current);
    setPhotoUrlInput(current.startsWith('data:') ? '' : current);
    setPhotoSuccessMsg(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhotoPreview(base64);
        setPhotoUrlInput('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (!userForPhoto) return;
    const finalPhoto = photoPreview || photoUrlInput || undefined;
    StorageService.updateUserProfileImage(userForPhoto.uid, finalPhoto);
    refreshUsers();
    refreshData();
    setPhotoSuccessMsg(true);
    setTimeout(() => {
      setUserForPhoto(null);
      setPhotoSuccessMsg(false);
    }, 900);
  };

  const handleRemovePhoto = () => {
    if (!userForPhoto) return;
    const fallbackAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userForPhoto.fullName)}&backgroundColor=0284c7`;
    setPhotoPreview(fallbackAvatar);
    setPhotoUrlInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Accounts & Directory</h1>
              <p className="text-xs text-slate-500">
                Manage students, faculty instructors, profile photos, and credentials
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
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
            className="px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
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
            className="px-3 py-1.5 bg-slate-100 text-slate-900 font-bold rounded-lg flex items-center gap-1"
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

        {/* Directory Role Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              roleFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Accounts ({allUsers.length})
          </button>
          <button
            onClick={() => setRoleFilter('instructor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              roleFilter === 'instructor'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Instructors ({instructorsCount})</span>
          </button>
          <button
            onClick={() => setRoleFilter('student')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              roleFilter === 'student'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Students ({studentsCount})</span>
          </button>
          <button
            onClick={() => setRoleFilter('super_admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              roleFilter === 'super_admin'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Super Admins ({adminsCount})</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user by name or email..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredUsers.length}</strong> of {allUsers.length} total users
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Profile Photo</th>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const avatarSrc = user.profileImage ||
                    (user.role === 'instructor'
                      ? '/assets/admin_zohaib.jpg'
                      : user.role === 'student'
                      ? '/assets/student_ayesha.jpg'
                      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80');

                  return (
                    <tr key={user.uid} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div
                          onClick={() => openPhotoModal(user)}
                          className="relative group w-10 h-10 rounded-full overflow-hidden border border-slate-200 cursor-pointer shadow-2xs"
                          title="Click to Upload / Replace / Remove Photo"
                        >
                          <img
                            src={avatarSrc}
                            alt={user.fullName}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                            <Camera className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{user.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleChangeRole(user.uid, e.target.value as UserRole)}
                          className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white font-medium capitalize focus:outline-none"
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            user.accountStatus === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {user.accountStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                        {/* Requirement 3 & 4: Upload / replace / remove Instructor and Student profile photo */}
                        <button
                          onClick={() => openPhotoModal(user)}
                          className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                          title="Upload, Replace or Remove Profile Photo"
                        >
                          <Camera className="w-3 h-3" />
                          <span>Photo</span>
                        </button>

                        <button
                          onClick={() => handleToggleStatus(user.uid)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            user.accountStatus === 'active'
                              ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                              : 'text-emerald-600 hover:bg-emerald-50 border border-emerald-200'
                          }`}
                        >
                          {user.accountStatus === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: Profile Photo Upload / Replace / Remove for Instructor & Student */}
        {userForPhoto && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-sky-600" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {userForPhoto.role === 'instructor'
                      ? 'Manage Instructor Profile Photo'
                      : userForPhoto.role === 'student'
                      ? 'Manage Student Profile Photo'
                      : 'Manage Profile Photo'}
                  </h3>
                </div>
                <button
                  onClick={() => setUserForPhoto(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {photoSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Profile photo updated successfully!</span>
                </div>
              )}

              {/* Photo Preview */}
              <div className="flex flex-col items-center justify-center space-y-2 py-2">
                <div className="relative">
                  <img
                    src={photoPreview || photoUrlInput || userForPhoto.profileImage || '/assets/admin_zohaib.jpg'}
                    alt={userForPhoto.fullName}
                    className="w-28 h-28 rounded-full object-cover border-4 border-sky-500 shadow-md"
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-slate-900">{userForPhoto.fullName}</div>
                  <div className="text-[11px] text-slate-500 capitalize">{userForPhoto.role.replace('_', ' ')} · {userForPhoto.email}</div>
                </div>
              </div>

              {/* Upload controls */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Upload from Device
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Or Image URL
                  </label>
                  <input
                    type="text"
                    value={photoUrlInput}
                    onChange={(e) => {
                      setPhotoUrlInput(e.target.value);
                      setPhotoPreview(e.target.value);
                    }}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-mono text-xs"
                  />
                </div>

                {/* Quick Presets for Instructors & Students */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {userForPhoto.role === 'instructor' && (
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview('/assets/admin_zohaib.jpg');
                        setPhotoUrlInput('/assets/admin_zohaib.jpg');
                      }}
                      className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-[11px] font-semibold"
                    >
                      Use Engr. Zohaib Photo
                    </button>
                  )}

                  {userForPhoto.role === 'student' && (
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview('/assets/student_ayesha.jpg');
                        setPhotoUrlInput('/assets/student_ayesha.jpg');
                      }}
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-semibold"
                    >
                      Use Student Photo (Ayesha)
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Photo</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUserForPhoto(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePhoto}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Save Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Create New LMS User Account</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400">✕</button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    required
                    placeholder="e.g. Dr. Tariq Mahmood"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    placeholder="e.g. tariq@zohaibtechrise.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Account Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Profile Photo (Optional)</label>
                  <input
                    type="text"
                    value={newProfileImage}
                    onChange={(e) => setNewProfileImage(e.target.value)}
                    placeholder="https://... or leave blank for default avatar"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-1.5 text-slate-500 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-600 text-white rounded-lg font-bold"
                  >
                    Save User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
