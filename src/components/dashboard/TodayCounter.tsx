'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { RotateCcw } from 'lucide-react';
import styles from './TodayCounter.module.css';

interface TodayCounterProps {
    count: number;
    budget: number | null;
    userId: string;
    lastLoggedAt: string | null;
    onReset?: () => void;
}

export default function TodayCounter({ count, budget, userId, lastLoggedAt, onReset }: TodayCounterProps) {
    const supabase = createClient();
    const [showConfirm, setShowConfirm] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [timeAgo, setTimeAgo] = useState<string>('');

    // Update timer every second
    useEffect(() => {
        if (!lastLoggedAt) {
            setTimeAgo('');
            return;
        }

        const updateTime = () => {
            const now = new Date();
            const last = new Date(lastLoggedAt);
            const diffInSeconds = Math.floor((now.getTime() - last.getTime()) / 1000);

            if (diffInSeconds < 60) {
                setTimeAgo(`${diffInSeconds}s ago`);
            } else if (diffInSeconds < 3600) {
                const m = Math.floor(diffInSeconds / 60);
                const s = diffInSeconds % 60;
                setTimeAgo(`${m}m ${s}s ago`);
            } else {
                const h = Math.floor(diffInSeconds / 3600);
                const m = Math.floor((diffInSeconds % 3600) / 60);
                const s = diffInSeconds % 60;
                setTimeAgo(`${h}h ${m}m ${s}s ago`);
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [lastLoggedAt]);

    const percentage = budget ? Math.min((count / budget) * 100, 100) : 0;
    const isOverBudget = budget !== null && count > budget;
    const isNearBudget = budget !== null && count >= budget * 0.8 && count <= budget;

    const handleResetToday = async () => {
        setResetting(true);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { error } = await supabase
            .from('cigarette_logs')
            .delete()
            .eq('user_id', userId)
            .gte('logged_at', today.toISOString());

        if (!error) {
            onReset?.();
            window.location.reload();
        }

        setResetting(false);
        setShowConfirm(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.counterWrapper}>
                <div className={styles.counter}>
                    <span className={`${styles.value} ${isOverBudget ? styles.overBudget : ''}`}>
                        {count}
                    </span>
                    {budget !== null && (
                        <span className={styles.budget}>/ {budget}</span>
                    )}
                </div>
                <p className={styles.label}>cigarettes today</p>
            </div>

            {budget !== null && (
                <div className={styles.progressWrapper}>
                    <div className={styles.progressBar}>
                        <div
                            className={`${styles.progressFill} ${isOverBudget ? styles.progressOver : ''} ${isNearBudget ? styles.progressNear : ''}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <p className={styles.progressText}>
                        {isOverBudget
                            ? `${count - budget} over budget`
                            : count === budget
                                ? 'At your budget'
                                : `${budget - count} remaining`}
                    </p>
                </div>
            )}

            {lastLoggedAt && timeAgo && (
                <p className={styles.lastSmoked}>
                    Last smoked {timeAgo}
                </p>
            )}

            {budget === null && (
                <p className={styles.hint}>
                    Set a daily budget in settings to track progress
                </p>
            )}

            {/* Reset Today Button */}
            {count > 0 && (
                <div className={styles.resetWrapper}>
                    {!showConfirm ? (
                        <button
                            className={styles.resetBtn}
                            onClick={() => setShowConfirm(true)}
                        >
                            <RotateCcw size={14} aria-hidden="true" />
                            Reset Today
                        </button>
                    ) : (
                        <div className={styles.confirmBox}>
                            <p className={styles.confirmText}>Reset today&apos;s count?</p>
                            <div className={styles.confirmActions}>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setShowConfirm(false)}
                                    disabled={resetting}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.confirmBtn}
                                    onClick={handleResetToday}
                                    disabled={resetting}
                                >
                                    {resetting ? '...' : 'Yes'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
