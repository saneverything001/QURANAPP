import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, AppSettings } from '@/types';
import { lightTheme, darkTheme, Theme } from '@/constants/theme';
import type { Session } from '@supabase/supabase-js';

interface AppContextType {
  user: User | null;
  session: Session | null;
  theme: Theme;
  isDark: boolean;
  settings: AppSettings;
  loading: boolean;
  toggleDarkMode: () => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  darkMode: false,
  reciter: 'mishary_alafasy',
  language: 'en',
  arabicFontSize: 'medium',
  notificationsEnabled: true,
  offlineMode: false,
};

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const isDark = settings.darkMode;
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        (async () => {
          await loadProfile(session.user.id);
        })();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      setUser({
        id: userId,
        email: session?.user?.email ?? '',
        display_name: data.display_name,
        avatar_url: data.avatar_url,
        language: data.language,
        reciter: data.reciter,
        streak_days: data.streak_days,
        total_points: data.total_points,
        dark_mode: data.dark_mode,
        notifications_enabled: data.notifications_enabled,
      });
      setSettings((s) => ({
        ...s,
        darkMode: data.dark_mode,
        reciter: data.reciter,
        language: data.language,
        notificationsEnabled: data.notifications_enabled,
      }));
    }
    setLoading(false);
  }

  async function refreshUser() {
    if (session?.user?.id) await loadProfile(session.user.id);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }

  function toggleDarkMode() {
    setSettings((s) => ({ ...s, darkMode: !s.darkMode }));
    if (user) {
      supabase.from('profiles').update({ dark_mode: !settings.darkMode }).eq('id', user.id);
    }
  }

  function updateSettings(partial: Partial<AppSettings>) {
    setSettings((s) => ({ ...s, ...partial }));
  }

  return (
    <AppContext.Provider value={{ user, session, theme, isDark, settings, loading, toggleDarkMode, updateSettings, signOut, refreshUser }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
