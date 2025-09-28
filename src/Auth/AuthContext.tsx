
'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getSession as getServerSession } from '@/app/lib/session';
import NetworkErrorBoundary from '@/components/NetworkErrorBoundary';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  userRole: string | null;
  permissions: any | null;
  isLoading: boolean;
  revalidate: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const validateSession = useCallback(async (retryCount = 0) => {
    setIsLoading(true);
    try {
      const session = await getServerSession();
      if (session && typeof session['username'] === 'string') {
        setIsAuthenticated(true);
        setUser(session['username']);
        setUserRole(session['role'] as string);
        setPermissions(session['permissions'] || null);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
        setPermissions(null);
      }
    } catch (e) {
      console.error('Session validation error:', e);

      // Retry logic for network errors
      if (retryCount < 2) {
        console.log(`Retrying session validation... (${retryCount + 1}/2)`);
        setTimeout(() => validateSession(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }

      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
      setPermissions(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    userRole,
    permissions,
    isLoading,
    revalidate: validateSession,
  };

  return (
    <NetworkErrorBoundary>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </NetworkErrorBoundary>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
