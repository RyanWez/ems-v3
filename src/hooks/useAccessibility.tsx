import { useCallback, useEffect, useRef, useState, useMemo } from 'react';

// Constants for better maintainability
const ANNOUNCEMENT_DURATION = 1000;
const WCAG_AA_CONTRAST_RATIO = 4.5;
const WCAG_AAA_CONTRAST_RATIO = 7.0;
const DEBOUNCE_DELAY = 100;

// Enhanced type definitions
interface UseAccessibilityOptions {
  announceChanges?: boolean;
  focusManagement?: boolean;
  keyboardNavigation?: boolean;
  announcementDuration?: number;
  debounceDelay?: number;
}

interface SkipLinkProps {
  href: string;
  className: string;
  children: string;
  onFocus: () => void;
}

interface ColorContrastResult {
  ratio: number;
  isAA: boolean;
  isAAA: boolean;
  level: 'AA' | 'AAA' | 'FAIL';
}

interface KeyboardNavigationOptions {
  wrapAround?: boolean;
  orientation?: 'vertical' | 'horizontal' | 'grid';
  gridSize?: number;
}

// Utility functions
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  const [, r, g, b] = result;
  if (!r || !g || !b) return null;

  return {
    r: parseInt(r, 16),
    g: parseInt(g, 16),
    b: parseInt(b, 16)
  };
};

const getLuminance = (color: string): number => {
  // Handle hex colors
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    if (!rgb) return 0.5; // fallback for invalid hex

    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      if (typeof c !== 'number') return 0;
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    if (typeof rs !== 'number' || typeof gs !== 'number' || typeof bs !== 'number') {
      return 0.5;
    }

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  // Handle named colors and rgb values (simplified)
  // In production, use a proper color parsing library
  return 0.5; // fallback
};

/**
 * Enhanced accessibility hook providing comprehensive accessibility features
 * for React applications with improved performance and error handling.
 *
 * @param options - Configuration options for accessibility features
 * @returns Object containing accessibility utilities and state
 *
 * @example
 * ```tsx
 * const { announce, setFocus, handleKeyNavigation } = useAccessibility({
 *   announceChanges: true,
 *   focusManagement: true,
 *   keyboardNavigation: true
 * });
 * ```
 */
