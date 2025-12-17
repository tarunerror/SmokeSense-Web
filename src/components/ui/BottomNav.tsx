'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Lightbulb, Settings, Heart } from 'lucide-react';
import styles from './BottomNav.module.css';

const navItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/health', label: 'Health', icon: Heart },
    { href: '/analytics', label: 'Stats', icon: BarChart2 },
    { href: '/insights', label: 'Insights', icon: Lightbulb },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export default function BottomNav() {
    const pathname = usePathname();

    // Hide on landing page and auth pages
    if (pathname === '/' || pathname?.startsWith('/auth')) {
        return null;
    }

    return (
        <nav className={styles.nav}>
            {navItems.map((item) => {
                const isActive = pathname === item.href ||
                    (item.href === '/dashboard' && pathname === '/');

                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                    >
                        <span className={styles.icon}>
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </span>
                        <span className={styles.label}>{item.label}</span>
                        {isActive && <span className={styles.indicator} />}
                    </Link>
                );
            })}
        </nav>
    );
}
