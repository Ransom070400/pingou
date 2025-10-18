import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut } from 'lucide-react-native';
import { supabase } from '~/src/lib/supabase';

// Child components
import ProfileHeader from '~/src/components/profile/ProfileHeader';
import { StatsCard } from '~/src/components/profile/StatsRow';
import ContactInfo from '~/src/components/profile/ContactInfo';
import SocialLinks from '~/src/components/profile/SocialLinks';
import ProfileQRCode from '~/src/components/profile/ProfileQRCode';

// Types + helper
import { ProfileType } from '~/src/types/ProfileTypes';
import { buildSocialLinks } from '~/src/utils/buildSocialLinks';

const mockProfile: ProfileType = {
  user_id: 'uuid-123',
  email: 'daveydenco@gmail.com',
  nickname: 'davey',
  fullname: 'Davey Eke',
  instagram: 'instagram.com/username',
  twitter: 'x.com/formerly_twitter',
  linkedin: 'linkedin.com/daveyeke',
  phone: '08123456789',
  extras: ['behance.net/daveyeke'],
  created_at: '2025-09-16T00:00:00Z',
  updated_at: '2025-09-16T00:00:00Z',
};

const Index: React.FC = () => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#ffffff' : '#111827';

  const socialList = useMemo(() => buildSocialLinks(mockProfile), []);

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            Alert.alert('Logout Error', error.message);
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-neutral-100 dark:bg-neutral-900">
      {/* Pinned logout icon (doesn't push content) */}
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
          fullName={mockProfile.fullname}
          tagline="I write production code"
          avatarUrl={mockProfile.profile_url}
        />

        {/* Stats */}
        <StatsCard pingTokens={0} connections={10} />

        {/* QR Code */}
        <View className="mt-8">
          <ProfileQRCode userId={mockProfile.user_id} />
        </View>

        {/* Contact */}
        <View className="mt-6">
          <ContactInfo email={mockProfile.email} phone={mockProfile.phone} />
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
