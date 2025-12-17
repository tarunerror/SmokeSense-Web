'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './BreathingExercise.module.css';

interface BreathingExerciseProps {
    onComplete?: () => void;
    onSkip?: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

const BREATHING_PATTERN = {
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 2,
};

export default function BreathingExercise({ onComplete, onSkip }: BreathingExerciseProps) {
    const [phase, setPhase] = useState<Phase>('inhale');
    const [timeInPhase, setTimeInPhase] = useState(BREATHING_PATTERN.inhale);
    const [cycleCount, setCycleCount] = useState(0);
    const [isActive, setIsActive] = useState(true);

    const TOTAL_CYCLES = 3;

    const getNextPhase = useCallback((currentPhase: Phase): Phase => {
        switch (currentPhase) {
            case 'inhale':
                return 'hold';
            case 'hold':
                return 'exhale';
            case 'exhale':
                return 'rest';
            case 'rest':
                return 'inhale';
        }
    }, []);

    useEffect(() => {
        if (!isActive) return;

        const timer = setInterval(() => {
            setTimeInPhase((prev) => {
                if (prev <= 1) {
                    const nextPhase = getNextPhase(phase);

                    if (nextPhase === 'inhale') {
                        const newCycleCount = cycleCount + 1;
                        if (newCycleCount >= TOTAL_CYCLES) {
                            setIsActive(false);
                            onComplete?.();
                            return 0;
                        }
                        setCycleCount(newCycleCount);
                    }

                    setPhase(nextPhase);
                    return BREATHING_PATTERN[nextPhase];
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, phase, cycleCount, getNextPhase, onComplete]);

    const getPhaseText = () => {
        switch (phase) {
            case 'inhale':
                return 'Breathe in...';
            case 'hold':
                return 'Hold...';
            case 'exhale':
                return 'Breathe out...';
            case 'rest':
                return 'Rest...';
        }
    };

    const getScale = () => {
        switch (phase) {
            case 'inhale':
                return 1 + (BREATHING_PATTERN.inhale - timeInPhase) / BREATHING_PATTERN.inhale * 0.3;
            case 'hold':
                return 1.3;
            case 'exhale':
                return 1.3 - (BREATHING_PATTERN.exhale - timeInPhase) / BREATHING_PATTERN.exhale * 0.3;
            case 'rest':
                return 1;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>4-7-8 Breathing</h3>
                <p className={styles.subtitle}>
                    Cycle {cycleCount + 1} of {TOTAL_CYCLES}
                </p>
            </div>

            <div className={styles.visualWrapper}>
                <div
                    className={styles.breathCircle}
                    style={{ transform: `scale(${getScale()})` }}
                >
                    <div className={styles.innerCircle}>
                        <span className={styles.countdown}>{timeInPhase}</span>
                    </div>
                </div>
            </div>

            <p className={styles.instruction}>{getPhaseText()}</p>

            <button
                className={`btn btn-ghost ${styles.skipBtn}`}
                onClick={onSkip}
            >
                Skip exercise
            </button>
        </div>
    );
}
