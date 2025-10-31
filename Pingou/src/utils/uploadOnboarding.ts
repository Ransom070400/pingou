import { supabase } from '~/src/lib/supabase';
import { ProfilePayload } from '~/types/types';


/**
 * Uploads the onboarding profile data to Supabase
 * Creates the user profile for the first time during onboarding
 * @param payload -  The payload we are uploading
 * @returns Promise with the upload result
 */
export const uploadOnboarding = async (
  payload: ProfilePayload,
): Promise<{ success: boolean; error?: string; data?: any }> => {
  try {
    // 1. Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {   
      throw new Error('User not authenticated');
    }

    // 3. Insert profile data to database (first time creation during onboarding)
    const { data, error: dbError } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        display_name: payload.name,
        bio: payload.bio,
        phone: payload.phone,
        instagram: payload.instagram,
        twitter: payload.x,
        linkedin: payload.linkedin,
        extras: payload.extras || [],
        image_uri: payload.imageUri || null,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Failed to save profile: ${dbError.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error uploading onboarding data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};