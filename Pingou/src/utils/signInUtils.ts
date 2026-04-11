import { supabase } from '../lib/supabase';
import * as AppleAuthentication from 'expo-apple-authentication';

interface AuthResult {
  success: boolean;
  error: any;
}

export const handleLoginUtil = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error };
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err };
  }
};

export const handleLoginWithAppleAuthUtil = async (): Promise<AuthResult> => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      return { success: false, error: new Error('No identity token from Apple') };
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });

    if (error) return { success: false, error };
    return { success: true, error: null };
  } catch (err: any) {
    if (err.code === 'ERR_REQUEST_CANCELED') {
      return { success: false, error: new Error('Apple sign-in was cancelled') };
    }
    return { success: false, error: err };
  }
};
