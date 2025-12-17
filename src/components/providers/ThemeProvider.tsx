'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/stores';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useUIStore();

    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.setAttribute('data-theme', systemTheme);

            // Listen for system changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => {
                root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
            root.setAttribute('data-theme', theme);
        }
    }, [theme]);

    return <>{children}</>;
}
