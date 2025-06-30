// providers.tsx
'use client';
 
import React from 'react';
import { ThemeProvider } from 'next-theme-kit';
 
type ProvidersProps = {
  children: React.ReactNode;
};
 
const Providers: React.FC<ProvidersProps> = (props) => {
  const { children } = props;
 
  return (
    <ThemeProvider useLocalStorage useSystem={false}>
      {children}
    </ThemeProvider>
  );
};
 
export default Providers;