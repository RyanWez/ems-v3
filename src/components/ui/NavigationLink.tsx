'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useNavigation } from '@/providers/NavigationProvider';

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  replace?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({
  href,
  children,
  className = '',
  prefetch = true,
  replace = false,
  onClick,
  disabled = false,
  style,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { startNavigation, setError } = useNavigation();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    // Don't navigate if it's the same route
    if (pathname === href) {
      e.preventDefault();
      return;
    }

    // Visual feedback
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);

    // Start navigation loading
    startNavigation();

    // Call custom onClick if provided
    onClick?.();

    // Handle programmatic navigation for replace
    if (replace) {
      e.preventDefault();
      try {
        router.replace(href);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Navigation failed'));
      }
    }
  };

  const linkClassName = `
    ${className}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${isClicked ? 'transform scale-95' : ''}
    transition-all duration-150 ease-in-out
    relative overflow-hidden
  `.trim();

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={linkClassName}
      onClick={handleClick}
      style={style}
    >
      {children}
      {isClicked && (
        <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
      )}
    </Link>
  );
};

export default NavigationLink;