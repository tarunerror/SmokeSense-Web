import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import InsightsContent from '@/components/insights/InsightsContent';

export const dynamic = 'force-dynamic';

export default async function InsightsPage() {
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

    // Fetch all logs for analysis
    const { data: logs } = await supabase
        .from('cigarette_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });

    return (
        <InsightsContent
            profile={profile}
            logs={logs || []}
        />
    );
}
