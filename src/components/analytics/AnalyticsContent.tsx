'use client';

import { useMemo } from 'react';
import { format, startOfDay, subDays, eachDayOfInterval } from 'date-fns';
import type { Profile, CigaretteLog } from '@/types';
import { MOOD_OPTIONS } from '@/types';
import dynamic from 'next/dynamic';
import styles from './Analytics.module.css';

const TrendChart = dynamic(() => import('./TrendChart'), {
    loading: () => <div className="animate-pulse h-[200px] bg-white/5 rounded-xl" />
});

const Projections = dynamic(() => import('./Projections'), {
    loading: () => <div className="animate-pulse h-[300px] bg-white/5 rounded-xl" />
});
import {
    Frown,
    AlertTriangle,
    Meh,
    Users,
    Sun,
    Smile,
    Moon,
    Zap,
    TrendingUp,
    Clock,
    Wallet
} from 'lucide-react';

interface AnalyticsContentProps {
    profile: Profile | null;
    logs: CigaretteLog[];
}

const getMoodIcon = (value: string) => {
    switch (value) {
        case 'stressed': return <Frown size={20} />;
        case 'anxious': return <AlertTriangle size={20} />;
        case 'bored': return <Meh size={20} />;
        case 'social': return <Users size={20} />;
        case 'relaxed': return <Sun size={20} />;
        case 'happy': return <Smile size={20} />;
        case 'tired': return <Moon size={20} />;
        case 'focused': return <Zap size={20} />;
        default: return <Meh size={20} />;
    }
};

