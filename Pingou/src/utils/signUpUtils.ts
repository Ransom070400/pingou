import { supabase } from '../lib/supabase';
import { LoginReturnType } from '../types/AuthTypes';

export const handleUserSignUp = async (email: string, password: string): Promise<LoginReturnType> => {
  if (!email.trim() || !password) return { error: new Error('Invalid input'), success: false };

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) return { error, success: false };
  return { error: new Error(''), success: true };
};
