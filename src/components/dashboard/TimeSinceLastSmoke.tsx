'use client';

import { useState, useEffect } from 'react';
import styles from './TimeSinceLastSmoke.module.css';

interface TimeSinceLastSmokeProps {
    lastLoggedAt: string | null;
}

interface TimeElapsed {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function TimeSinceLastSmoke({ lastLoggedAt }: TimeSinceLastSmokeProps) {
    const [elapsed, setElapsed] = useState<TimeElapsed | null>(null);

    useEffect(() => {
        if (!lastLoggedAt) {
            setElapsed(null);
            return;
        }

        const calculateElapsed = () => {
            const lastTime = new Date(lastLoggedAt).getTime();
            const now = Date.now();
            const diff = now - lastTime;

            if (diff < 0) {
                setElapsed({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const seconds = Math.floor((diff / 1000) % 60);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));

            setElapsed({ days, hours, minutes, seconds });
        };

        calculateElapsed();
        const interval = setInterval(calculateElapsed, 1000);

        return () => clearInterval(interval);
    }, [lastLoggedAt]);

    if (!lastLoggedAt || !elapsed) {
        return (
            <div className={styles.container}>
                <h3 className={styles.title}>Time Since Last Smoke</h3>
                <p className={styles.empty}>No cigarettes logged yet</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Time Since Last Smoke</h3>
            <div className={styles.timer}>
                {elapsed.days > 0 && (
                    <div className={styles.unit}>
                        <span className={styles.value}>{elapsed.days}</span>
                        <span className={styles.label}>{elapsed.days === 1 ? 'day' : 'days'}</span>
                    </div>
                )}
                <div className={styles.unit}>
                    <span className={styles.value}>{elapsed.hours.toString().padStart(2, '0')}</span>
                    <span className={styles.label}>{elapsed.hours === 1 ? 'hour' : 'hours'}</span>
                </div>
                <div className={styles.separator}>:</div>
                <div className={styles.unit}>
                    <span className={styles.value}>{elapsed.minutes.toString().padStart(2, '0')}</span>
                    <span className={styles.label}>{elapsed.minutes === 1 ? 'min' : 'mins'}</span>
                </div>
                <div className={styles.separator}>:</div>
                <div className={styles.unit}>
                    <span className={styles.value}>{elapsed.seconds.toString().padStart(2, '0')}</span>
                    <span className={styles.label}>secs</span>
                </div>
            </div>
            {elapsed.days >= 1 && (
                <p className={styles.encouragement}>🎉 Amazing! Keep going!</p>
            )}
        </div>
    );
}
