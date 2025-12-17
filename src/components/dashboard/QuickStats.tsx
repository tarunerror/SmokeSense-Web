'use client';

import { useMemo } from 'react';
import styles from './QuickStats.module.css';

interface QuickStatsProps {
    todayCount: number;
    weekLogs: { logged_at: string }[];
    budget: number | null;
    cigarettePrice: number | null;
}

export default function QuickStats({
    todayCount,
    weekLogs,
    budget,
    cigarettePrice
}: QuickStatsProps) {
    const stats = useMemo(() => {
        const weekTotal = weekLogs.length;
        const dailyAvg = weekTotal / 7;

        // Calculate money spent this week
        const pricePerCig = cigarettePrice || 15; // Default estimate (INR)
        const weeklySpend = weekTotal * pricePerCig;
        const monthlyProjection = dailyAvg * 30 * pricePerCig;

        // Calculate time (assuming 5 minutes per cigarette)
        const minutesPerCig = 5;
        const weeklyMinutes = weekTotal * minutesPerCig;
        const weeklyHours = weeklyMinutes / 60;

        // Budget adherence (days within budget this week)
        let daysWithinBudget = 0;
        if (budget) {
            // Group logs by day
            const dayMap = new Map<string, number>();
            weekLogs.forEach(log => {
                const day = new Date(log.logged_at).toDateString();
                dayMap.set(day, (dayMap.get(day) || 0) + 1);
            });
            daysWithinBudget = Array.from(dayMap.values()).filter(count => count <= budget).length;
        }

        return {
            weekTotal,
            dailyAvg,
            weeklySpend,
            monthlyProjection,
            weeklyHours,
            daysWithinBudget,
        };
    }, [weekLogs, budget, cigarettePrice]);

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Quick Stats</h3>

            <div className={styles.grid}>
                <div className={styles.stat}>
                    <span className={styles.statIcon}>📊</span>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{stats.weekTotal}</span>
                        <span className={styles.statLabel}>This week</span>
                    </div>
                </div>

                <div className={styles.stat}>
                    <span className={styles.statIcon}>📈</span>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{stats.dailyAvg.toFixed(1)}</span>
                        <span className={styles.statLabel}>Daily avg</span>
                    </div>
                </div>

                <div className={styles.stat}>
                    <span className={styles.statIcon}>💰</span>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>₹{stats.weeklySpend.toFixed(0)}</span>
                        <span className={styles.statLabel}>Spent this week</span>
                    </div>
                </div>

                <div className={styles.stat}>
                    <span className={styles.statIcon}>⏱️</span>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{stats.weeklyHours.toFixed(1)}h</span>
                        <span className={styles.statLabel}>Time this week</span>
                    </div>
                </div>

                {budget && (
                    <div className={styles.stat}>
                        <span className={styles.statIcon}>🎯</span>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>{stats.daysWithinBudget}/7</span>
                            <span className={styles.statLabel}>Days on budget</span>
                        </div>
                    </div>
                )}

                <div className={styles.stat}>
                    <span className={styles.statIcon}>📅</span>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>₹{stats.monthlyProjection.toFixed(0)}</span>
                        <span className={styles.statLabel}>Monthly projection</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
