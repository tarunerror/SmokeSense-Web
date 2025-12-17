'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, Edit2, Save, X, ImageIcon, Quote } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import styles from './MotivationCard.module.css';

export default function MotivationCard() {
    const supabase = createClient();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [reason, setReason] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Load from Supabase on mount
    useEffect(() => {
        async function loadMotivation() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                setUserId(user.id);

                const { data, error } = await supabase
                    .from('profiles')
                    .select('motivation_reason, motivation_image')
                    .eq('id', user.id)
                    .single();

                if (data && !error) {
                    if (data.motivation_reason) setReason(data.motivation_reason);
                    if (data.motivation_image) setImage(data.motivation_image);
                }
            } catch (error) {
                console.error('Error loading motivation:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadMotivation();
    }, [supabase]);

    const handleSave = async () => {
        if (!userId) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    motivation_reason: reason,
                    motivation_image: image
                })
                .eq('id', userId);

            if (error) throw error;
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving motivation:', error);
            alert('Failed to save changes. Please try again.');
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit still applies for DB text field
                alert('Image must be under 1MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    if (isLoading) {
        return <div className={`${styles.card} ${styles.loadingState}`}>Loading...</div>;
    }

    if (isEditing) {
        return (
            <div className={styles.card}>
                <div className={styles.header}>
                    <h3>Edit Motivation</h3>
                    <button onClick={() => setIsEditing(false)} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.editForm}>
                    <div 
                        className={styles.imageUpload} 
                        onClick={triggerFileSelect}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                triggerFileSelect();
                            }
                        }}
                        aria-label="Upload motivation image"
                    >
                        {image ? (
                            <img src={image} alt="Your motivation image" className={styles.previewImage} />
                        ) : (
                            <div className={styles.uploadPlaceholder}>
                                <ImageIcon size={32} />
                                <span>Tap to add photo</span>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            hidden
                            aria-label="Select motivation image file"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>My "Why"</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="I'm quitting because..."
                            maxLength={100}
                            className={styles.textarea}
                        />
                        <div className={styles.charCount}>{reason.length}/100</div>
                    </div>

                    <button onClick={handleSave} className={styles.saveBtn}>
                        <Save size={18} />
                        Save Motivation
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.card} style={{ backgroundImage: image ? `url(${image})` : 'none' }}>
            {image && <div className={styles.overlay} />}

            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.badge}>
                        <Quote size={14} className={styles.quoteIcon} />
                        <span>My Why</span>
                    </div>
                    <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
                        <Edit2 size={16} />
                    </button>
                </div>

                <div className={styles.body}>
                    {reason ? (
                        <h2 className={styles.reasonText}>"{reason}"</h2>
                    ) : (
                        <div className={styles.emptyState} onClick={() => setIsEditing(true)}>
                            <p>What drives you? Set your motivation here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
