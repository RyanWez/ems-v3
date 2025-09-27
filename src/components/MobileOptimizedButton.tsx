'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface MobileOptimizedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'touch';
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
}

export const MobileOptimizedButton = forwardRef<HTMLButtonElement, MobileOptimizedButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    className = '',
    children,
    disabled,
    ...props
  }, ref) => {
    // Base classes for mobile optimization
    const baseClasses = `
      inline-flex items-center justify-center font-medium rounded-lg
      transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-95 touch-manipulation
      select-none
    `;

    // Variant classes
    const variantClasses = {
      primary: `
        bg-blue-600 text-white hover:bg-blue-700 
        focus:ring-blue-500 active:bg-blue-800
        shadow-sm hover:shadow-md
      `,
      secondary: `
        bg-gray-600 text-white hover:bg-gray-700
        focus:ring-gray-500 active:bg-gray-800
        shadow-sm hover:shadow-md
      `,
      outline: `
        border-2 border-blue-600 text-blue-600 bg-transparent
        hover:bg-blue-50 focus:ring-blue-500
        active:bg-blue-100
      `,
      ghost: `
        text-gray-700 bg-transparent hover:bg-gray-100
        focus:ring-gray-500 active:bg-gray-200
      `,
      danger: `
        bg-red-600 text-white hover:bg-red-700
        focus:ring-red-500 active:bg-red-800
        shadow-sm hover:shadow-md
      `
    };

    // Size classes optimized for mobile touch
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm min-h-[36px]', // Minimum 36px for touch
      md: 'px-4 py-2.5 text-sm min-h-[44px]', // Standard mobile touch target
      lg: 'px-6 py-3 text-base min-h-[48px]', // Large touch target
      touch: 'px-6 py-4 text-base min-h-[56px]' // Extra large for accessibility
    };

    // Width classes
    const widthClasses = fullWidth ? 'w-full' : '';

    // Icon spacing
    const iconSpacing = icon ? (iconPosition === 'left' ? 'space-x-2' : 'space-x-reverse space-x-2') : '';

    // Combine all classes
    const buttonClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${widthClasses}
      ${iconSpacing}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    // Loading spinner
    const LoadingSpinner = () => (
      <Loader2 className="w-4 h-4 animate-spin" />
    );

    // Button content
    const buttonContent = () => {
      if (loading) {
        return (
          <>
            <LoadingSpinner />
            {loadingText || children}
          </>
        );
      }

      if (icon && iconPosition === 'left') {
        return (
          <>
            {icon}
            <span>{children}</span>
          </>
        );
      }

      if (icon && iconPosition === 'right') {
        return (
          <>
            <span>{children}</span>
            {icon}
          </>
        );
      }

      return children;
    };

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        {...props}
      >
        {buttonContent()}
      </button>
    );
  }
);

MobileOptimizedButton.displayName = 'MobileOptimizedButton';

// Floating Action Button for mobile
interface FABProps extends Omit<MobileOptimizedButtonProps, 'size' | 'variant'> {
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export function FloatingActionButton({
  position = 'bottom-right',
  className = '',
  children,
  ...props
}: FABProps) {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'bottom-center': 'fixed bottom-6 left-1/2 transform -translate-x-1/2'
  };

  const fabClasses = `
    ${positionClasses[position]}
    w-14 h-14 rounded-full shadow-lg hover:shadow-xl
    z-50 transition-all duration-200
    ${className}
  `;

  return (
    <MobileOptimizedButton
      variant="primary"
      size="touch"
      className={fabClasses}
      {...props}
    >
      {children}
    </MobileOptimizedButton>
  );
}

// Button group for mobile
interface ButtonGroupProps {
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

export function MobileButtonGroup({
  children,
  orientation = 'horizontal',
  spacing = 'normal',
  className = ''
}: ButtonGroupProps) {
  const orientationClasses = {
    horizontal: 'flex flex-row',
    vertical: 'flex flex-col'
  };

  const spacingClasses = {
    tight: orientation === 'horizontal' ? 'space-x-1' : 'space-y-1',
    normal: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
    loose: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4'
  };

  return (
    <div className={`
      ${orientationClasses[orientation]}
      ${spacingClasses[spacing]}
      ${className}
    `}>
      {children}
    </div>
  );
}