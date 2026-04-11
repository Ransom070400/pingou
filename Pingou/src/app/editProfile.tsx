import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '~/src/lib/supabase';
import { useAuth } from '~/src/context/AuthProvider';
import {
  SectionCard,
  FieldLabel,
  PlaceholderInput,
  SocialRow,
  AddMoreRow,
  FooterActions,
} from '../components/edit-profile';

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const { profile, setProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  // Pre-populate from current profile
  const [fullname, setFullname] = useState(profile?.fullname ?? '');
  const [nickname, setNickname] = useState(profile?.nickname ?? '');
  const email = profile?.email ?? '';
  const [phone, setPhone] = useState(profile?.phone ?? '');

  const idRef = React.useRef(0);
  const nextId = React.useCallback(() => `social-${idRef.current++}`, []);

  const [socials, setSocials] = useState([
    { id: nextId(), name: 'Instagram', value: profile?.instagram ?? '' },
    { id: nextId(), name: 'X', value: profile?.twitter ?? '' },
    { id: nextId(), name: 'LinkedIn', value: profile?.linkedin ?? '' },
    ...(profile?.extras ?? []).map((url) => ({ id: nextId(), name: 'Custom', value: url })),
  ]);

  const addSocialRow = () =>
    setSocials((prev) => [...prev, { id: nextId(), name: 'Custom', value: '' }]);

  const updateSocial = (id: string, value: string) =>
    setSocials((prev) => prev.map((s) => (s.id === id ? { ...s, value } : s)));

  const handleUpdate = async () => {
    if (!profile) return;
    setLoading(true);

    const instagram = socials.find((s) => s.name === 'Instagram')?.value || null;
    const twitter = socials.find((s) => s.name === 'X')?.value || null;
    const linkedin = socials.find((s) => s.name === 'LinkedIn')?.value || null;
    const extras = socials
      .filter((s) => s.name === 'Custom' && s.value.trim())
      .map((s) => s.value.trim());

    const updates = {
      fullname,
      nickname,
      phone: phone || null,
      instagram,
      twitter,
      linkedin,
      extras,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', profile.user_id)
      .select()
      .single();

    setLoading(false);

    if (error) {
      Alert.alert('Update Error', error.message);
      return;
    }

    setProfile(data);
    router.back();
  };

  return (
    <View className="flex-1 bg-neutral-100 dark:bg-neutral-900">
      <ScrollView
        className="flex-1 overflow-hidden"
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: Math.max(insets.bottom, 16),
        }}
        contentInsetAdjustmentBehavior="never"
        scrollIndicatorInsets={{ top: insets.top, bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}>
        <SectionCard title="About you">
          <FieldLabel text="Your name" />
          <PlaceholderInput value={fullname} onChangeText={setFullname} placeholder="Full name" />
          <View className="h-4" />
          <FieldLabel text="Nickname" />
          <PlaceholderInput value={nickname} onChangeText={setNickname} placeholder="Nickname" />
        </SectionCard>

        <SectionCard title="Contact information">
          <FieldLabel text="Email" />
          <PlaceholderInput value={email} placeholder="Email (read-only)" />
          <View className="h-4" />
          <FieldLabel text="Phone" />
          <PlaceholderInput value={phone} onChangeText={setPhone} placeholder="Phone number" />
        </SectionCard>

        <SectionCard title="Social media">
          {socials.map((s, idx) => (
            <View key={s.id} className={idx === 0 ? '' : 'mt-3'}>
              <Text className="mb-2 text-xs font-bold text-neutral-900 dark:text-neutral-100">
                {s.name === 'X' ? 'X (Formerly Twitter)' : s.name}
              </Text>
              <SocialRow
                name={s.name}
                value={s.value}
                onChangeText={(t) => updateSocial(s.id, t)}
              />
            </View>
          ))}
          <AddMoreRow onPress={addSocialRow} />
        </SectionCard>
      </ScrollView>

      <View style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
        <FooterActions onUpdate={handleUpdate} loading={loading} />
      </View>
    </View>
  );
}
