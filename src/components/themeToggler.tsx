'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-theme-kit';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

export default function ThemeToggler() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // tell the system to display the icons
    setMounted(true);

    // set the theme to system default to start
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = storedTheme ?? (prefersDark ? 'dark' : 'light');

    setTheme(theme); // set the theme to dark or light
  }, []);

  const isDark = theme === 'dark';
  
  return (
    <button
      onClick={() => 
        setTheme(isDark ? 'light' : 'dark')}
      className="
        relative
        h-15
        w-15
        flex
        items-center
        justify-center
        rounded-full
      "
    >
      {mounted && theme && (
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {theme === 'dark' ? (
              <MoonIcon className="
                h-15
                w-15
                text-gray-300
                " 
              />
            ) : (
              <SunIcon className="
                h-15 
                w-15
                text-yellow-500
                " 
              />
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </button>
  );
}