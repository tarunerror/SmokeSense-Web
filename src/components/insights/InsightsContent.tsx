'use client';

import { useMemo } from 'react';
import type { Profile, CigaretteLog } from '@/types';
import { MOOD_OPTIONS, ACTIVITY_OPTIONS, LOCATION_OPTIONS } from '@/types';
import {
    Sparkles,
    Zap,
    Clock,
    MapPin,
    BarChart3,
    TrendingUp,
    Brain,
    Lightbulb,
    Target,
    Moon,
    Briefcase
} from 'lucide-react';
import styles from './Insights.module.css';

interface InsightsContentProps {
    profile: Profile | null;
    logs: CigaretteLog[];
}

export default function InsightsContent({ profile, logs }: InsightsContentProps) {
    // Analyze patterns
    const insights = useMemo(() => {
        if (logs.length < 5) {
            return null; // Not enough data
        }

        // Most common mood
        const moodCounts: Record<string, number> = {};
        logs.forEach(log => {
            if (log.mood) {
                moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
            }
        });
        const topMoodEntry = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
        const topMood = topMoodEntry ? MOOD_OPTIONS.find(m => m.value === topMoodEntry[0]) : null;

        // Most common activity
        const activityCounts: Record<string, number> = {};
        logs.forEach(log => {
            if (log.activity) {
                activityCounts[log.activity] = (activityCounts[log.activity] || 0) + 1;
            }
        });
        const topActivityEntry = Object.entries(activityCounts).sort((a, b) => b[1] - a[1])[0];
        const topActivity = topActivityEntry ? ACTIVITY_OPTIONS.find(a => a.value === topActivityEntry[0]) : null;

        // Most common location
        const locationCounts: Record<string, number> = {};
        logs.forEach(log => {
            if (log.location) {
                locationCounts[log.location] = (locationCounts[log.location] || 0) + 1;
            }
        });
        const topLocationEntry = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0];
        const topLocation = topLocationEntry ? LOCATION_OPTIONS.find(l => l.value === topLocationEntry[0]) : null;

        // Peak hours
        const hourCounts: number[] = Array(24).fill(0);
        logs.forEach(log => {
            const hour = new Date(log.logged_at).getHours();
            hourCounts[hour]++;
        });
        const peakHour = hourCounts.indexOf(Math.max(...hourCounts));

        // Daily average
        const dayMap = new Map<string, number>();
        logs.forEach(log => {
            const day = new Date(log.logged_at).toDateString();
            dayMap.set(day, (dayMap.get(day) || 0) + 1);
        });
        const dailyAvg = logs.length / Math.max(dayMap.size, 1);

        // Determine Archetype
        let archetype = {
            name: 'The Habitual Smoker',
            desc: 'Your smoking connects deeply to your daily routine.',
            icon: Clock
        };

        if (topMood?.value === 'stressed' || topMood?.value === 'anxious') {
            archetype = {
                name: 'The Stress Reliever',
                desc: 'You mostly use smoking as a way to cope with pressure or anxiety.',
                icon: Brain
            };
        } else if (topActivity?.value === 'socializing' || topActivity?.value === 'phone' || topLocation?.value === 'bar') {
            archetype = {
                name: 'The Socialite',
                desc: 'Your habits are strongly linked to being around others.',
                icon: Sparkles
            };
        } else if (topActivity?.value === 'driving' || topLocation?.value === 'car') {
            archetype = {
                name: 'The Highway Cruiser',
                desc: 'Driving is a major trigger for you.',
                icon: Target
            };
        } else if (peakHour < 5 || peakHour > 21) {
            archetype = {
                name: 'The Night Owl',
                desc: 'You tend to smoke more during the quiet hours of the night.',
                icon: Moon
            };
        } else if (topActivity?.value === 'work') {
            archetype = {
                name: 'The Workhorse',
                desc: 'Work breaks are your primary smoking ritual.',
                icon: Briefcase
            };
        }

        return {
            topMood,
            topMoodCount: topMoodEntry ? topMoodEntry[1] : 0,
            topActivity,
            topActivityCount: topActivityEntry ? topActivityEntry[1] : 0,
            topLocation,
            topLocationCount: topLocationEntry ? topLocationEntry[1] : 0,
            peakHour,
            dailyAvg,
            totalLogs: logs.length,
            archetype
        };
    }, [logs]);

    const formatHour = (hour: number) => {
        if (hour === 0) return '12 AM';
        if (hour === 12) return '12 PM';
        return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
    };

    if (!insights) {
        return (
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Insights</h1>
                </header>
                <main className={styles.main}>
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIconCircle}>
                            <Lightbulb size={40} />
                        </div>
                        <h2>Discover Your Patterns</h2>
                        <p>Log 5 cigarettes to unlock your personalized smoker archetype and insights.</p>
                        <div className={styles.progress}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${(logs.length / 5) * 100}%` }}
                            />
                        </div>
                        <p className={styles.progressText}>{logs.length} / 5 logged</p>
                    </div>
                </main>
            </div>
        );
    }

    const ArchetypeIcon = insights.archetype.icon;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Your Insights</h1>

                <p className={styles.subtitle}>Based on {insights.totalLogs} logs</p>
            </header>

            <main className={styles.main}>
                {/* Hero: Archetype Identity */}
                <div className={styles.archetypeCard}>
                    <div className={styles.archetypeTitle}>Your Smoking Profile</div>
                    <div className={styles.archetypeIcon}>
                        <ArchetypeIcon size={48} strokeWidth={1.5} />
                    </div>
                    <h2 className={styles.archetypeName}>{insights.archetype.name}</h2>
                    <p className={styles.archetypeDesc}>{insights.archetype.desc}</p>
                </div>

                {/* Grid Stats */}
                <div className={styles.statsGrid}>
                    {/* Top Trigger */}
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <Zap size={14} className={styles.statIcon} /> Main Trigger
                        </div>
                        <div className={styles.statValue}>
                            {insights.topMood?.label || insights.topActivity?.label || 'N/A'}
                        </div>
                        <div className={styles.statSubtext}>
                            Most frequent cause
                        </div>
                    </div>

                    {/* Peak Time */}
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <Clock size={14} className={styles.statIcon} /> Peak Time
                        </div>
                        <div className={styles.statValue}>
                            {formatHour(insights.peakHour)}
                        </div>
                        <div className={styles.statSubtext}>
                            High risk hour
                        </div>
                    </div>

                    {/* Top Place */}
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <MapPin size={14} className={styles.statIcon} /> Top Place
                        </div>
                        <div className={styles.statValue}>
                            {insights.topLocation?.label || 'N/A'}
                        </div>
                        <div className={styles.statSubtext}>
                            Most common location
                        </div>
                    </div>

                    {/* Daily Avg */}
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <BarChart3 size={14} className={styles.statIcon} /> Daily Avg
                        </div>
                        <div className={styles.statValue}>
                            {insights.dailyAvg.toFixed(1)}
                        </div>
                        <div className={styles.statSubtext}>
                            Cigs per day
                        </div>
                    </div>
                </div>

                {/* Tips */}
                <div className={styles.tipsCard}>
                    <div className={styles.tipsHeader}>
                        <TrendingUp size={24} color="var(--primary-500)" />
                        <h3 className={styles.tipsTitle}>Smart Tips</h3>
                    </div>
                    <div className={styles.tipsList}>
                        {insights.topMood && (
                            <div className={styles.tipItem}>
                                <Zap size={16} className={styles.tipIcon} />
                                <span>
                                    Since <strong>{insights.topMood.label}</strong> is a trigger, try a 1-minute breathing exercise when you feel it coming.
                                </span>
                            </div>
                        )}
                        <div className={styles.tipItem}>
                            <Clock size={16} className={styles.tipIcon} />
                            <span>
                                Be extra vigilant around <strong>{formatHour(insights.peakHour)}</strong>. Plan a distraction for this time.
                            </span>
                        </div>
                        <div className={styles.tipItem}>
                            <Target size={16} className={styles.tipIcon} />
                            <span>
                                Consider leaving your cigarettes in a harder-to-reach place to break the automatic habit.
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}


