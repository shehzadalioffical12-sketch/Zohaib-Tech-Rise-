import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/lms';
import { StorageService } from '../services/storageService';

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  switchRole: (role: UserRole) => void;
  login: (email: string) => { success: boolean; message?: string };
  register: (fullName: string, email: string) => { success: boolean; message?: string };
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isSuperAdmin: boolean;
  isInstructor: boolean;
  isStudent: boolean;
  allUsers: User[];
  refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const refreshUsers = () => {
    const users = StorageService.getUsers();
    setAllUsers(users);
  };

  useEffect(() => {
    refreshUsers();
    // Default to Muhammad Ali (student) or Engr. Zohaib Ali (super_admin) from stored user id
    const savedUserId = localStorage.getItem('taleem_lms_active_user_id');
    const users = StorageService.getUsers();
    if (savedUserId) {
      const found = users.find(u => u.uid === savedUserId);
      if (found) {
        setCurrentUser(found);
        return;
      }
    }
    // Default to student (Muhammad Ali) so preview immediately works smoothly
    const defaultStudent = users.find(u => u.uid === 'student_1') || users[0];
    setCurrentUser(defaultStudent);
  }, []);

  const switchRole = (role: UserRole) => {
    const users = StorageService.getUsers();
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      localStorage.setItem('taleem_lms_active_user_id', targetUser.uid);
    }
  };

  const login = (email: string): { success: boolean; message?: string } => {
    const user = StorageService.getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'No account found with this email address.' };
    }
    if (user.accountStatus === 'suspended') {
      return { success: false, message: 'This account has been suspended. Please contact administration.' };
    }
    setCurrentUser(user);
    localStorage.setItem('taleem_lms_active_user_id', user.uid);
    return { success: true };
  };

  const register = (fullName: string, email: string): { success: boolean; message?: string } => {
    const existing = StorageService.getUserByEmail(email);
    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }
    const newUser: User = {
      uid: `user_${Date.now()}`,
      fullName,
      email,
      role: 'student',
      accountStatus: 'active',
      profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=0284c7`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    StorageService.saveUser(newUser);
    refreshUsers();
    setCurrentUser(newUser);
    localStorage.setItem('taleem_lms_active_user_id', newUser.uid);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('taleem_lms_active_user_id');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = StorageService.saveUser({ ...currentUser, ...data });
    setCurrentUser(updated);
    refreshUsers();
  };

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isInstructor = currentUser?.role === 'instructor' || isSuperAdmin;
  const isStudent = currentUser?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        login,
        register,
        logout,
        updateProfile,
        isSuperAdmin,
        isInstructor,
        isStudent,
        allUsers,
        refreshUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
