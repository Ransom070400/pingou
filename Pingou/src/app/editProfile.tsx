import { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, TextInput, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { supabase } from '~/src/lib/supabase';
import { useAuth } from '~/src/context/AuthProvider';
import { SocialsMap } from '~/src/types/ProfileTypes';
import { SOCIAL_PLATFORMS, CATEGORIES } from '~/src/config/socialPlatforms';
import {
  SectionCard,
  FieldLabel,
  PlaceholderInput,
  FooterActions,
} from '../components/edit-profile';

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { profile, setProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const [fullname, setFullname] = useState(profile?.fullname ?? '');
  const [nickname, setNickname] = useState(profile?.nickname ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const email = profile?.email ?? '';
  const [phone, setPhone] = useState(profile?.phone ?? '');

  // Initialize socials from profile
  const [socials, setSocials] = useState<SocialsMap>(profile?.socials ?? {});
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(() => {
    const set = new Set<string>();
    if (profile?.socials) {
      Object.keys(profile.socials).forEach((k) => {
        if (profile.socials[k]?.trim()) set.add(k);
      });
    }
    return set;
  });

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setSocials((v) => {
          const copy = { ...v };
          delete copy[id];
          return copy;
        });
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const updateSocial = (id: string, value: string) => {
    setSocials((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async () => {
    if (!profile) return;
    setLoading(true);

    // Build clean socials map
    const cleanSocials: SocialsMap = {};
    selectedPlatforms.forEach((id) => {
      const val = socials[id]?.trim();
      if (val) cleanSocials[id] = val;
    });

    const updates = {
      fullname,
      nickname,
      bio,
      phone: phone || null,
      socials: cleanSocials,
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
          <View className="h-4" />
          <FieldLabel text="Bio" />
          <PlaceholderInput value={bio} onChangeText={setBio} placeholder="What do you do?" tall />
        </SectionCard>

        <SectionCard title="Contact">
          <FieldLabel text="Email" />
          <PlaceholderInput value={email} placeholder="Email (read-only)" />
          <View className="h-4" />
          <FieldLabel text="Phone" />
          <PlaceholderInput value={phone} onChangeText={setPhone} placeholder="Phone number" />
        </SectionCard>

        <SectionCard title="Social media">
          {CATEGORIES.map((cat) => {
            const platforms = SOCIAL_PLATFORMS.filter((p) => p.category === cat.key);
            return (
              <View key={cat.key} className="mb-3">
                <Text className="mb-2 text-xs font-bold uppercase text-neutral-400 dark:text-neutral-500">
                  {cat.label}
                </Text>
                {platforms.map((platform) => {
                  const isSelected = selectedPlatforms.has(platform.id);
                  const Icon = platform.icon;

                  return (
                    <View key={platform.id} className="mb-2">
                      <TouchableOpacity
                        onPress={() => togglePlatform(platform.id)}
                        className={`flex-row items-center rounded-xl px-3 py-2.5 ${
                          isSelected
                            ? 'bg-neutral-200 dark:bg-neutral-600'
                            : 'bg-neutral-100 dark:bg-neutral-700'
                        }`}
                        activeOpacity={0.7}>
                        <View
                          className="h-8 w-8 items-center justify-center rounded-full"
                          style={{ backgroundColor: platform.color + '20' }}>
                          <Icon size={16} color={platform.color} />
                        </View>
                        <Text className="ml-3 flex-1 text-sm font-medium text-black dark:text-white">
                          {platform.label}
                        </Text>
                        <View
                          className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? 'border-black bg-black dark:border-white dark:bg-white'
                              : 'border-neutral-300 dark:border-neutral-500'
                          }`}>
                          {isSelected && <Check size={12} color={isDark ? '#000' : '#fff'} strokeWidth={3} />}
                        </View>
                      </TouchableOpacity>

                      {isSelected && (
                        <View className="mb-1 ml-11 mr-1 mt-1">
                          <TextInput
                            className="h-10 rounded-lg bg-white px-3 text-sm text-black dark:bg-neutral-800 dark:text-white"
                            placeholder={platform.placeholder}
                            placeholderTextColor="#9CA3AF"
                            value={socials[platform.id] ?? ''}
                            onChangeText={(t) => updateSocial(platform.id, t)}
                            autoCapitalize="none"
                            autoCorrect={false}
                          />
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </SectionCard>
      </ScrollView>

      <View style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
        <FooterActions onUpdate={handleUpdate} loading={loading} />
      </View>
    </View>
  );
}
