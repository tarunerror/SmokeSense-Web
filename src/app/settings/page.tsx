'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useUIStore } from '@/stores';
import { useRouter } from 'next/navigation';
import type { Profile } from '@/types';
import styles from './settings.module.css';
import {
    LogOut,
    Trash2,
    AlertTriangle,
    Check,
    X,
    Sun,
    Moon,
    Monitor,
    Eye,
    ShieldCheck,
    TrendingDown,
    Github
} from 'lucide-react';
import { useDisguise } from '@/components/providers/DisguiseProvider';

export default function SettingsPage() {
    const supabase = createClient();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const { theme, setTheme } = useUIStore();

    // Form state
    const [displayName, setDisplayName] = useState('');
    const [phase, setPhase] = useState<'awareness' | 'control' | 'reduction'>('awareness');
    const [dailyBudget, setDailyBudget] = useState<string>('');
    const [cigarettePrice, setCigarettePrice] = useState<string>('');
    const { isDisguised, toggleDisguise, setDisguise, disguiseName: savedDisguiseName } = useDisguise();
    // Local state for input, syncs with context on load
    const [localDisguiseName, setLocalDisguiseName] = useState(savedDisguiseName);

    useEffect(() => {
        setLocalDisguiseName(savedDisguiseName);
    }, [savedDisguiseName]);

    useEffect(() => {
        const loadProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile(data);
                setDisplayName(data.display_name || '');
                setPhase(data.phase || 'awareness');
                setDailyBudget(data.daily_budget?.toString() || '');
                setCigarettePrice(data.cigarette_price?.toString() || '');
                setDisguise(data.app_disguise_enabled || false);
                // No need to set disguiseName here as the hook handles it via its own effect, 
                // but we can sync local state if needed. The useEffect at the top handles this.
            }
            setLoading(false);
        };

        loadProfile();
    }, [supabase, router]);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setMessage({ type: 'error', text: 'Not authenticated' });
                setSaving(false);
                return;
            }

            const updateData = {
                id: user.id,
                display_name: displayName || null,
                phase,
                daily_budget: dailyBudget ? parseInt(dailyBudget) : null,
                cigarette_price: cigarettePrice ? parseFloat(cigarettePrice) : null,
                app_disguise_enabled: isDisguised,
                disguise_name: localDisguiseName,
            };

            const { error } = await supabase
                .from('profiles')
                .upsert(updateData, { onConflict: 'id' });

            if (error) {
                console.error('Save error:', error);
                setMessage({ type: 'error', text: `Failed to save: ${error.message}` });
            } else {
                setProfile({ ...profile, ...updateData } as Profile);
                setMessage({ type: 'success', text: 'Settings saved successfully' });
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        }

        setSaving(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    const handleResetStats = async () => {
        setResetting(true);
        setMessage(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setMessage({ type: 'error', text: 'Not authenticated' });
                setResetting(false);
                return;
            }

            const { error } = await supabase
                .from('cigarette_logs')
                .delete()
                .eq('user_id', user.id);

            if (error) {
                console.error('Reset error:', error);
                setMessage({ type: 'error', text: `Failed to reset: ${error.message}` });
            } else {
                setMessage({ type: 'success', text: 'All stats have been reset' });
                setShowResetConfirm(false);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        }

        setResetting(false);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <span className="spinner"></span>
                    Loading settings...
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Settings</h1>
                <button
                    className={styles.headerIconBtn}
                    onClick={handleSignOut}
                    aria-label="Sign Out"
                >
                    <LogOut size={20} />
                </button>
            </header>

            <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                    {displayName ? displayName.charAt(0).toUpperCase() : '?'}
                </div>
                <h2 className={styles.profileName}>{displayName || 'New User'}</h2>
                <div className="chip chip-primary">
                    {phase.charAt(0).toUpperCase() + phase.slice(1)} Mode
                </div>
            </div>

            <main className={styles.main}>
                {message && (
                    <div className={`${styles.message} ${message.type === 'error' ? styles.messageError : styles.messageSuccess}`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Your Journey</h2>

                    <div className={styles.field}>
                        <label className={styles.label}>Current Phase</label>
                        <div className={styles.phaseGrid}>
                            <button
                                className={`${styles.phaseCard} ${phase === 'awareness' ? styles.phaseActive : ''}`}
                                onClick={() => setPhase('awareness')}
                            >
                                <span className={styles.phaseIcon}>
                                    <Eye size={24} />
                                </span>
                                <div className={styles.phaseInfo}>
                                    <div className={styles.phaseName}>Awareness</div>
                                    <div className={styles.phaseDesc}>Track habits</div>
                                </div>
                            </button>
                            <button
                                className={`${styles.phaseCard} ${phase === 'control' ? styles.phaseActive : ''}`}
                                onClick={() => setPhase('control')}
                            >
                                <span className={styles.phaseIcon}>
                                    <ShieldCheck size={24} />
                                </span>
                                <div className={styles.phaseInfo}>
                                    <div className={styles.phaseName}>Control</div>
                                    <div className={styles.phaseDesc}>Set limits</div>
                                </div>
                            </button>
                            <button
                                className={`${styles.phaseCard} ${phase === 'reduction' ? styles.phaseActive : ''}`}
                                onClick={() => setPhase('reduction')}
                            >
                                <span className={styles.phaseIcon}>
                                    <TrendingDown size={24} />
                                </span>
                                <div className={styles.phaseInfo}>
                                    <div className={styles.phaseName}>Reduction</div>
                                    <div className={styles.phaseDesc}>Cut down</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Display Name</label>
                        <input
                            type="text"
                            className="input"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="What should we call you?"
                        />
                    </div>
                </section>

                {/* Appearance Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Appearance</h2>
                    <div className={styles.phaseGrid}>
                        <button
                            className={`${styles.phaseCard} ${theme === 'light' ? styles.phaseActive : ''}`}
                            onClick={() => setTheme('light')}
                        >
                            <span className={styles.phaseIcon}>
                                <Sun size={24} />
                            </span>
                            <div className={styles.phaseInfo}>
                                <div className={styles.phaseName}>Light</div>
                            </div>
                        </button>
                        <button
                            className={`${styles.phaseCard} ${theme === 'dark' ? styles.phaseActive : ''}`}
                            onClick={() => setTheme('dark')}
                        >
                            <span className={styles.phaseIcon}>
                                <Moon size={24} />
                            </span>
                            <div className={styles.phaseInfo}>
                                <div className={styles.phaseName}>Dark</div>
                            </div>
                        </button>
                        <button
                            className={`${styles.phaseCard} ${theme === 'system' ? styles.phaseActive : ''}`}
                            onClick={() => setTheme('system')}
                        >
                            <span className={styles.phaseIcon}>
                                <Monitor size={24} />
                            </span>
                            <div className={styles.phaseInfo}>
                                <div className={styles.phaseName}>System</div>
                            </div>
                        </button>
                    </div>
                </section>

                {/* Budget Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Budget & Tracking</h2>

                    <div className={styles.budgetGrid}>
                        <div className={styles.field}>
                            <label className={styles.label}>Daily Limit</label>
                            <p className={styles.hint}>Target cigarettes/day</p>
                            <div className={styles.inputGroup}>
                                <span className={styles.inputIcon}>
                                    <ShieldCheck size={18} />
                                </span>
                                <input
                                    type="number"
                                    className={styles.inputWithIcon}
                                    value={dailyBudget}
                                    onChange={(e) => setDailyBudget(e.target.value)}
                                    placeholder="e.g. 10"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Cost per Pack/Stick</label>
                            <p className={styles.hint}>Price in ₹</p>
                            <div className={styles.inputGroup}>
                                <span className={styles.inputIcon}>₹</span>
                                <input
                                    type="number"
                                    className={styles.inputWithIcon}
                                    value={cigarettePrice}
                                    onChange={(e) => setCigarettePrice(e.target.value)}
                                    placeholder="e.g. 18"
                                    min="0"
                                    step="0.50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cost Preview Card */}
                    {dailyBudget && cigarettePrice && (
                        <div className={styles.costPreview}>
                            <div className={styles.costItem}>
                                <span className={styles.costLabel}>Monthly Estimate</span>
                                <span className={styles.costValue}>
                                    ₹{(parseInt(dailyBudget) * parseFloat(cigarettePrice) * 30).toLocaleString()}
                                </span>
                            </div>
                            <div className={styles.costItem}>
                                <span className={styles.costLabel}>Yearly Estimate</span>
                                <span className={styles.costValue}>
                                    ₹{(parseInt(dailyBudget) * parseFloat(cigarettePrice) * 365).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )}
                </section>

                {/* Privacy Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Privacy</h2>

                    <div className={styles.toggle}>
                        <div>
                            <label className={styles.label}>App Disguise</label>
                            <p className={styles.hint}>Masks the browser tab title and icon</p>
                        </div>
                        <button
                            className={`${styles.toggleBtn} ${isDisguised ? styles.toggleBtnActive : ''}`}
                            onClick={toggleDisguise}
                            aria-pressed={isDisguised}
                        >
                            <span className={styles.toggleThumb}></span>
                        </button>
                    </div>

                    {isDisguised && (
                        <div className={`${styles.field} animate-fade-in-up`} style={{ marginTop: '1.5rem' }}>
                            <label className={styles.label}>Disguise Name</label>
                            <div className={styles.inputGroup} style={{ marginBottom: '1rem' }}>
                                <span className={styles.inputIcon}>
                                    <Eye size={18} />
                                </span>
                                <input
                                    type="text"
                                    className={styles.inputWithIcon}
                                    value={localDisguiseName}
                                    onChange={(e) => setLocalDisguiseName(e.target.value)}
                                    placeholder="e.g. Google Docs"
                                />
                            </div>

                            {/* Tab Preview */}
                            <div className={styles.tabPreview}>
                                <div className={styles.tabBar}>
                                    <div className={styles.tab}>
                                        <span className={styles.tabIcon}>📄</span>
                                        <span className={styles.tabTitle}>{localDisguiseName || 'New Tab'}</span>
                                        <X size={12} className={styles.tabClose} />
                                    </div>
                                    <div className={styles.tabNew}>+</div>
                                </div>
                                <div className={styles.tabContentPreview}>
                                    <p>How it will look in your browser</p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Actions */}
                <div className={styles.actions}>
                    <button
                        className={styles.saveBtn}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? <span className="spinner"></span> : <Check size={20} />}
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>

                {/* Danger Zone - Reset Stats */}
                <section className={`${styles.section} ${styles.dangerSection}`}>
                    <h2 className={styles.dangerTitle}>
                        <AlertTriangle size={16} /> Danger Zone
                    </h2>

                    {!showResetConfirm ? (
                        <button
                            className={styles.resetBtn}
                            onClick={() => setShowResetConfirm(true)}
                        >
                            Reset All Data
                        </button>
                    ) : (
                        <div className={styles.confirmBox}>
                            <p className={styles.confirmText}>
                                This will permanently delete all your logs.
                            </p>
                            <div className={styles.confirmActions}>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setShowResetConfirm(false)}
                                    disabled={resetting}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary btn-sm"
                                    style={{ background: '#ef4444', borderColor: '#ef4444' }}
                                    onClick={handleResetStats}
                                    disabled={resetting}
                                >
                                    {resetting ? 'Deleting...' : 'Confirm Delete'}
                                </button>
                            </div>
                        </div>
                    )}
                </section>
                <div className={styles.credits}>
                    Developed by<a href="https://github.com/tarunerror" target="_blank" rel="noopener noreferrer" className={styles.creditsLink}>
                        <Github size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        Tarun Gautam
                    </a>
                </div>
            </main>
        </div>
    );
}
