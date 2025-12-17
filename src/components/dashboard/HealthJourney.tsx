'use client';

import { useState, useEffect } from 'react';
import { differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';
import { Heart, Wind, Zap, Activity, Smile, Brain, CheckCircle2, Clock } from 'lucide-react';
import styles from './HealthJourney.module.css';

interface HealthJourneyProps {
    lastLoggedAt: string | null;
}

interface Milestone {
    id: string;
    durationMinutes: number;
    title: string;
    description: string;
    icon: any;
}

const MILESTONES: Milestone[] = [
    {
        id: '20min',
        durationMinutes: 20,
        title: 'Pulse Rate Normalizes',
        description: 'Your heart rate and blood pressure drop.',
        icon: Activity
    },
    {
        id: '8hr',
        durationMinutes: 8 * 60,
        title: 'Oxygen Levels Return',
        description: 'Carbon monoxide levels drop to half. Oxygen returns to normal.',
        icon: Wind
    },
    {
        id: '24hr',
        durationMinutes: 24 * 60,
        title: 'Heart Attack Risk Drops',
        description: 'Your risk of heart attack begins to decrease.',
        icon: Heart
    },
    {
        id: '48hr',
        durationMinutes: 48 * 60,
        title: 'Senses Sharpen',
        description: 'Nerve endings start regrowing. Smell and taste improve.',
        icon: Zap
    },
    {
        id: '72hr',
        durationMinutes: 72 * 60,
        title: 'Breathing Eases',
        description: 'Bronchial tubes relax. Energy increases.',
        icon: Smile
    },
    {
        id: '2wk',
        durationMinutes: 14 * 24 * 60,
        title: 'Circulation Improves',
        description: 'Walking and running become easier.',
        icon: Brain // Representing full body function
    }
];

export default function HealthJourney({ lastLoggedAt }: HealthJourneyProps) {
    const [elapsedMinutes, setElapsedMinutes] = useState(0);

    useEffect(() => {
        if (!lastLoggedAt) {
            setElapsedMinutes(0);
            return;
        }

        const updateTime = () => {
            const now = new Date();
            const last = new Date(lastLoggedAt);
            setElapsedMinutes(differenceInMinutes(now, last));
        };

        updateTime();
        const interval = setInterval(updateTime, 60000); // 1 minute
        return () => clearInterval(interval);
    }, [lastLoggedAt]);

    if (!lastLoggedAt) return null;

    // Find current active milestone
    const activeMilestoneIndex = MILESTONES.findIndex(m => elapsedMinutes < m.durationMinutes);
    // If all completed, activeIndex is -1.
    const currentMilestone = activeMilestoneIndex === -1 ? MILESTONES[MILESTONES.length - 1] : MILESTONES[activeMilestoneIndex];
    const previousMilestone = activeMilestoneIndex > 0 ? MILESTONES[activeMilestoneIndex - 1] : null;

    // Progress for current milestone
    // Range: [Previous Duration, Current Duration]
    const prevDuration = activeMilestoneIndex > 0 ? MILESTONES[activeMilestoneIndex - 1].durationMinutes : 0;
    const targetDuration = currentMilestone.durationMinutes;

    // If finished all
    const isCompletedAll = activeMilestoneIndex === -1;
    const progressPercent = isCompletedAll
        ? 100
        : Math.min(100, Math.max(0, ((elapsedMinutes - prevDuration) / (targetDuration - prevDuration)) * 100));

    // Get time display
    const formatDuration = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`;
        if (minutes < 24 * 60) return `${Math.floor(minutes / 60)}h`;
        return `${Math.floor(minutes / (24 * 60))}d`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerIcon}>
                    <Heart size={20} />
                </div>
                <h3>Health Restoration</h3>
            </div>

            <div className={styles.timeline}>
                {/* Active or Next Milestone */}
                <div className={styles.heroMilestone}>
                    <div className={styles.milestoneIconWrapper}>
                        {isCompletedAll ? <CheckCircle2 size={32} /> : <currentMilestone.icon size={32} />}
                    </div>
                    <div className={styles.milestoneContent}>
                        <div className={styles.milestoneTitle}>
                            {isCompletedAll ? 'Major Milestones Achieved!' : currentMilestone.title}
                        </div>
                        <div className={styles.milestoneDesc}>
                            {isCompletedAll ? 'Your body is thanking you.' : currentMilestone.description}
                        </div>

                        {!isCompletedAll && (
                            <div className={styles.progressContainer}>
                                <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
                            </div>
                        )}

                        <div className={styles.timeStatus}>
                            {!isCompletedAll && (
                                <>
                                    <span>{formatDuration(elapsedMinutes)} free</span>
                                    <span>Target: {formatDuration(currentMilestone.durationMinutes)}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Upcoming / Recent List */}
                <div className={styles.milestoneList}>
                    {MILESTONES.map((m, i) => {
                        const isUnlocked = elapsedMinutes >= m.durationMinutes;
                        const isActive = i === activeMilestoneIndex && !isCompletedAll;

                        return (
                            <div
                                key={m.id}
                                className={`${styles.listItem} ${isUnlocked ? styles.unlocked : ''} ${isActive ? styles.active : ''}`}
                            >
                                <div className={styles.listIcon}>
                                    {isUnlocked ? <CheckCircle2 size={16} /> : <LockIcon size={16} />}
                                </div>
                                <span className={styles.listTitle}>{m.title}</span>
                                <span className={styles.listTime}>{formatDuration(m.durationMinutes)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const LockIcon = ({ size }: { size: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.5 }}
    >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);
