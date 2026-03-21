import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  username: string;
  displayName: string;
}

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const VALID_CREDENTIALS = { username: 'admin', password: 'admin123', displayName: 'Admin User' };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string) => {
    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
      setUser({ username, displayName: VALID_CREDENTIALS.displayName });
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
