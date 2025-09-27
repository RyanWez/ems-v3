// Accessibility utility functions

// ARIA helpers
export const aria = {
  // Generate unique IDs for ARIA relationships
  generateId: (prefix: string = 'aria'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Create ARIA attributes for form controls
  createFormControlProps: (
    id: string,
    label?: string,
    description?: string,
    error?: string,
    required?: boolean
  ) => {
    const props: Record<string, any> = {
      id,
      'aria-required': required || undefined,
    };

    if (label) {
      props['aria-label'] = label;
    }

    if (description) {
      const descId = `${id}-description`;
      props['aria-describedby'] = descId;
    }

    if (error) {
      const errorId = `${id}-error`;
      props['aria-describedby'] = props['aria-describedby'] 
        ? `${props['aria-describedby']} ${errorId}`
        : errorId;
      props['aria-invalid'] = true;
    }

    return props;
  },

  // Create ARIA attributes for expandable content
  createExpandableProps: (
    isExpanded: boolean,
    controlId: string,
    contentId: string
  ) => ({
    button: {
      'aria-expanded': isExpanded,
      'aria-controls': contentId,
      id: controlId,
    },
    content: {
      id: contentId,
      'aria-labelledby': controlId,
      hidden: !isExpanded,
    },
  }),

  // Create ARIA attributes for modal dialogs
  createModalProps: (titleId: string, descriptionId?: string) => ({
    modal: {
      role: 'dialog',
      'aria-modal': true,
      'aria-labelledby': titleId,
      'aria-describedby': descriptionId,
    },
    title: {
      id: titleId,
    },
    description: descriptionId ? {
      id: descriptionId,
    } : undefined,
  }),
};

// Focus management utilities
export const focus = {
  // Get all focusable elements within a container
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors));
  },

  // Create a focus trap
  createFocusTrap: (container: HTMLElement) => {
    const focusableElements = focus.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return {
      activate: () => firstElement?.focus(),
      deactivate: () => container.removeEventListener('keydown', handleKeyDown),
    };
  },

  // Save and restore focus
  createFocusManager: () => {
    let previousElement: HTMLElement | null = null;

    return {
      save: () => {
        previousElement = document.activeElement as HTMLElement;
      },
      restore: () => {
        previousElement?.focus();
        previousElement = null;
      },
    };
  },
};

// Screen reader utilities
export const screenReader = {
  // Create live region for announcements
  createLiveRegion: (priority: 'polite' | 'assertive' = 'polite') => {
    const region = document.createElement('div');
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);

    return {
      announce: (message: string) => {
        region.textContent = message;
        // Clear after announcement
        setTimeout(() => {
          region.textContent = '';
        }, 1000);
      },
      destroy: () => {
        document.body.removeChild(region);
      },
    };
  },

  // Check if screen reader is active
  isScreenReaderActive: (): boolean => {
    // This is a heuristic - not 100% reliable
    return window.navigator.userAgent.includes('NVDA') ||
           window.navigator.userAgent.includes('JAWS') ||
           window.speechSynthesis?.speaking ||
           false;
  },
};

// Color and contrast utilities
export const color = {
  // Convert hex to RGB
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result || !result[1] || !result[2] || !result[3]) {
      return null;
    }

    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  },

  // Calculate relative luminance
  getRelativeLuminance: (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      if (typeof c !== 'number') return 0;
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    if (typeof rs !== 'number' || typeof gs !== 'number' || typeof bs !== 'number') {
      return 0;
    }

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // Calculate contrast ratio
  getContrastRatio: (color1: string, color2: string): number => {
    const rgb1 = color.hexToRgb(color1);
    const rgb2 = color.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;

    const l1 = color.getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = color.getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  },

  // Check if contrast meets WCAG standards
  meetsContrastStandard: (
    color1: string, 
    color2: string, 
    level: 'AA' | 'AAA' = 'AA',
    size: 'normal' | 'large' = 'normal'
  ): boolean => {
    const ratio = color.getContrastRatio(color1, color2);
    
    if (level === 'AAA') {
      return size === 'large' ? ratio >= 4.5 : ratio >= 7;
    }
    
    return size === 'large' ? ratio >= 3 : ratio >= 4.5;
  },
};

