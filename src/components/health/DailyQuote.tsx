'use client';

import { useState, useEffect } from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import styles from './DailyQuote.module.css';

const QUOTES = [
    { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
    { text: "You differ from a great tree. A tree takes many years to become strong. You can become strong in a moment.", author: "Unknown" },
    { text: "Your recovered health is the greatest wealth.", author: "Unknown" },
    { text: "Every cigarette you don't smoke is a victory.", author: "SmokeSense" },
    { text: "Healing is a matter of time, but it is sometimes also a matter of opportunity.", author: "Hippocrates" },
    { text: "The comeback is always stronger than the setback.", author: "Unknown" },
    { text: "It's never too late to be what you might have been.", author: "George Eliot" },
    { text: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
    { text: "Fall seven times and stand up eight.", author: "Japanese Proverb" },
    { text: "Small steps every day add up to big results.", author: "Unknown" },
    { text: "Focus on progress, not perfection.", author: "Bill Phillips" },
];

export default function DailyQuote() {
    const [quote, setQuote] = useState(QUOTES[0]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Pick a random quote on mount (client-side only to avoid hydration mismatch potentially, 
        // though strictly matching server logic is better. For now random is fine as it's just a quote)
        const randomIndex = Math.floor(Math.random() * QUOTES.length);
        setQuote(QUOTES[randomIndex]);
    }, []);

    const handleNewQuote = () => {
        setIsAnimating(true);
        setTimeout(() => {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * QUOTES.length);
            } while (QUOTES[newIndex].text === quote.text);

            setQuote(QUOTES[newIndex]);
            setIsAnimating(false);
        }, 300); // Wait for fade out
    };

    return (
        <div className={styles.container}>
            <div className={styles.decoration}>
                <Quote size={48} className={styles.quoteIcon} />
            </div>

            <div className={`${styles.content} ${isAnimating ? styles.fadeOut : styles.fadeIn}`}>
                <p className={styles.text}>"{quote.text}"</p>
                <p className={styles.author}>— {quote.author}</p>
            </div>

            <button
                onClick={handleNewQuote}
                className={styles.refreshBtn}
                aria-label="New Quote"
            >
                <RefreshCw size={14} />
            </button>
        </div>
    );
}
