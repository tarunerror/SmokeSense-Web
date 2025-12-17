import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AnalyticsContent from '@/components/analytics/AnalyticsContent';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Fetch last 30 days of logs
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: logs } = await supabase
        .from('cigarette_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', thirtyDaysAgo.toISOString())
        .order('logged_at', { ascending: false });

    return (
        <AnalyticsContent
            profile={profile}
            logs={logs || []}
        />
    );
}
