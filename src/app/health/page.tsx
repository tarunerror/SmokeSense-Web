import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import HealthJourney from '@/components/dashboard/HealthJourney';
import MotivationCard from '@/components/health/MotivationCard';
import RitualsLibrary from '@/components/wellness/RitualsLibrary';
import DailyQuote from '@/components/health/DailyQuote';
import styles from './page.module.css';

export const metadata = {
    title: 'Health Journey | SmokeSense',
    description: 'Track your body\'s healing process in real-time.',
};

export default async function HealthPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Fetch the most recent cigarette log to calculate health timeline
    const { data: logs } = await supabase
        .from('cigarette_logs')
        .select('logged_at')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(1);

    const lastLoggedAt = logs && logs.length > 0 ? logs[0].logged_at : null;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Your Healing Journey</h1>
                <p className={styles.subtitle}>Every minute counts towards a healthier you.</p>
            </header>
            <main className={styles.main}>
                <div className={styles.grid}>
                    <div className={styles.motivationSection}>
                        <MotivationCard />
                        <RitualsLibrary />
                        <DailyQuote />
                    </div>
                    <div className={styles.healthCard}>
                        <HealthJourney lastLoggedAt={lastLoggedAt} />
                    </div>
                </div>
            </main>
        </div>
    );
}
