'use client';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/Auth/AuthContext';

interface PermissionCache {
  permissions: any;
  userRole: string;
  timestamp: number;
  expiresIn: number; // milliseconds
}

const CACHE_KEY = 'employee_permissions_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const usePermissionCache = () => {
  const { permissions, userRole } = useAuth();
  const cacheRef = useRef<PermissionCache | null>(null);
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsedCache: PermissionCache = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache is still valid
        if (now - parsedCache.timestamp < parsedCache.expiresIn) {
          cacheRef.current = parsedCache;
        } else {
          // Cache expired, remove it
          localStorage.removeItem(CACHE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading permission cache:', error);
      localStorage.removeItem(CACHE_KEY);
    }
  }, []);
  
  // Update cache when permissions change
  useEffect(() => {
    if (permissions && userRole) {
      const newCache: PermissionCache = {
        permissions,
        userRole,
        timestamp: Date.now(),
        expiresIn: CACHE_DURATION,
      };
      
      cacheRef.current = newCache;
      
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
      } catch (error) {
        console.error('Error saving permission cache:', error);
      }
    }
  }, [permissions, userRole]);
  
  const clearCache = () => {
    cacheRef.current = null;
    localStorage.removeItem(CACHE_KEY);
  };
  
  const getCachedPermissions = () => {
    if (cacheRef.current) {
      const now = Date.now();
      if (now - cacheRef.current.timestamp < cacheRef.current.expiresIn) {
        return cacheRef.current;
      }
    }
    return null;
  };
  
  return {
    getCachedPermissions,
    clearCache,
    isCached: !!cacheRef.current,
  };
};

// Enhanced Auth Context with caching
export const useAuthWithCache = () => {
  const auth = useAuth();
  const { getCachedPermissions } = usePermissionCache();
  
  // If auth is loading, try to use cached permissions
  if (auth.isLoading) {
    const cached = getCachedPermissions();
    if (cached) {
      return {
        ...auth,
        permissions: cached.permissions,
        userRole: cached.userRole,
        isLoading: false,
        isCached: true,
      };
    }
  }
  
  return {
    ...auth,
    isCached: false,
  };
};
