import Link from 'next/link';
import { Eye, Target, TrendingDown, Zap, BarChart2, Shield, Heart, ArrowRight, Leaf } from 'lucide-react';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logoWrapper}>
            <span className={styles.logo}>
              <Leaf size={64} strokeWidth={1.5} />
            </span>
          </div>

          <h1 className={styles.title}>
            <span className={styles.titleMain}>SmokeSense</span>
            <span className={styles.titleSub}>Your Journey, Your Pace</span>
          </h1>

          <p className={styles.description}>
            Understand your smoking habits without judgment.
            Take control when you&apos;re ready. Reduce if you choose.
          </p>

          <div className={styles.phases}>
            <div className={styles.phase}>
              <span className={styles.phaseIcon}>
                <Eye size={24} />
              </span>
              <span className={styles.phaseLabel}>Awareness</span>
            </div>
            <div className={styles.phaseDivider}>
              <ArrowRight size={20} />
            </div>
            <div className={styles.phase}>
              <span className={styles.phaseIcon}>
                <Target size={24} />
              </span>
              <span className={styles.phaseLabel}>Control</span>
            </div>
            <div className={styles.phaseDivider}>
              <ArrowRight size={20} />
            </div>
            <div className={styles.phase}>
              <span className={styles.phaseIcon}>
                <TrendingDown size={24} />
              </span>
              <span className={styles.phaseLabel}>Reduction</span>
            </div>
          </div>

          <div className={styles.cta}>
            <Link href="/auth/signup" className="btn btn-primary btn-lg">
              Start Your Journey
            </Link>
            <Link href="/auth/login" className="btn btn-secondary btn-lg">
              Welcome Back
            </Link>
          </div>

          <div className={styles.features}>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>
                <Zap size={28} />
              </span>
              <div>
                <h3 className={styles.featureTitle}>Instant Logging</h3>
                <p className={styles.featureDesc}>One tap to track your habits. Works offline.</p>
              </div>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>
                <BarChart2 size={28} />
              </span>
              <div>
                <h3 className={styles.featureTitle}>Smart Insights</h3>
                <p className={styles.featureDesc}>Identify triggers and peak times automatically.</p>
              </div>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>
                <Shield size={28} />
              </span>
              <div>
                <h3 className={styles.featureTitle}>100% Private</h3>
                <p className={styles.featureDesc}>Your data stays on your device. Zero judgment.</p>
              </div>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>
                <Heart size={28} />
              </span>
              <div>
                <h3 className={styles.featureTitle}>Visual Progress</h3>
                <p className={styles.featureDesc}>Watch your health & savings grow over time.</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.decoration}>
          <div className={styles.circle1}></div>
          <div className={styles.circle2}></div>
          <div className={styles.circle3}></div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>Free forever. Your data stays yours.</p>
      </footer>
    </main>
  );
}
