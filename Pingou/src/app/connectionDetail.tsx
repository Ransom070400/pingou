import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  TextInput,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Mail, Phone, StickyNote } from 'lucide-react-native';
import { supabase } from '~/src/lib/supabase';
import { useAuth } from '~/src/context/AuthProvider';
import { ProfileType } from '~/src/types/ProfileTypes';
import { buildSocialLinks } from '~/src/utils/buildSocialLinks';
import { getPlatformById } from '~/src/config/socialPlatforms';
import { Feedback } from '~/src/utils/Feedback';

export default function ConnectionDetail() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backIconColor = isDark ? '#fff' : '#111';
  const { session } = useAuth();

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  // Note state
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [noteDraft, setNoteDraft] = useState('');
  const [editingNote, setEditingNote] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!userId || !session?.user?.id) return;

      // Fetch the other user's profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      setProfile(profileData ?? null);

      // Fetch the current user's connection row for this user (to get the note)
      const { data: connData } = await supabase
        .from('connections')
        .select('id, note')
        .eq('owner_id', session.user.id)
        .eq('connected_to', userId)
        .single();

      if (connData) {
        setConnectionId(connData.id);
        setNote(connData.note ?? '');
        setNoteDraft(connData.note ?? '');
      }

      setLoading(false);
    };
    load();
  }, [userId, session?.user?.id]);

  const socialLinks = useMemo(() => (profile ? buildSocialLinks(profile) : []), [profile]);

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n.charAt(0)).join('').toUpperCase();

  const saveNote = async () => {
    if (!connectionId) return;
    setSavingNote(true);
    const trimmed = noteDraft.trim();
    const { error } = await supabase
      .from('connections')
      .update({ note: trimmed || null })
      .eq('id', connectionId);

    setSavingNote(false);
    if (error) {
      console.error('Failed to save note', error);
      return;
    }
    Feedback.success();
    setNote(trimmed);
    setEditingNote(false);
  };

  const cancelEdit = () => {
    setNoteDraft(note);
    setEditingNote(false);
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
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View className="flex-1 bg-neutral-100 dark:bg-neutral-900">
        {/* Header */}
        <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center px-4 pb-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <ArrowLeft size={24} color={backIconColor} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-black dark:text-white">Connection</Text>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Avatar + Name */}
          <View className="items-center pt-6">
            <View className="h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-neutral-200 shadow-lg dark:border-neutral-700">
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
            {profile.bio ? (
              <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">"{profile.bio}"</Text>
            ) : (
              <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">@{profile.nickname}</Text>
            )}
          </View>

          {/* Private Note — only visible to the current user */}
          <View className="mx-4 mt-6 rounded-2xl bg-white p-4 dark:bg-neutral-800">
            <View className="mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <StickyNote size={14} color="#9CA3AF" />
                <Text className="ml-2 text-xs font-bold uppercase text-neutral-400">
                  Private Note
                </Text>
              </View>
              {editingNote ? (
                <View className="flex-row gap-3">
                  <TouchableOpacity onPress={cancelEdit}>
                    <Text className="text-xs text-neutral-500 dark:text-neutral-400">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveNote} disabled={savingNote}>
                    <Text className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {savingNote ? 'Saving...' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setEditingNote(true)}>
                  <Text className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {note ? 'Edit' : 'Add'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {editingNote ? (
              <TextInput
                className="min-h-[80px] rounded-lg bg-neutral-100 p-3 text-base text-black dark:bg-neutral-700 dark:text-white"
                placeholder="e.g. Met at React Conf Jan 2026, interested in AI..."
                placeholderTextColor="#9CA3AF"
                value={noteDraft}
                onChangeText={setNoteDraft}
                multiline
                autoFocus
                textAlignVertical="top"
              />
            ) : note ? (
              <Text className="text-base text-black dark:text-white">{note}</Text>
            ) : (
              <Text className="text-sm italic text-neutral-400">
                Tap Add to jot down notes about this connection — only you can see them.
              </Text>
            )}
          </View>

          {/* Contact Info */}
          <View className="mx-4 mt-4 rounded-2xl bg-white p-4 dark:bg-neutral-800">
            <Text className="mb-3 text-xs font-bold uppercase text-neutral-400">Contact</Text>

            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={() => Linking.openURL(`mailto:${profile.email}`)}>
              <Mail size={20} color="#6B7280" />
              <Text className="ml-3 flex-1 text-base text-black dark:text-white">
                {profile.email}
              </Text>
            </TouchableOpacity>

            {profile.phone && (
              <TouchableOpacity
                className="flex-row items-center border-t border-neutral-100 py-3 dark:border-neutral-700"
                onPress={() => Linking.openURL(`tel:${profile.phone}`)}>
                <Phone size={20} color="#6B7280" />
                <Text className="ml-3 flex-1 text-base text-black dark:text-white">
                  {profile.phone}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <View className="mx-4 mt-4 rounded-2xl bg-white p-4 dark:bg-neutral-800">
              <Text className="mb-3 text-xs font-bold uppercase text-neutral-400">Socials</Text>
              {socialLinks.map((link, idx) => {
                const platform = getPlatformById(link.id);
                const Icon = platform?.icon;
                const color = link.color || '#6B7280';

                return (
                  <TouchableOpacity
                    key={link.id}
                    className={`flex-row items-center py-3 ${idx > 0 ? 'border-t border-neutral-100 dark:border-neutral-700' : ''}`}
                    onPress={() => Linking.openURL(link.url)}>
                    <View
                      className="h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: color + '20' }}>
                      {Icon ? <Icon size={16} color={color} /> : null}
                    </View>
                    <Text className="ml-3 flex-1 text-base text-black dark:text-white">
                      {link.label}
                    </Text>
                    <Text className="text-sm text-neutral-400" numberOfLines={1}>
                      {link.url.replace(/^https?:\/\//, '')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
