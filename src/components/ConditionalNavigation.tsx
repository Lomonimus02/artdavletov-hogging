'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Don't render Navigation on projects page - it has its own ProjectsNavigation
  if (pathname === '/projects') {
    return null;
  }
  
  return <Navigation />;
}