// Keyboard navigation utilities
export const keyboard = {
  // Common key codes
  keys: {
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    HOME: 'Home',
    END: 'End',
    TAB: 'Tab',
  } as const,

  // Check if key is navigation key
  isNavigationKey: (key: string): boolean => {
    return Object.values(keyboard.keys).includes(key as any);
  },

  // Handle roving tabindex
  createRovingTabindex: (container: HTMLElement) => {
    const items = focus.getFocusableElements(container);
    let currentIndex = 0;

    // Set initial tabindex
    items.forEach((item, index) => {
      item.tabIndex = index === 0 ? 0 : -1;
    });

    const setActiveItem = (index: number) => {
      items.forEach((item, i) => {
        item.tabIndex = i === index ? 0 : -1;
      });
      items[index]?.focus();
      currentIndex = index;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      let newIndex = currentIndex;

      switch (event.key) {
        case keyboard.keys.ARROW_DOWN:
        case keyboard.keys.ARROW_RIGHT:
          event.preventDefault();
          newIndex = (currentIndex + 1) % items.length;
          break;
        case keyboard.keys.ARROW_UP:
        case keyboard.keys.ARROW_LEFT:
          event.preventDefault();
          newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
          break;
        case keyboard.keys.HOME:
          event.preventDefault();
          newIndex = 0;
          break;
        case keyboard.keys.END:
          event.preventDefault();
          newIndex = items.length - 1;
          break;
      }

      if (newIndex !== currentIndex) {
        setActiveItem(newIndex);
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return {
      setActiveItem,
      destroy: () => container.removeEventListener('keydown', handleKeyDown),
    };
  },
};

// Mobile accessibility utilities
export const mobile = {
  // Check if device is mobile
  isMobile: (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  },

  // Check if device supports touch
  supportsTouch: (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // Get safe area insets for notched devices
  getSafeAreaInsets: () => {
    const style = getComputedStyle(document.documentElement);
    return {
      top: style.getPropertyValue('--sat') || style.getPropertyValue('env(safe-area-inset-top)') || '0px',
      right: style.getPropertyValue('--sar') || style.getPropertyValue('env(safe-area-inset-right)') || '0px',
      bottom: style.getPropertyValue('--sab') || style.getPropertyValue('env(safe-area-inset-bottom)') || '0px',
      left: style.getPropertyValue('--sal') || style.getPropertyValue('env(safe-area-inset-left)') || '0px',
    };
  },

  // Optimize touch targets
  optimizeTouchTarget: (element: HTMLElement, minSize: number = 44) => {
    const rect = element.getBoundingClientRect();
    if (rect.width < minSize || rect.height < minSize) {
      element.style.minWidth = `${minSize}px`;
      element.style.minHeight = `${minSize}px`;
      element.style.display = 'inline-flex';
      element.style.alignItems = 'center';
      element.style.justifyContent = 'center';
    }
  },
};

// Validation utilities
export const validate = {
  // Check if element has proper ARIA labels
  hasProperLabeling: (element: HTMLElement): boolean => {
    const hasAriaLabel = element.hasAttribute('aria-label');
    const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
    const hasAssociatedLabel = element.id && document.querySelector(`label[for="${element.id}"]`);
    
    return hasAriaLabel || hasAriaLabelledBy || !!hasAssociatedLabel;
  },

  // Check if interactive element is keyboard accessible
  isKeyboardAccessible: (element: HTMLElement): boolean => {
    const tabIndex = element.tabIndex;
    const isNativelyFocusable = ['button', 'a', 'input', 'select', 'textarea'].includes(
      element.tagName.toLowerCase()
    );
    
    return isNativelyFocusable || tabIndex >= 0;
  },

  // Audit accessibility issues
  auditElement: (element: HTMLElement) => {
    const issues: string[] = [];

    if (!validate.hasProperLabeling(element)) {
      issues.push('Element lacks proper labeling');
    }

    if (!validate.isKeyboardAccessible(element)) {
      issues.push('Element is not keyboard accessible');
    }

    // Check for minimum touch target size on mobile
    if (mobile.isMobile()) {
      const rect = element.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        issues.push('Touch target is too small (minimum 44px)');
      }
    }

    return issues;
  },
};