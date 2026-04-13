import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, useColorScheme, Alert, RefreshControl, Share, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut, Share2, Trash2 } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '~/src/lib/supabase';
import { useAuth } from '~/src/context/AuthProvider';

import ProfileHeader from '~/src/components/profile/ProfileHeader';
import { StatsCard } from '~/src/components/profile/StatsRow';
import ContactInfo from '~/src/components/profile/ContactInfo';
import SocialLinks from '~/src/components/profile/SocialLinks';
import ProfileQRCode from '~/src/components/profile/ProfileQRCode';

import { buildSocialLinks } from '~/src/utils/buildSocialLinks';
import { ProfileSkeleton } from '~/src/components/Skeleton';
import { Feedback } from '~/src/utils/Feedback';

const Index: React.FC = () => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#ffffff' : '#111827';
  const { profile, setProfile, session } = useAuth();
  const [connectionCount, setConnectionCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const socialList = useMemo(() => (profile ? buildSocialLinks(profile) : []), [profile]);

  const fetchStats = useCallback(async () => {
    if (!session?.user?.id) return;
    const { count } = await supabase
      .from('connections')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', session.user.id);
    setConnectionCount(count ?? 0);
  }, [session?.user?.id]);

  const refreshProfile = useCallback(async () => {
    if (!session?.user?.id) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    if (data) setProfile(data);
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshProfile(), fetchStats()]);
    setRefreshing(false);
  }, [refreshProfile, fetchStats]);

  const handleShare = async () => {
    if (!profile) return;
    Feedback.light();
    try {
      await Share.share({
        message: `Connect with ${profile.fullname} on Pingou!\n\nUser ID: ${profile.user_id}`,
      });
    } catch (_) {}
  };

  const handleLogout = () => {
    Feedback.medium();
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

  const handleDeleteAccount = () => {
    Feedback.heavy();
    Alert.alert(
      'Delete Account',
      'This will permanently delete your profile, connections, and all data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Are you sure?', 'Type is final. All your data will be gone forever.', [
              { text: 'Go Back', style: 'cancel' },
              {
                text: 'Yes, Delete',
                style: 'destructive',
                onPress: async () => {
                  if (!session?.user?.id) return;
                  // Delete connections, folders, profile in order
                  await supabase.from('connections').delete().eq('owner_id', session.user.id);
                  await supabase.from('connections').delete().eq('connected_to', session.user.id);
                  await supabase.from('folders').delete().eq('owner_id', session.user.id);
                  await supabase.from('profiles').delete().eq('user_id', session.user.id);
                  // Delete storage
                  await supabase.storage.from('pfp').remove([`${session.user.id}.jpg`]);
                  // Sign out
                  await supabase.auth.signOut();
                },
              },
            ]);
          },
        },
      ]
    );
  };

  if (!profile) {
    return <ProfileSkeleton />;
  }

  return (
    <View className="flex-1 bg-neutral-100 dark:bg-neutral-900">
      {/* Top-right action buttons */}
      <View style={{ position: 'absolute', top: insets.top + 8, right: 16, zIndex: 10, flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          onPress={handleShare}
          activeOpacity={0.6}
          className="h-9 w-9 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
          <Share2 size={16} color={iconColor} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.6}
          className="h-9 w-9 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
          <LogOut size={16} color={iconColor} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 90 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <ProfileHeader
          fullName={profile.fullname}
          tagline={profile.bio || profile.nickname}
          avatarUrl={profile.profile_url}
        />

        <StatsCard pingTokens={0} connections={connectionCount} />

        <View className="mt-8">
          <ProfileQRCode userId={profile.user_id} />
        </View>

        <View className="mt-6">
          <ContactInfo email={profile.email} phone={profile.phone} />
        </View>

        <View className="mb-8 mt-6">
          <SocialLinks links={socialList} />
        </View>

        {/* Delete account — bottom of profile */}
        <TouchableOpacity
          onPress={handleDeleteAccount}
          className="mx-4 mb-4 flex-row items-center justify-center rounded-xl py-3">
          <Trash2 size={16} color="#EF4444" />
          <Text className="ml-2 text-sm text-red-500">Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Index;
