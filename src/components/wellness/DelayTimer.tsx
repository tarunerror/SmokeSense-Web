'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './DelayTimer.module.css';

interface DelayTimerProps {
    durationSeconds: number;
    onComplete: () => void;
    onSkip: () => void;
}

export default function DelayTimer({
    durationSeconds,
    onComplete,
    onSkip
}: DelayTimerProps) {
    const [timeLeft, setTimeLeft] = useState(durationSeconds);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) {
            if (timeLeft <= 0) {
                onComplete();
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, timeLeft, onComplete]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((durationSeconds - timeLeft) / durationSeconds) * 100;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Take a moment</h3>
                <p className={styles.subtitle}>
                    A short pause can help you make a mindful choice
                </p>
            </div>

            <div className={styles.timerWrapper}>
                <svg className={styles.progressRing} viewBox="0 0 120 120">
                    <circle
                        className={styles.progressBg}
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        strokeWidth="8"
                    />
                    <circle
                        className={styles.progressFill}
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 54}`}
                        strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
                        transform="rotate(-90 60 60)"
                    />
                </svg>
                <div className={styles.timerText}>
                    <span className={styles.time}>{formatTime(timeLeft)}</span>
                    <span className={styles.label}>remaining</span>
                </div>
            </div>

            <div className={styles.actions}>
                <button className={`btn btn-secondary`} onClick={onSkip}>
                    Skip & Log Now
                </button>
                <button
                    className={`btn btn-ghost`}
                    onClick={() => setIsRunning(!isRunning)}
                >
                    {isRunning ? 'Pause' : 'Resume'}
                </button>
            </div>

            <p className={styles.encouragement}>
                You&apos;re doing great. This is your journey. 💚
            </p>
        </div>
    );
}
