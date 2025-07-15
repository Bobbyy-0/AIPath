
"use client";

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggleButton() {
  const [theme, setTheme] = useState<string | null>(null); // Initial theme is undetermined

  // Effect to determine and set the initial theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // Check system preference if no theme is stored
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, []); // Empty dependency array ensures this runs once on mount

  // Effect to apply the theme to the document and save to localStorage
  useEffect(() => {
    if (theme) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    }
  }, [theme]); // Runs when theme state changes

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Don't render the button until the theme is determined to prevent hydration issues
  // and UI flashing the wrong icon.
  if (theme === null) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 bg-background hover:bg-accent text-foreground hover:text-accent-foreground rounded-full shadow-md"
      aria-label={theme === 'light' ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === 'light' ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
