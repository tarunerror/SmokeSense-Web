'use client';

import { useState, useMemo } from 'react';
import styles from './Projections.module.css';
import {
    Calculator,
    TrendingDown,
    Clock,
    Wallet,
    Heart,
    ArrowRight
} from 'lucide-react';

interface ProjectionsProps {
    currentDailyAverage: number;
    pricePerUnit: number; // Price per cigarette
    currencySymbol?: string;
}

export default function Projections({
    currentDailyAverage = 10,
    pricePerUnit = 18,
    currencySymbol = '₹'
}: ProjectionsProps) {
    const [reductionPercent, setReductionPercent] = useState(50);
    const [reductionTarget, setReductionTarget] = useState(Math.round(currentDailyAverage * 0.5));

    // Time spent per cigarette (in minutes) - average estimate
    const MINUTES_PER_CIGARETTE = 7;

    // Handle slider change
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const percent = parseInt(e.target.value);
        setReductionPercent(percent);
        setReductionTarget(Math.round(currentDailyAverage * (1 - percent / 100)));
    };

    const projections = useMemo(() => {
        const cigarettesAvoidedDaily = currentDailyAverage - reductionTarget;
        const cigarettesAvoidedYearly = cigarettesAvoidedDaily * 365;

        // Financials
        const dailySavings = cigarettesAvoidedDaily * pricePerUnit;
        const monthlySavings = dailySavings * 30;
        const yearlySavings = dailySavings * 365;
        const fiveYearSavings = yearlySavings * 5;

        // Time
        const minutesSavedDaily = cigarettesAvoidedDaily * MINUTES_PER_CIGARETTE;
        const hoursSavedYearly = (minutesSavedDaily * 365) / 60;
        const daysSavedYearly = hoursSavedYearly / 24;

        return {
            dailySavings,
            monthlySavings,
            yearlySavings,
            fiveYearSavings,
            minutesSavedDaily,
            hoursSavedYearly,
            daysSavedYearly
        };
    }, [currentDailyAverage, reductionTarget, pricePerUnit]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2 className={styles.title}>
                    <Calculator className="text-primary" size={24} />
                    Future Projection
                </h2>
                <p className={styles.subtitle}>
                    Visualize the impact of reducing your intake. Move the slider to see your potential savings.
                </p>
            </header>

            {/* Interactive Slider */}
            <div className={styles.controls}>
                <div className={styles.labelRow}>
                    <span className={styles.controlLabel}>
                        Reduction Goal: <span className="text-primary">-{reductionPercent}%</span>
                    </span>
                    <span className={styles.controlValue}>
                        {reductionTarget} <span className={styles.subtext}>cigs/day</span>
                    </span>
                </div>

                <div className={styles.sliderContainer}>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={reductionPercent}
                        onChange={handleSliderChange}
                        className={styles.slider}
                        aria-label="Reduction percentage slider"
                    />
                </div>

                <div className={styles.sliderMarkers}>
                    <span className={styles.marker}>Current ({currentDailyAverage})</span>
                    <span className={styles.marker}>-50%</span>
                    <span className={styles.marker}>Quit (0)</span>
                </div>
            </div>

            {/* Results Grid */}
            <div className={styles.grid}>

                {/* Financial Impact */}
                <div className={`${styles.card} ${styles.moneyCard}`}>
                    <div className={styles.cardHeader}>
                        <Wallet size={18} />
                        <span>Wallet</span>
                    </div>
                    <div className={styles.highlight}>
                        {currencySymbol}{projections.yearlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className={styles.subtext}>saved per year</div>

                    <div className={styles.detailsList}>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Monthly</span>
                            <span className={styles.detailValue}>{currencySymbol}{projections.monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>In 5 Years</span>
                            <span className={styles.detailValue}>{currencySymbol}{projections.fiveYearSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                    </div>
                </div>

                {/* Time Impact */}
                <div className={`${styles.card} ${styles.timeCard}`}>
                    <div className={styles.cardHeader}>
                        <Clock size={18} />
                        <span>Life Reclaimed</span>
                    </div>
                    <div className={styles.highlight}>
                        {Math.round(projections.hoursSavedYearly)} hrs
                    </div>
                    <div className={styles.subtext}>free time per year</div>

                    <div className={styles.detailsList}>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Daily</span>
                            <span className={styles.detailValue}>{Math.round(projections.minutesSavedDaily)} mins</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Days/Year</span>
                            <span className={styles.detailValue}>{projections.daysSavedYearly.toFixed(1)} days</span>
                        </div>
                    </div>
                </div>

                {/* Health Impact */}
                <div className={`${styles.card} ${styles.healthCard}`}>
                    <div className={styles.cardHeader}>
                        <Heart size={18} />
                        <span>Health Recovery</span>
                    </div>

                    {reductionPercent === 100 ? (
                        <>
                            <div className={styles.highlight}>Optimal</div>
                            <div className={styles.subtext}>Maximum recovery speed</div>
                            <div className={styles.detailsList}>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Lung Function</span>
                                    <span className={styles.detailValue}>Improving</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Heart Risk</span>
                                    <span className={styles.detailValue}>Halved in 1yr</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.highlight}>
                                {Math.round(reductionPercent)}% Better
                            </div>
                            <div className={styles.subtext}>Reduced harmful exposure</div>
                            <div className={styles.healthProgress}>
                                <div
                                    className={styles.healthBar}
                                    style={{ width: `${reductionPercent}%` }}
                                />
                            </div>
                            <div className={styles.detailsList} style={{ marginTop: '1rem' }}>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Toxin Load</span>
                                    <span className={styles.detailValue}>-{reductionPercent}%</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}
