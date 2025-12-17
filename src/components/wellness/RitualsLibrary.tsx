'use client';

import { useState } from 'react';
import { Shuffle, Zap, Droplets, Wind, Move, Gamepad2, Brain, Coffee } from 'lucide-react';
import styles from './RitualsLibrary.module.css';

const RITUALS = [
    {
        icon: <Droplets size={20} />,
        title: 'Hydrate',
        action: 'Drink a full glass of cold water slowly.',
        duration: '1 min',
        color: 'var(--primary-500)',
        bg: 'var(--primary-100)'
    },
    {
        icon: <Wind size={20} />,
        title: 'Breathe',
        action: 'Take 10 deep breaths. Inhale for 4s, hold for 4s, exhale for 4s.',
        duration: '2 mins',
        color: 'var(--accent-500)',
        bg: 'var(--accent-100)'
    },
    {
        icon: <Move size={20} />,
        title: 'Move',
        action: 'Do 10 jumping jacks or a quick stretch.',
        duration: '2 mins',
        color: '#f59e0b',
        bg: '#fef3c7'
    },
    {
        icon: <Gamepad2 size={20} />,
        title: 'Play',
        action: 'Play a quick mobile game or solve a puzzle.',
        duration: '5 mins',
        color: '#ec4899',
        bg: '#fce7f3'
    },
    {
        icon: <Brain size={20} />,
        title: 'Visualize',
        action: 'Close your eyes and visualize your "Why".',
        duration: '1 min',
        color: '#8b5cf6',
        bg: '#ede9fe'
    },
    {
        icon: <Coffee size={20} />,
        title: 'Swap',
        action: 'Make a cup of herbal tea or chew some gum.',
        duration: '5 mins',
        color: '#10b981',
        bg: '#d1fae5'
    }
];

export default function RitualsLibrary() {
    const [ritual, setRitual] = useState(RITUALS[0]);
    const [isAnimating, setIsAnimating] = useState(false);

    const spin = () => {
        setIsAnimating(true);
        setTimeout(() => {
            const random = RITUALS[Math.floor(Math.random() * RITUALS.length)];
            setRitual(random);
            setIsAnimating(false);
        }, 300);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Craving Shield</h3>
                <button
                    className={styles.spinBtn}
                    onClick={spin}
                    disabled={isAnimating}
                >
                    <Shuffle size={16} className={isAnimating ? styles.spinning : ''} />
                    <span>New Idea</span>
                </button>
            </div>

            <div className={`${styles.card} ${isAnimating ? styles.cardHidden : ''}`}>
                <div className={styles.iconBox} style={{ color: ritual.color, background: ritual.bg.replace(')', ', 0.1)') }}>
                    {ritual.icon}
                </div>
                <div className={styles.content}>
                    <h4 className={styles.ritualTitle}>{ritual.title}</h4>
                    <p className={styles.ritualAction}>{ritual.action}</p>
                    <span className={styles.duration} style={{ color: ritual.color }}>{ritual.duration}</span>
                </div>
            </div>
        </div>
    );
}
