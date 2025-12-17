'use client';

import { format } from 'date-fns';
import type { CigaretteLog } from '@/types';
import { MOOD_OPTIONS, ACTIVITY_OPTIONS, LOCATION_OPTIONS } from '@/types';
import styles from './RecentLogs.module.css';

interface RecentLogsProps {
    logs: CigaretteLog[];
}

export default function RecentLogs({ logs }: RecentLogsProps) {
    const getMoodEmoji = (mood: string | null) => {
        if (!mood) return null;
        const found = MOOD_OPTIONS.find(m => m.value === mood);
        return found?.label.split(' ')[0] || null;
    };

    const getActivityEmoji = (activity: string | null) => {
        if (!activity) return null;
        const found = ACTIVITY_OPTIONS.find(a => a.value === activity);
        return found?.label.split(' ')[0] || null;
    };

    const getLocationEmoji = (location: string | null) => {
        if (!location) return null;
        const found = LOCATION_OPTIONS.find(l => l.value === location);
        return found?.label.split(' ')[0] || null;
    };

    if (logs.length === 0) {
        return (
            <div className={styles.container}>
                <h3 className={styles.title}>Today&apos;s Log</h3>
                <div className={styles.empty}>
                    <span className={styles.emptyIcon}>📝</span>
                    <p>No cigarettes logged today</p>
                    <p className={styles.emptyHint}>Tap the button below to log</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Today&apos;s Log</h3>
            <div className={styles.list}>
                {logs.map((log, index) => (
                    <div
                        key={log.id}
                        className={styles.item}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className={styles.time}>
                            {format(new Date(log.logged_at), 'h:mm a')}
                        </div>
                        <div className={styles.details}>
                            {log.was_delayed && (
                                <span className={styles.delayBadge} title="Used delay feature">
                                    ⏱️ {Math.floor((log.delay_duration || 0) / 60)}m
                                </span>
                            )}
                            {getMoodEmoji(log.mood) && (
                                <span className={styles.tag}>{getMoodEmoji(log.mood)}</span>
                            )}
                            {getActivityEmoji(log.activity) && (
                                <span className={styles.tag}>{getActivityEmoji(log.activity)}</span>
                            )}
                            {getLocationEmoji(log.location) && (
                                <span className={styles.tag}>{getLocationEmoji(log.location)}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {logs.length >= 5 && (
                <a href="/analytics" className={styles.viewAll}>
                    View all logs →
                </a>
            )}
        </div>
    );
}
