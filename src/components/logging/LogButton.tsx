'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLoggingStore, useDelayStore } from '@/stores';
import type { CigaretteLog } from '@/types';
import { MOOD_OPTIONS, ACTIVITY_OPTIONS, LOCATION_OPTIONS } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import {
    Plus,
    Cigarette,
    Check,
    Frown,
    Meh,
    Smile,
    Users,
    Sun,
    Zap,
    Moon,
    Briefcase,
    Coffee,
    Utensils,
    Car,
    Footprints,
    Smartphone,
    Home,
    Building2,
    Trees,
    MapPin,
    AlertTriangle,
    Beer
} from 'lucide-react';
import styles from './LogButton.module.css';

interface LogButtonProps {
    userId: string;
    onSuccess?: (log: CigaretteLog) => void;
}

const getMoodIcon = (value: string) => {
    switch (value) {
        case 'stressed': return <Frown size={18} />;
        case 'anxious': return <AlertTriangle size={18} />;
        case 'bored': return <Meh size={18} />;
        case 'social': return <Users size={18} />;
        case 'relaxed': return <Sun size={18} />;
        case 'happy': return <Smile size={18} />;
        case 'tired': return <Moon size={18} />;
        case 'focused': return <Zap size={18} />;
        default: return <Meh size={18} />;
    }
};

const getActivityIcon = (value: string) => {
    switch (value) {
        case 'work': return <Briefcase size={18} />;
        case 'break': return <Coffee size={18} />;
        case 'meal': return <Utensils size={18} />;
        case 'coffee': return <Coffee size={18} />;
        case 'driving': return <Car size={18} />;
        case 'walking': return <Footprints size={18} />;
        case 'socializing': return <Users size={18} />;
        case 'phone': return <Smartphone size={18} />;
        case 'wakeup': return <Sun size={18} />;
        case 'bedtime': return <Moon size={18} />;
        default: return <Cigarette size={18} />;
    }
};

const getLocationIcon = (value: string) => {
    switch (value) {
        case 'home': return <Home size={18} />;
        case 'work': return <Building2 size={18} />;
        case 'outside': return <Trees size={18} />;
        case 'car': return <Car size={18} />;
        case 'bar': return <Beer size={18} />;
        case 'friend': return <Home size={18} />;
        default: return <MapPin size={18} />;
    }
};

export default function LogButton({ userId, onSuccess }: LogButtonProps) {
    const supabase = createClient();
    const { isLogging, setLogging, showExpandedForm, setShowExpandedForm, addPendingLog } = useLoggingStore();
    const { isDelayActive, setDelayActive } = useDelayStore();

    const [mood, setMood] = useState<string | null>(null);
    const [activity, setActivity] = useState<string | null>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const logCigarette = useCallback(async (wasDelayed = false, delayDuration = 0) => {
        setLogging(true);

        const newLog: CigaretteLog = {
            id: uuidv4(),
            user_id: userId,
            logged_at: new Date().toISOString(),
            mood,
            activity,
            location,
            was_delayed: wasDelayed,
            delay_duration: delayDuration,
            notes: null,
            synced: true,
            created_at: new Date().toISOString(),
        };

        try {
            const { error } = await supabase
                .from('cigarette_logs')
                .insert({
                    id: newLog.id,
                    user_id: newLog.user_id,
                    logged_at: newLog.logged_at,
                    mood: newLog.mood,
                    activity: newLog.activity,
                    location: newLog.location,
                    was_delayed: newLog.was_delayed,
                    delay_duration: newLog.delay_duration,
                    notes: newLog.notes,
                });

            if (error) {
                // Store offline and sync later
                console.error('Error logging cigarette:', error);
                addPendingLog({ ...newLog, synced: false });
            }

            // Show success feedback
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 1500);

            // Reset form
            setMood(null);
            setActivity(null);
            setLocation(null);
            setShowExpandedForm(false);

            onSuccess?.(newLog);
        } catch (err) {
            console.error('Failed to log:', err);
            addPendingLog({ ...newLog, synced: false });
        } finally {
            setLogging(false);
        }
    }, [supabase, userId, mood, activity, location, onSuccess, setLogging, addPendingLog, setShowExpandedForm]);

    const handleQuickLog = () => {
        if (isDelayActive) {
            // Already in delay flow, just log
            logCigarette(true, 0);
            setDelayActive(false);
        } else {
            // Log immediately
            logCigarette(false, 0);
        }
    };

    const handleDelayLog = () => {
        setDelayActive(true, 120); // 2 minute delay
        setShowExpandedForm(true);
    };

    if (showSuccess) {
        return (
            <div className={`${styles.fab} ${styles.fabSuccess}`}>
                <Check size={32} strokeWidth={3} />
            </div>
        );
    }

    if (showExpandedForm) {
        return (
            <div className={styles.expandedOverlay} onClick={() => setShowExpandedForm(false)}>
                <div className={styles.expandedCard} onClick={(e) => e.stopPropagation()}>
                    <h3 className={styles.expandedTitle}>Log a Cigarette</h3>

                    <div className={styles.section}>
                        <label className={styles.sectionLabel}>How are you feeling?</label>
                        <div className={styles.optionGrid}>
                            {MOOD_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    className={`${styles.optionBtn} ${mood === option.value ? styles.optionActive : ''}`}
                                    onClick={() => setMood(mood === option.value ? null : option.value)}
                                >
                                    <span style={{ marginRight: 8, display: 'flex' }}>{getMoodIcon(option.value)}</span>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <label className={styles.sectionLabel}>What activity?</label>
                        <div className={styles.optionGrid}>
                            {ACTIVITY_OPTIONS.slice(0, 6).map((option) => (
                                <button
                                    key={option.value}
                                    className={`${styles.optionBtn} ${activity === option.value ? styles.optionActive : ''}`}
                                    onClick={() => setActivity(activity === option.value ? null : option.value)}
                                >
                                    <span style={{ marginRight: 8, display: 'flex' }}>{getActivityIcon(option.value)}</span>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <label className={styles.sectionLabel}>Where are you?</label>
                        <div className={styles.optionGrid}>
                            {LOCATION_OPTIONS.slice(0, 4).map((option) => (
                                <button
                                    key={option.value}
                                    className={`${styles.optionBtn} ${location === option.value ? styles.optionActive : ''}`}
                                    onClick={() => setLocation(location === option.value ? null : option.value)}
                                >
                                    <span style={{ marginRight: 8, display: 'flex' }}>{getLocationIcon(option.value)}</span>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.expandedActions}>
                        <button
                            className={`btn btn-secondary ${styles.cancelBtn}`}
                            onClick={() => setShowExpandedForm(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className={`btn btn-primary ${styles.logBtn}`}
                            onClick={() => logCigarette(isDelayActive, 0)}
                            disabled={isLogging}
                        >
                            {isLogging ? 'Logging...' : 'Log Cigarette'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.fabContainer}>
            <button
                className={styles.delayBtn}
                onClick={handleDelayLog}
                title="Add details before logging"
                aria-label="Add details before logging"
            >
                <Plus size={24} />
            </button>
            <button
                className={styles.fab}
                onClick={handleQuickLog}
                disabled={isLogging}
                aria-label="Log a cigarette"
            >
                {isLogging ? (
                    <span className="spinner" aria-label="Logging..."></span>
                ) : (
                    <Cigarette size={24} strokeWidth={2.5} />
                )}
            </button>
        </div>
    );
}
