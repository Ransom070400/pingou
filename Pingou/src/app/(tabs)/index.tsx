import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut } from 'lucide-react-native';
import { supabase } from '~/src/lib/supabase';
import { useAuth } from '~/src/context/AuthProvider';

// Child components
import ProfileHeader from '~/src/components/profile/ProfileHeader';
import { StatsCard } from '~/src/components/profile/StatsRow';
import ContactInfo from '~/src/components/profile/ContactInfo';
import SocialLinks from '~/src/components/profile/SocialLinks';
import ProfileQRCode from '~/src/components/profile/ProfileQRCode';

// Helper
import { buildSocialLinks } from '~/src/utils/buildSocialLinks';

const Index: React.FC = () => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#ffffff' : '#111827';
  const { profile } = useAuth();

  const socialList = useMemo(
    () => (profile ? buildSocialLinks(profile) : []),
    [profile]
  );

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) Alert.alert('Logout Error', error.message);
        },
      },
    ]);
  };

  if (!profile) return null;

  return (
    <View className="flex-1 bg-neutral-100 dark:bg-neutral-900">
      {/* Logout button */}
      <View style={{ position: 'absolute', top: insets.top + 8, right: 16, zIndex: 10 }}>
        <TouchableOpacity
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          activeOpacity={0.6}
          className="h-9 w-9 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
          <LogOut size={18} color={iconColor} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 90 }}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ProfileHeader
          fullName={profile.fullname}
          tagline={profile.bio || profile.nickname}
          avatarUrl={profile.profile_url}
        />

        {/* Stats */}
        <StatsCard pingTokens={0} connections={0} />

        {/* QR Code */}
        <View className="mt-8">
          <ProfileQRCode userId={profile.user_id} />
        </View>

        {/* Contact */}
        <View className="mt-6">
          <ContactInfo email={profile.email} phone={profile.phone} />
        </View>

        {/* Socials */}
        <View className="mb-8 mt-6">
          <SocialLinks links={socialList} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