export default function AnalyticsContent({ profile, logs }: AnalyticsContentProps) {

    // Calculate daily data for chart
    const dailyData = useMemo(() => {
        const days = eachDayOfInterval({
            start: subDays(new Date(), 29),
            end: new Date(),
        });

        return days.map(day => {
            const dayStart = startOfDay(day);
            const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

            const dayLogs = logs.filter(log => {
                const logDate = new Date(log.logged_at);
                return logDate >= dayStart && logDate < dayEnd;
            });

            return {
                date: day,
                count: dayLogs.length,
                label: format(day, 'MMM d'),
            };
        });
    }, [logs]);

    // Calculate mood breakdown
    const moodBreakdown = useMemo(() => {
        const counts: Record<string, number> = {};
        logs.forEach(log => {
            if (log.mood) {
                counts[log.mood] = (counts[log.mood] || 0) + 1;
            }
        });

        return MOOD_OPTIONS.map(mood => ({
            ...mood,
            count: counts[mood.value] || 0,
            percentage: logs.length > 0 ? ((counts[mood.value] || 0) / logs.length * 100) : 0,
        })).filter(m => m.count > 0).sort((a, b) => b.count - a.count);
    }, [logs]);

    // Calculate time-of-day breakdown
    const hourlyBreakdown = useMemo(() => {
        const hours = Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            count: 0,
            label: format(new Date().setHours(i, 0, 0, 0), 'ha'),
        }));

        logs.forEach(log => {
            const hour = new Date(log.logged_at).getHours();
            hours[hour].count++;
        });

        return hours;
    }, [logs]);

    const maxHourlyCount = Math.max(...hourlyBreakdown.map(h => h.count), 1);

    // Financial calculations
    const pricePerCig = profile?.cigarette_price || 15;
    const totalSpent = logs.length * pricePerCig;
    const dailyAvg = logs.length / 30;
    const monthlyProjection = dailyAvg * 30 * pricePerCig;
    const yearlyProjection = dailyAvg * 365 * pricePerCig;

    // Stats
    const avgPerDay = dailyData.reduce((sum, d) => sum + d.count, 0) / 30;
    const maxDay = dailyData.reduce((max, d) => d.count > max ? d.count : max, 0);
    const minDay = dailyData.reduce((min, d) => d.count < min ? d.count : min, maxDay);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Stats</h1>
                <p className={styles.subtitle}>Your 30-day analytics</p>
            </header>

            <main className={styles.main}>
                {/* Overview Stats */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>30-Day Overview</h2>
                    <div className={styles.statsGrid}>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{logs.length}</span>
                            <span className={styles.statLabel}>Total</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{avgPerDay.toFixed(1)}</span>
                            <span className={styles.statLabel}>Daily Avg</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{minDay}</span>
                            <span className={styles.statLabel}>Best Day</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{maxDay}</span>
                            <span className={styles.statLabel}>Peak Day</span>
                        </div>
                    </div>
                </section>

                {/* Daily Chart */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Daily Trend</h2>
                    <div className={styles.chartWrapper}>
                        <TrendChart data={dailyData} />
                    </div>
                </section>

                {/* Future Projections */}
                <Projections
                    currentDailyAverage={Math.round(avgPerDay) || 10}
                    pricePerUnit={pricePerCig}
                />

                {/* Time of Day Heatmap */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Time of Day</h2>
                    <div className={styles.cardHeaderWithIcon}>
                        <Clock size={20} className="text-secondary" />
                        <p className={styles.cardHint}>When you smoke most</p>
                    </div>
                    <div className={styles.hourGrid}>
                        {hourlyBreakdown.map(hour => (
                            <div
                                key={hour.hour}
                                className={styles.hourCell}
                                style={{
                                    background: hour.count > 0
                                        ? `var(--primary-500)`
                                        : 'var(--bg-tertiary)',
                                    opacity: hour.count > 0 ? 0.6 + (hour.count / maxHourlyCount) * 0.4 : 1,
                                }}
                                title={`${hour.label}: ${hour.count} cigarettes`}
                            >
                                <span className={styles.hourLabel}>{hour.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mood Breakdown */}
                {moodBreakdown.length > 0 && (
                    <section className={styles.card}>
                        <h2 className={styles.cardTitle}>Mood Triggers</h2>
                        <div className={styles.moodList}>
                            {moodBreakdown.slice(0, 5).map(mood => (
                                <div key={mood.value} className={styles.moodItem}>
                                    <span className={styles.moodEmoji} style={{ color: mood.color }}>
                                        {getMoodIcon(mood.value)}
                                    </span>
                                    <div className={styles.moodBar}>
                                        <div
                                            className={styles.moodFill}
                                            style={{
                                                width: `${mood.percentage}%`,
                                                background: mood.color,
                                            }}
                                        />
                                    </div>
                                    <span className={styles.moodCount}>{mood.count}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Financial Impact */}
                <section className={styles.card}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Wallet size={24} className="text-primary" />
                        <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Financial Impact</h2>
                    </div>

                    <div className={styles.financialGrid}>
                        <div className={styles.financialItem}>
                            <span className={styles.financialValue}>₹{totalSpent.toFixed(0)}</span>
                            <span className={styles.financialLabel}>Last 30 days</span>
                        </div>
                        <div className={styles.financialItem}>
                            <span className={styles.financialValue}>₹{monthlyProjection.toFixed(0)}</span>
                            <span className={styles.financialLabel}>Monthly projection</span>
                        </div>
                        <div className={`${styles.financialItem} ${styles.financialHighlight}`}>
                            <span className={styles.financialValue}>₹{yearlyProjection.toFixed(0)}</span>
                            <span className={styles.financialLabel}>Yearly projection</span>
                        </div>
                    </div>

                    <div className={styles.alternatives}>
                        <p className={styles.alternativesTitle}>What ₹{yearlyProjection.toFixed(0)} could buy:</p>
                        <ul className={styles.alternativesList}>
                            {yearlyProjection >= 150 && <li>🍫 A giant chocolate bar</li>}
                            {yearlyProjection >= 300 && <li>🎬 A month of streaming</li>}
                            {yearlyProjection >= 500 && <li>🎥 Movie ticket & popcorn</li>}
                            {yearlyProjection >= 750 && <li>🍕 A fancy pizza dinner</li>}
                            {yearlyProjection >= 1000 && <li>📚 A bestseller hardback</li>}
                            {yearlyProjection >= 1500 && <li>🔊 Bluetooth speaker</li>}
                            {yearlyProjection >= 2000 && <li>👕 A branded t-shirt</li>}
                            {yearlyProjection >= 3000 && <li>👟 New running shoes</li>}
                            {yearlyProjection >= 4000 && <li>🎮 A video game</li>}
                            {yearlyProjection >= 5000 && <li>🎧 Premium earbuds</li>}
                            {yearlyProjection >= 7500 && <li>⌚ A smart fitness watch</li>}
                            {yearlyProjection >= 10000 && <li>📱 A budget tablet</li>}
                            {yearlyProjection >= 15000 && <li>📱 A mid-range smartphone</li>}
                            {yearlyProjection >= 25000 && <li>🏨 A luxury weekend getaway</li>}
                            {yearlyProjection >= 30000 && <li>🏖️ A Goa trip</li>}
                            {yearlyProjection >= 40000 && <li>🎮 Latest gaming console</li>}
                            {yearlyProjection >= 50000 && <li>💻 A new laptop</li>}
                            {yearlyProjection >= 75000 && <li>🛵 An electric scooter</li>}
                            {yearlyProjection >= 100000 && <li>✈️ International trip</li>}
                            {yearlyProjection < 150 && <li>☕ A nice coffee</li>}
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}
