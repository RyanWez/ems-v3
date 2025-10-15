export interface NavigationState {
  isNavigating: boolean;
  progress: number;
  currentPath: string;
  previousPath: string | null;
}

export interface NavigationHistoryItem {
  path: string;
  title: string;
  timestamp: number;
  params?: Record<string, string>;
}

export interface NavigationTransition {
  from: string;
  to: string;
  direction: 'forward' | 'backward' | 'replace';
  duration: number;
}

export type NavigationDirection = 'forward' | 'backward' | 'replace';

export interface PrefetchOptions {
  priority?: 'high' | 'low';
  timeout?: number;
}

export interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean | PrefetchOptions;
  replace?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  'aria-label'?: string;
}