import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from './providers';
import ThemeToggler from "../components/themeToggler";

const inter = Inter({ subsets: ['latin'] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Firescouter Pit Form",
  description: "A scouting tool for FTC Teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" suppressHydrationWarning
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        antialiased
        `
      }
    >
    <head>
      <script
      // prevent theme flashing
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const storedTheme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = storedTheme ?? (prefersDark ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch(e) {}
            })();
          `,
        }}
      />
    </head>
      <body 
        className={
          inter.className
        }
      >
        <Providers>
          <div className="
          fixed
          top-4
          right-4
          z-50
          "
          >
            <ThemeToggler />
          </div>
          <div className="
            static
            "
          >
            {children}
          </div>
        </Providers>
      </body>
    </html>
  ); 
}