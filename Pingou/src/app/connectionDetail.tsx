import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, Linking, Alert, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Mail, Phone, Instagram, Linkedin, Twitter, Globe, Link } from 'lucide-react-native';
import { supabase } from '~/src/lib/supabase';
import { ProfileType } from '~/src/types/ProfileTypes';
import { buildSocialLinks } from '~/src/utils/buildSocialLinks';

export default function ConnectionDetail() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backIconColor = isDark ? '#fff' : '#111';
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      setProfile(data ?? null);
      setLoading(false);
    };
    load();
  }, [userId]);

  const socialLinks = useMemo(() => (profile ? buildSocialLinks(profile) : []), [profile]);

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n.charAt(0)).join('').toUpperCase();

  const getSocialIcon = (id: string) => {
    switch (id) {
      case 'instagram': return <Instagram size={20} color="#E4405F" />;
      case 'twitter': return <Twitter size={20} color="#1DA1F2" />;
      case 'linkedin': return <Linkedin size={20} color="#0A66C2" />;
      case 'website': return <Globe size={20} color="#6B7280" />;
      default: return <Link size={20} color="#6B7280" />;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <Text className="text-neutral-500">Loading...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <Text className="text-neutral-500">Profile not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-100 dark:bg-neutral-900">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top + 8 }}
        className="flex-row items-center px-4 pb-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <ArrowLeft size={24} color={backIconColor} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black dark:text-white">Connection</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}>

        {/* Avatar + Name */}
        <View className="items-center pt-6">
          <View className="h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-neutral-200 shadow-lg">
            {profile.profile_url ? (
              <Image source={{ uri: profile.profile_url }} className="h-full w-full" resizeMode="cover" />
            ) : (
              <Text className="text-3xl font-bold text-neutral-500">
                {getInitials(profile.fullname)}
              </Text>
            )}
          </View>
          <Text className="mt-4 text-2xl font-bold text-black dark:text-white">
            {profile.fullname}
          </Text>
          <Text className="mt-1 text-sm text-neutral-500">@{profile.nickname}</Text>
        </View>

        {/* Contact Info */}
        <View className="mx-4 mt-6 rounded-2xl bg-white p-4 dark:bg-neutral-800">
          <Text className="mb-3 text-xs font-bold uppercase text-neutral-400">Contact</Text>

          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={() => Linking.openURL(`mailto:${profile.email}`)}>
            <Mail size={20} color="#6B7280" />
            <Text className="ml-3 flex-1 text-base text-black dark:text-white">{profile.email}</Text>
          </TouchableOpacity>

          {profile.phone && (
            <TouchableOpacity
              className="flex-row items-center border-t border-neutral-100 py-3 dark:border-neutral-700"
              onPress={() => Linking.openURL(`tel:${profile.phone}`)}>
              <Phone size={20} color="#6B7280" />
              <Text className="ml-3 flex-1 text-base text-black dark:text-white">{profile.phone}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <View className="mx-4 mt-4 rounded-2xl bg-white p-4 dark:bg-neutral-800">
            <Text className="mb-3 text-xs font-bold uppercase text-neutral-400">Socials</Text>
            {socialLinks.map((link, idx) => (
              <TouchableOpacity
                key={link.id}
                className={`flex-row items-center py-3 ${idx > 0 ? 'border-t border-neutral-100 dark:border-neutral-700' : ''}`}
                onPress={() => Linking.openURL(link.url)}>
                {getSocialIcon(link.id)}
                <Text className="ml-3 flex-1 text-base text-black dark:text-white">{link.label}</Text>
                <Text className="text-sm text-neutral-400" numberOfLines={1}>
                  {link.url.replace(/^https?:\/\//, '')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
