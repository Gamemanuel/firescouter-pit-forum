// theme-toggler.tsx
'use client';
 
import React from 'react';
import { useTheme } from 'next-theme-kit';
 
const ThemeToggler: React.FC = () => {
  const { theme, setTheme } = useTheme();
 
  return (
    <button
      type="button"
      aria-label="Toggle Theme"
      className="inline-flex items-center justify-center rounded-md font-medium bg-green-300 hover:bg-green-400 h-10 px-4 focus-visible:ring-green-400 dark:bg-green-800 dark:hover:bg-green-900 text-neutral-900 dark:text-neutral-50"
      onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}
    >
      Toggle theme
    </button>
  );
};
 
export default ThemeToggler;