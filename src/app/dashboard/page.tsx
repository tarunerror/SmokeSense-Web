import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardContent from '@/components/dashboard/DashboardContent';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Fetch today's logs
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: todayLogs } = await supabase
        .from('cigarette_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', today.toISOString())
        .order('logged_at', { ascending: false });

    // Fetch last 7 days for trend
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: weekLogs } = await supabase
        .from('cigarette_logs')
        .select('logged_at')
        .eq('user_id', user.id)
        .gte('logged_at', weekAgo.toISOString());

    return (
        <DashboardContent
            user={user}
            profile={profile}
            initialTodayLogs={todayLogs || []}
            weekLogs={weekLogs || []}
        />
    );
}