export function useAccessibility(options: UseAccessibilityOptions = {}) {
  const {
    announceChanges = true,
    focusManagement = true,
    keyboardNavigation = true,
    announcementDuration = ANNOUNCEMENT_DURATION,
    debounceDelay = DEBOUNCE_DELAY
  } = options;

  const [announcements, setAnnouncements] = useState<string[]>([]);
  const focusRef = useRef<HTMLElement | null>(null);
  const announcementTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Debounced announcement function to prevent spam
  const debouncedAnnounce = useMemo(
    () => debounce((message: string) => {
      if (!announceChanges || !message.trim()) return;

      setAnnouncements(prev => [...prev, message]);

      // Clear announcement after specified duration
      const timeoutId = setTimeout(() => {
        setAnnouncements(prev => prev.filter(msg => msg !== message));
        announcementTimeouts.current.delete(message);
      }, announcementDuration);

      announcementTimeouts.current.set(message, timeoutId);
    }, debounceDelay),
    [announceChanges, announcementDuration, debounceDelay]
  );

  /**
   * Announces a message to screen readers with specified priority
   * @param message - The message to announce
   * @param priority - Announcement priority ('polite' or 'assertive')
   */
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!message?.trim()) {
      console.warn('useAccessibility: Cannot announce empty message');
      return;
    }

    debouncedAnnounce(message);
  }, [debouncedAnnounce]);

  /**
   * Sets focus to a specific element with proper error handling
   * @param element - The element to focus
   */
  const setFocus = useCallback((element: HTMLElement | null) => {
    if (!focusManagement) return;

    if (!element) {
      console.warn('useAccessibility: Cannot set focus to null/undefined element');
      return;
    }

    try {
      focusRef.current = element;
      element.focus();

      // Ensure the element can receive focus
      if (document.activeElement !== element) {
        console.warn('useAccessibility: Element could not receive focus');
      }
    } catch (error) {
      console.error('useAccessibility: Error setting focus:', error);
    }
  }, [focusManagement]);

  /**
   * Handles keyboard navigation with enhanced options and error handling
   * @param event - The keyboard event
   * @param items - Array of focusable elements
   * @param currentIndex - Current focused element index
   * @param onSelect - Optional callback when Enter/Space is pressed
   * @param options - Additional navigation options
   * @returns New index after navigation
   */
  const handleKeyNavigation = useCallback((
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onSelect?: (index: number) => void,
    options: KeyboardNavigationOptions = {}
  ): number => {
    if (!keyboardNavigation) return currentIndex;

    // Validate inputs
    if (!Array.isArray(items)) {
      console.warn('useAccessibility: items must be an array');
      return currentIndex;
    }

    if (items.length === 0) return currentIndex;

    if (typeof currentIndex !== 'number' || currentIndex < 0 || currentIndex >= items.length) {
      console.warn('useAccessibility: Invalid currentIndex');
      return Math.max(0, Math.min(currentIndex, items.length - 1));
    }

    const { wrapAround = false, orientation = 'vertical' } = options;
    let newIndex = currentIndex;

    // Handle different navigation keys based on orientation
    switch (event.key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'grid') {
          event.preventDefault();
          newIndex = currentIndex + 1;
          if (wrapAround && newIndex >= items.length) newIndex = 0;
          else newIndex = Math.min(newIndex, items.length - 1);
        }
        break;

      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'grid') {
          event.preventDefault();
          newIndex = currentIndex - 1;
          if (wrapAround && newIndex < 0) newIndex = items.length - 1;
          else newIndex = Math.max(newIndex, 0);
        }
        break;

      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'grid') {
          event.preventDefault();
          newIndex = currentIndex + 1;
          if (wrapAround && newIndex >= items.length) newIndex = 0;
          else newIndex = Math.min(newIndex, items.length - 1);
        }
        break;

      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'grid') {
          event.preventDefault();
          newIndex = currentIndex - 1;
          if (wrapAround && newIndex < 0) newIndex = items.length - 1;
          else newIndex = Math.max(newIndex, 0);
        }
        break;

      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        try {
          onSelect?.(currentIndex);
        } catch (error) {
          console.error('useAccessibility: Error in onSelect callback:', error);
        }
        return currentIndex;

      default:
        return currentIndex;
    }

    // Validate and set focus to new element
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < items.length) {
      const targetElement = items[newIndex];
      if (targetElement) {
        try {
          targetElement.focus();
        } catch (error) {
          console.error('useAccessibility: Error focusing element:', error);
        }
      }
    }

    return newIndex;
  }, [keyboardNavigation]);

  /**
   * Creates a skip link with proper accessibility attributes
   * @param targetId - The ID of the target element
   * @param label - The link text for screen readers
   * @returns Skip link props object
   */
  const createSkipLink = useCallback((targetId: string, label: string): SkipLinkProps => {
    if (!targetId?.trim() || !label?.trim()) {
      console.warn('useAccessibility: targetId and label are required for skip links');
    }

    return {
      href: `#${targetId}`,
      className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50',
      children: label,
      onFocus: () => announce(`Skip link: ${label}`)
    };
  }, [announce]);

  /**
   * Calculates color contrast ratio with detailed results
   * @param foreground - Foreground color (hex, rgb, or named color)
   * @param background - Background color (hex, rgb, or named color)
   * @returns Detailed contrast analysis
   */
  const checkColorContrast = useCallback((foreground: string, background: string): ColorContrastResult => {
    if (!foreground || !background) {
      console.warn('useAccessibility: Both foreground and background colors are required');
      return { ratio: 0, isAA: false, isAAA: false, level: 'FAIL' };
    }

    try {
      const fgLuminance = getLuminance(foreground);
      const bgLuminance = getLuminance(background);

      if (fgLuminance === 0.5 || bgLuminance === 0.5) {
        console.warn('useAccessibility: Color parsing may be incomplete, using fallback luminance values');
      }

      const ratio = fgLuminance > bgLuminance
        ? (fgLuminance + 0.05) / (bgLuminance + 0.05)
        : (bgLuminance + 0.05) / (fgLuminance + 0.05);

      const isAA = ratio >= WCAG_AA_CONTRAST_RATIO;
      const isAAA = ratio >= WCAG_AAA_CONTRAST_RATIO;

      return {
        ratio: Math.round(ratio * 100) / 100,
        isAA,
        isAAA,
        level: isAAA ? 'AAA' : isAA ? 'AA' : 'FAIL'
      };
    } catch (error) {
      console.error('useAccessibility: Error calculating color contrast:', error);
      return { ratio: 0, isAA: false, isAAA: false, level: 'FAIL' };
    }
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    // Capture current timeouts Map at effect run time
    const currentTimeouts = announcementTimeouts.current;

    return () => {
      // Use the captured Map reference for cleanup
      currentTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
      currentTimeouts.clear();
    };
  }, []);

  return {
    announce,
    setFocus,
    handleKeyNavigation,
    createSkipLink,
    checkColorContrast,
    announcements,
    focusRef
  };
}

