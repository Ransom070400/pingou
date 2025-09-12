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
  loading: false,
  session: null,
} as any);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // current user profile
  const [profile, setProfile] = useState<ProfileType | null>(null);
  // loading flag used while fetching profile data
  const [loading, setLoading] = useState(false);
  // auth session from Supabase
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // avoid updating state after unmount
    let mounted = true;

    // initialize session once on mount
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
    };
    init();

    // subscribe to auth state changes once
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // cleanup: mark unmounted and unsubscribe listener
    return () => {
      mounted = false;
      // unsubscribe the Supabase real-time listener safely
      listener?.subscription?.unsubscribe();
    };
    // run only once on mount — this effect does not need to run when profile changes
  }, []); // <-- changed from [profile] to [] to avoid re-subscribing on profile updates

  useEffect(() => {
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
            // profile might not exist yet
            setProfile(null);
          } else {
            setProfile(data ?? null);
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.warn('Failed to load profile from Supabase', err);
        setProfile(null);
      } finally {
        // ensure loading false only if component still mounted
        if (mounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [session]);

  return (
    <AuthContext.Provider value={{ profile, setProfile, loading, session }}>
      {children}
    </AuthContext.Provider>
  );
};