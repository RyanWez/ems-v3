'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface NavigationHistoryItem {
  path: string;
  title: string;
  timestamp: number;
}

interface UseNavigationHistoryReturn {
  history: NavigationHistoryItem[];
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
  clearHistory: () => void;
  addToHistory: (path: string, title?: string) => void;
  currentIndex: number;
}

const MAX_HISTORY_SIZE = 50;

export const useNavigationHistory = (): UseNavigationHistoryReturn => {
  const pathname = usePathname();
  const router = useRouter();
  const [history, setHistory] = useState<NavigationHistoryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Get page title from route
  const getPageTitle = useCallback((path: string): string => {
    const routeTitles: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/dashboard/employee-management/lists': 'Employee Lists',
      '/dashboard/employee-management/birthday': 'Employee Birthday',
      '/dashboard/employee-management/leave': 'Annual Leave',
      '/dashboard/user-management/list': 'User List',
      '/dashboard/user-management/roles': 'User Roles',
      '/dashboard/system-management/broadcast': 'Broadcast',
      '/dashboard/system-management/logs': 'View System Logs',
    };
    return routeTitles[path] || path.split('/').pop()?.replace('-', ' ') || 'Page';
  }, []);

  // Add to history
  const addToHistory = useCallback((path: string, title?: string) => {
    const pageTitle = title || getPageTitle(path);
    const newItem: NavigationHistoryItem = {
      path,
      title: pageTitle,
      timestamp: Date.now(),
    };

    setHistory(prev => {
      // Remove any items after current index (when navigating from middle of history)
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Don't add if it's the same as the last item
      if (newHistory.length > 0 && newHistory[newHistory.length - 1].path === path) {
        return newHistory;
      }

      // Add new item
      newHistory.push(newItem);

      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
        setCurrentIndex(prev => Math.max(0, prev - 1));
      } else {
        setCurrentIndex(newHistory.length - 1);
      }

      return newHistory;
    });
  }, [currentIndex, getPageTitle]);

  // Track pathname changes
  useEffect(() => {
    if (pathname) {
      addToHistory(pathname);
    }
  }, [pathname, addToHistory]);

  // Navigation functions
  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const targetPath = history[newIndex].path;
      setCurrentIndex(newIndex);
      router.push(targetPath);
    }
  }, [currentIndex, history, router]);

  const goForward = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      const targetPath = history[newIndex].path;
      setCurrentIndex(newIndex);
      router.push(targetPath);
    }
  }, [currentIndex, history, router]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      // Find current path in history
      const pathIndex = history.findIndex(item => item.path === pathname);
      if (pathIndex !== -1) {
        setCurrentIndex(pathIndex);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [history, pathname]);

  return {
    history,
    canGoBack: currentIndex > 0,
    canGoForward: currentIndex < history.length - 1,
    goBack,
    goForward,
    clearHistory,
    addToHistory,
    currentIndex,
  };
};