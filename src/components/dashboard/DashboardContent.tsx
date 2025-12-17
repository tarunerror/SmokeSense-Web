'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLoggingStore } from '@/stores';
import type { User } from '@supabase/supabase-js';
import type { Profile, CigaretteLog } from '@/types';
import styles from './Dashboard.module.css';
import LogButton from '@/components/logging/LogButton';
import TodayCounter from './TodayCounter';
import RecentLogs from './RecentLogs';
import WeeklyTrend from './WeeklyTrend';
import QuickStats from './QuickStats';

interface DashboardContentProps {
    user: User;
    profile: Profile | null;
    initialTodayLogs: CigaretteLog[];
    weekLogs: { logged_at: string }[];
}

export default function DashboardContent({
    user,
    profile,
    initialTodayLogs,
    weekLogs
}: DashboardContentProps) {
    const supabase = createClient();
    const { todayLogs, setTodayLogs, addLog } = useLoggingStore();
    const [greeting, setGreeting] = useState('');

    // Initialize logs from server
    useEffect(() => {
        setTodayLogs(initialTodayLogs);
    }, [initialTodayLogs, setTodayLogs]);

    // Set personalized greeting
    useEffect(() => {
        const hour = new Date().getHours();
        const name = profile?.display_name || user.email?.split('@')[0] || 'there';

        if (hour < 12) {
            setGreeting(`Good morning, ${name}`);
        } else if (hour < 17) {
            setGreeting(`Good afternoon, ${name}`);
        } else {
            setGreeting(`Good evening, ${name}`);
        }
    }, [profile, user.email]);

    // Real-time subscription for logs
    useEffect(() => {
        const channel = supabase
            .channel('cigarette_logs_changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'cigarette_logs',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    const newLog = payload.new as CigaretteLog;
                    // Check if log is from today
                    const logDate = new Date(newLog.logged_at);
                    const today = new Date();
                    if (
                        logDate.getDate() === today.getDate() &&
                        logDate.getMonth() === today.getMonth() &&
                        logDate.getFullYear() === today.getFullYear()
                    ) {
                        addLog(newLog);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, user.id, addLog]);

    const handleLogSuccess = useCallback((log: CigaretteLog) => {
        // Immediate optimistic update
        const logDate = new Date(log.logged_at);
        const today = new Date();

        if (
            logDate.getDate() === today.getDate() &&
            logDate.getMonth() === today.getMonth() &&
            logDate.getFullYear() === today.getFullYear()
        ) {
            addLog(log);
        }
    }, [addLog]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.greeting}>{greeting}</h1>
                    <p className={styles.subtitle}>
                        {profile?.phase === 'awareness' && "You're building awareness of your habits"}
                        {profile?.phase === 'control' && "You're taking control of your choices"}
                        {profile?.phase === 'reduction' && "You're on your reduction journey"}
                        {!profile?.phase && "Track your journey at your own pace"}
                    </p>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.grid}>
                    {/* Today's Count - Hero Card */}
                    <div className={`${styles.card} ${styles.heroCard}`}>
                        <TodayCounter
                            count={todayLogs.length}
                            budget={profile?.daily_budget || null}
                            userId={user.id}
                            lastLoggedAt={todayLogs[0]?.logged_at || weekLogs[0]?.logged_at || null}
                        />
                    </div>



                    {/* Quick Stats */}
                    <div className={styles.card}>
                        <QuickStats
                            todayCount={todayLogs.length}
                            weekLogs={weekLogs}
                            budget={profile?.daily_budget || null}
                            cigarettePrice={profile?.cigarette_price || null}
                        />
                    </div>

                    {/* Weekly Trend */}
                    <div className={styles.card}>
                        <WeeklyTrend weekLogs={weekLogs} />
                    </div>

                    {/* Recent Logs */}
                    <div className={`${styles.card} ${styles.recentCard}`}>
                        <RecentLogs logs={todayLogs.slice(0, 5)} />
                    </div>
                </div>
            </main>

            <LogButton
                userId={user.id}
                onSuccess={handleLogSuccess}
            />


        </div>
    );
}
