'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { usePathname } from 'next/navigation';

interface DisguiseContextType {
    isDisguised: boolean;
    toggleDisguise: () => void;
    setDisguise: (value: boolean) => void;
    disguiseName: string;
}

const DisguiseContext = createContext<DisguiseContextType | undefined>(undefined);

export function DisguiseProvider({ children }: { children: ReactNode }) {
    const [isDisguised, setIsDisguised] = useState(false);
    const [disguiseName, setDisguiseName] = useState('Notes'); // Default disguise name
    const supabase = createClient();

    // Load initial preference
    useEffect(() => {
        const loadPreference = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('app_disguise_enabled, disguise_name')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setIsDisguised(data.app_disguise_enabled);
                    if (data.disguise_name) setDisguiseName(data.disguise_name);
                }
            }
        };
        loadPreference();
    }, [supabase]);

    // Update document title when disguised
    useEffect(() => {
        if (isDisguised) {
            document.title = disguiseName;
        } else {
            document.title = 'SmokeSense - Your Journey';
        }
    }, [isDisguised, disguiseName]);

    const toggleDisguise = async () => {
        const newState = !isDisguised;
        setIsDisguised(newState);

        // Persist to DB if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase
                .from('profiles')
                .update({ app_disguise_enabled: newState })
                .eq('id', user.id);
        }
    };

    return (
        <DisguiseContext.Provider value={{
            isDisguised,
            toggleDisguise,
            setDisguise: setIsDisguised,
            disguiseName
        }}>
            {children}
        </DisguiseContext.Provider>
    );
}

export function useDisguise() {
    const context = useContext(DisguiseContext);
    if (context === undefined) {
        throw new Error('useDisguise must be used within a DisguiseProvider');
    }
    return context;
}
