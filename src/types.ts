
import React from 'react';

export interface NavItem {
  path: string;
  name: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: NavItem[];
}
