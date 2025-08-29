'use client';

import { useState } from 'react';
import Navigation from './Navigation';

interface ProjectsNavigationProps {
  activeSection: string | null;
}

export default function ProjectsNavigation({ activeSection }: ProjectsNavigationProps) {
  return <Navigation projectsActiveSection={activeSection} />;
}
