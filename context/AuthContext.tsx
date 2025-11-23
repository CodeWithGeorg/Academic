import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Models } from 'appwrite';
import { account, getUserRole } from '../services/appwrite';
import { UserRole } from '../constants';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  role: UserRole | null;
  loading: boolean;
  checkUserStatus: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUserStatus = async () => {
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
      
      // Fetch role from database
      const userRole = await getUserRole(accountDetails.$id);
      setRole(userRole);
    } catch (error) {
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
    setRole(null);
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, checkUserStatus, logout }}>
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