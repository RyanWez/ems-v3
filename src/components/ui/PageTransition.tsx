'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<'entering' | 'entered' | 'exiting'>('entered');

  useEffect(() => {
    if (children !== displayChildren) {
      setTransitionStage('exiting');
      
      const exitTimer = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage('entering');
        
        const enterTimer = setTimeout(() => {
          setTransitionStage('entered');
        }, 50);
        
        return () => clearTimeout(enterTimer);
      }, 150);
      
      return () => clearTimeout(exitTimer);
    }
  }, [children, displayChildren]);

  const getTransitionClass = () => {
    switch (transitionStage) {
      case 'entering':
        return 'page-enter';
      case 'exiting':
        return 'page-exit';
      default:
        return '';
    }
  };

  return (
    <div className={`transition-container ${getTransitionClass()}`}>
      {displayChildren}
    </div>
  );
};

export default PageTransition;