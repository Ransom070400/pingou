import { supabase } from "../lib/supabase";
import * as AppleAuthentication from 'expo-apple-authentication';
import { LoginReturnType } from "../types/AuthTypes";




/**
 * Function to sign in with supabase auth 
 */
export const handleLoginUtil = async (email: string, password: string) : Promise<LoginReturnType> => {
    if (!email.trim() || !password) return { error: new Error("Invalid input"), success: false };
     const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
    });

    if (signInError){
       return {
        error: signInError!,
        success: false
    };
    }
    return {
        error: new Error(""),
        success: true
    };
}


export const handleLoginWithAppleAuthUtil = async (): Promise<LoginReturnType> => {
     const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });


      if (!credential.identityToken) throw new Error('No identityToken.');

      const {
        error: appleError,
        data: { user },
      } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });


      if (appleError) {
      return {
        error: appleError!,
        success: false
    };
      }

      return {
        error: new Error(""),
        success: true
    };

}