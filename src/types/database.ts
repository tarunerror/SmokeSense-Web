// Database types for SmokeSense

export interface Profile {
    id: string;
    display_name: string | null;
    pin_hash: string | null;
    app_disguise_enabled: boolean;
    disguise_name: string;
    phase: 'awareness' | 'control' | 'reduction';
    daily_budget: number | null;
    cigarette_price: number | null;
    motivation_reason: string | null;
    motivation_image: string | null;
    created_at: string;
    updated_at: string;
}

export interface CigaretteLog {
    id: string;
    user_id: string;
    logged_at: string;
    mood: string | null;
    activity: string | null;
    location: string | null;
    was_delayed: boolean;
    delay_duration: number | null;
    notes: string | null;
    synced: boolean;
    created_at: string;
}

export interface TriggerPattern {
    id: string;
    user_id: string;
    trigger_type: string;
    description: string | null;
    frequency: number;
    last_occurred: string | null;
    created_at: string;
}

export interface ReductionGoal {
    id: string;
    user_id: string;
    target_daily: number;
    start_date: string;
    end_date: string | null;
    strategy: string | null;
    is_active: boolean;
    created_at: string;
}

// Mood options for logging
export const MOOD_OPTIONS = [
    { value: 'stressed', label: 'Stressed', color: '#ef4444' },
    { value: 'anxious', label: 'Anxious', color: '#f97316' },
    { value: 'bored', label: 'Bored', color: '#eab308' },
    { value: 'social', label: 'Social', color: '#22c55e' },
    { value: 'relaxed', label: 'Relaxed', color: '#06b6d4' },
    { value: 'happy', label: 'Happy', color: '#8b5cf6' },
    { value: 'tired', label: 'Tired', color: '#6366f1' },
    { value: 'focused', label: 'Focused', color: '#ec4899' },
] as const;

// Activity options for logging
export const ACTIVITY_OPTIONS = [
    { value: 'work', label: 'Working' },
    { value: 'break', label: 'On Break' },
    { value: 'meal', label: 'After Meal' },
    { value: 'coffee', label: 'With Coffee' },
    { value: 'driving', label: 'Driving' },
    { value: 'walking', label: 'Walking' },
    { value: 'socializing', label: 'Socializing' },
    { value: 'phone', label: 'On Phone' },
    { value: 'wakeup', label: 'Just Woke Up' },
    { value: 'bedtime', label: 'Before Bed' },
] as const;

// Location options for logging
export const LOCATION_OPTIONS = [
    { value: 'home', label: 'Home' },
    { value: 'work', label: 'Work' },
    { value: 'outside', label: 'Outside' },
    { value: 'car', label: 'Car' },
    { value: 'bar', label: 'Bar/Restaurant' },
    { value: 'friend', label: 'Friend\'s Place' },
    { value: 'other', label: 'Other' },
] as const;

export type MoodType = typeof MOOD_OPTIONS[number]['value'];
export type ActivityType = typeof ACTIVITY_OPTIONS[number]['value'];
export type LocationType = typeof LOCATION_OPTIONS[number]['value'];
