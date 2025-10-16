
'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getSession as getServerSession } from '@/app/lib/session';
import NetworkErrorBoundary from '@/components/NetworkErrorBoundary';
import type { AuthContextType, Permission, LogoutResponse } from '@/types/auth';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const validateSession = useCallback(async (retryCount = 0) => {
    setIsLoading(true);
    try {
      const session = await getServerSession();
      if (session && typeof session['username'] === 'string') {
        setIsAuthenticated(true);
        setUser(session['username']);
        setUserRole(session['role'] as string);
        setPermissions((session['permissions'] as Permission) || null);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
        setPermissions(null);
      }
    } catch (error) {
      console.error('Session validation error:', error);

      // Better error handling with user-friendly messages
      const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
      
      if (retryCount < 2 && isNetworkError) {
        console.log(`Retrying session validation... (${retryCount + 1}/2)`);
        toast.error(`Connection issue. Retrying... (${retryCount + 1}/2)`);
        setTimeout(() => validateSession(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }

      if (retryCount >= 2) {
        toast.error('Unable to verify session. Please check your connection and try again.');
      }

      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
      setPermissions(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Call logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: LogoutResponse = await response.json();

      if (response.ok && result.success) {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
        setPermissions(null);
        toast.success(result.message || 'Logged out successfully');
        
        // Redirect to login page
        window.location.href = '/login';
      } else {
        const errorMessage = 'error' in result ? result.error : 'Logout failed';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
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
    logout,
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
