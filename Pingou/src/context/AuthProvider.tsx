import React, { createContext, useState, useContext, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { ProfileType } from '../types/ProfileTypes';

const AuthContext = createContext<{
  profile: ProfileType | null;
  setProfile: React.Dispatch<React.SetStateAction<ProfileType | null>>;
  loading: boolean;
  session: Session | null;
}>({
  profile: null,
  setProfile: () => {},
  loading: true,
  session: null,
} as any);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  // 1. Initialize session + subscribe to auth changes
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          setSession(data.session ?? null);
        }
      } catch (err) {
        console.warn('Failed to get session:', err);
        if (mounted) setSession(null);
      } finally {
        if (mounted) setInitialized(true);
      }
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (mounted) setSession(sess);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // 2. Fetch profile once initialized and whenever session changes
  useEffect(() => {
    if (!initialized) return;

    let mounted = true;

    const loadProfile = async () => {
      setLoading(true);
      try {
        if (session?.user?.id) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (!mounted) return;
          if (error) {
            setProfile(null);
          } else {
            setProfile(data ?? null);
          }
        } else {
          if (mounted) setProfile(null);
        }
      } catch (err) {
        console.warn('Failed to load profile:', err);
        if (mounted) setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [session, initialized]);

  return (
    <AuthContext.Provider value={{ profile, setProfile, loading, session }}>
      {children}
    </AuthContext.Provider>
  );
};
