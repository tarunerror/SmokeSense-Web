'use client';

import { useMemo } from 'react';
import { format, subDays, startOfDay } from 'date-fns';
import styles from './WeeklyTrend.module.css';

interface WeeklyTrendProps {
    weekLogs: { logged_at: string }[];
}

export default function WeeklyTrend({ weekLogs }: WeeklyTrendProps) {
    const dailyCounts = useMemo(() => {
        const counts: { day: string; count: number; date: Date }[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = startOfDay(subDays(new Date(), i));
            const nextDate = startOfDay(subDays(new Date(), i - 1));

            const count = weekLogs.filter(log => {
                const logDate = new Date(log.logged_at);
                return logDate >= date && logDate < nextDate;
            }).length;

            counts.push({
                day: format(date, 'EEE'),
                count,
                date,
            });
        }

        return counts;
    }, [weekLogs]);

    const maxCount = Math.max(...dailyCounts.map(d => d.count), 1);
    const avgCount = dailyCounts.reduce((sum, d) => sum + d.count, 0) / 7;
    const todayCount = dailyCounts[dailyCounts.length - 1]?.count || 0;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Weekly Trend</h3>
                <span className={styles.avg}>
                    Avg: {avgCount.toFixed(1)}/day
                </span>
            </div>

            <div className={styles.chart}>
                {dailyCounts.map((day, index) => (
                    <div key={day.day} className={styles.bar}>
                        <div className={styles.barWrapper}>
                            <div
                                className={`${styles.barFill} ${index === 6 ? styles.today : ''}`}
                                style={{ height: `${(day.count / maxCount) * 100}%` }}
                            >
                                {day.count > 0 && (
                                    <span className={styles.barValue}>{day.count}</span>
                                )}
                            </div>
                        </div>
                        <span className={`${styles.barLabel} ${index === 6 ? styles.todayLabel : ''}`}>
                            {day.day}
                        </span>
                    </div>
                ))}
            </div>

            <div className={styles.comparison}>
                {todayCount > avgCount ? (
                    <span className={styles.up}>↑ {((todayCount - avgCount) / avgCount * 100).toFixed(0)}% above average</span>
                ) : todayCount < avgCount ? (
                    <span className={styles.down}>↓ {((avgCount - todayCount) / avgCount * 100).toFixed(0)}% below average</span>
                ) : (
                    <span className={styles.same}>At your weekly average</span>
                )}
            </div>
        </div>
    );
}