/**
 * Hook for detecting user's preference for reduced motion
 * Useful for disabling animations for users who prefer less motion
 *
 * @returns Boolean indicating if user prefers reduced motion
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 * return (
 *   <div style={{
 *     animation: prefersReducedMotion ? 'none' : 'slideIn 0.3s ease-in-out'
 *   }}>
 *     Content
 *   </div>
 * );
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check if we're in a server-side rendering environment
    if (typeof window === 'undefined') return;

    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

      if (!mediaQuery) {
        console.warn('useAccessibility: MediaQuery API not supported');
        return;
      }

      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (event: MediaQueryListEvent) => {
        setPrefersReducedMotion(event.matches);
      };

      // Use the modern addEventListener method with fallback
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.addListener) {
        // Legacy browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }

      // Return empty cleanup function if no event listener was added
      return () => {};
    } catch (error) {
      console.error('useAccessibility: Error setting up reduced motion detection:', error);
      return () => {};
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for detecting user's preference for high contrast
 * Useful for adapting UI for better visibility
 *
 * @returns Boolean indicating if user prefers high contrast
 *
 * @example
 * ```tsx
 * const prefersHighContrast = useHighContrast();
 * return (
 *   <div style={{
 *     border: prefersHighContrast ? '2px solid currentColor' : '1px solid #ccc'
 *   }}>
 *     High contrast content
 *   </div>
 * );
 * ```
 */
export function useHighContrast(): boolean {
  const [prefersHighContrast, setPrefersHighContrast] = useState<boolean>(false);

  useEffect(() => {
    // Check if we're in a server-side rendering environment
    if (typeof window === 'undefined') return;

    try {
      const mediaQuery = window.matchMedia('(prefers-contrast: high)');

      if (!mediaQuery) {
        console.warn('useAccessibility: MediaQuery API not supported');
        return;
      }

      setPrefersHighContrast(mediaQuery.matches);

      const handleChange = (event: MediaQueryListEvent) => {
        setPrefersHighContrast(event.matches);
      };

      // Use the modern addEventListener method with fallback
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.addListener) {
        // Legacy browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }

      // Return empty cleanup function if no event listener was added
      return () => {};
    } catch (error) {
      console.error('useAccessibility: Error setting up high contrast detection:', error);
      return () => {};
    }
  }, []);

  return prefersHighContrast;
}