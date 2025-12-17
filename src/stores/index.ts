import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile, CigaretteLog } from '@/types';

interface UserState {
    profile: Profile | null;
    isLoading: boolean;
    isPinLocked: boolean;
    setProfile: (profile: Profile | null) => void;
    setLoading: (loading: boolean) => void;
    setPinLocked: (locked: boolean) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            profile: null,
            isLoading: true,
            isPinLocked: false,
            setProfile: (profile) => set({ profile }),
            setLoading: (isLoading) => set({ isLoading }),
            setPinLocked: (isPinLocked) => set({ isPinLocked }),
        }),
        {
            name: 'smokesense-user',
            partialize: (state) => ({ isPinLocked: state.isPinLocked }),
        }
    )
);

interface LoggingState {
    todayLogs: CigaretteLog[];
    isLogging: boolean;
    showExpandedForm: boolean;
    pendingOfflineLogs: CigaretteLog[];
    setTodayLogs: (logs: CigaretteLog[]) => void;
    addLog: (log: CigaretteLog) => void;
    setLogging: (logging: boolean) => void;
    setShowExpandedForm: (show: boolean) => void;
    addPendingLog: (log: CigaretteLog) => void;
    removePendingLog: (id: string) => void;
    clearPendingLogs: () => void;
}

export const useLoggingStore = create<LoggingState>()(
    persist(
        (set) => ({
            todayLogs: [],
            isLogging: false,
            showExpandedForm: false,
            pendingOfflineLogs: [],
            setTodayLogs: (todayLogs) => set({ todayLogs }),
            addLog: (log) => set((state) => {
                if (state.todayLogs.some(l => l.id === log.id)) return state;
                return { todayLogs: [log, ...state.todayLogs] };
            }),
            setLogging: (isLogging) => set({ isLogging }),
            setShowExpandedForm: (showExpandedForm) => set({ showExpandedForm }),
            addPendingLog: (log) => set((state) => ({
                pendingOfflineLogs: [...state.pendingOfflineLogs, log]
            })),
            removePendingLog: (id) => set((state) => ({
                pendingOfflineLogs: state.pendingOfflineLogs.filter(l => l.id !== id)
            })),
            clearPendingLogs: () => set({ pendingOfflineLogs: [] }),
        }),
        {
            name: 'smokesense-logging',
            partialize: (state) => ({ pendingOfflineLogs: state.pendingOfflineLogs }),
        }
    )
);

interface DelayState {
    isDelayActive: boolean;
    delayEndTime: number | null;
    delayDuration: number; // in seconds
    setDelayActive: (active: boolean, duration?: number) => void;
    clearDelay: () => void;
}

export const useDelayStore = create<DelayState>((set) => ({
    isDelayActive: false,
    delayEndTime: null,
    delayDuration: 0,
    setDelayActive: (active, duration = 120) => set({
        isDelayActive: active,
        delayEndTime: active ? Date.now() + duration * 1000 : null,
        delayDuration: duration,
    }),
    clearDelay: () => set({
        isDelayActive: false,
        delayEndTime: null,
        delayDuration: 0,
    }),
}));

interface UIState {
    theme: 'light' | 'dark' | 'system';
    isSidebarOpen: boolean;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            theme: 'system',
            isSidebarOpen: false,
            setTheme: (theme) => set({ theme }),
            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
            setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
        }),
        {
            name: 'smokesense-ui',
        }
    )
);
