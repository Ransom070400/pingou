import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Header,
  SectionCard,
  FieldLabel,
  PlaceholderInput,
  SocialRow,
  AddMoreRow,
  FooterActions,
} from '../components/edit-profile';

export default function EditProfile() {
  const insets = useSafeAreaInsets();

  const idRef = React.useRef(0);
  const nextId = React.useCallback(() => `social-${idRef.current++}`, []);

  const [socials, setSocials] = React.useState([
    { id: nextId(), name: 'Instagram', value: '' },
    { id: nextId(), name: 'X', value: '' },
    { id: nextId(), name: 'LinkedIn', value: '' },
    { id: nextId(), name: 'Behance', value: '' },
  ]);

  const addSocialRow = () =>
    setSocials((prev) => [...prev, { id: nextId(), name: 'Custom', value: '' }]);

  const updateSocial = (id: string, value: string) =>
    setSocials((prev) => prev.map((s) => (s.id === id ? { ...s, value } : s)));

  return (
    <View className="flex-1 bg-neutral-100">
      {/* If you add the header back, wrap it with a View that applies top inset */}
      {/* <View style={{ paddingTop: insets.top }}>
        <Header />
      </View> */}

      <ScrollView
        className="flex-1 overflow-hidden"
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 16) }}
        contentInsetAdjustmentBehavior="never" // prevent auto top/bottom gaps
        scrollIndicatorInsets={{ top: insets.top, bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <SectionCard title="About you">
          <FieldLabel text="Your name" />
          <PlaceholderInput />
          <View className="h-4" />
          <FieldLabel text="Your Bio" />
          <PlaceholderInput tall />
        </SectionCard>

        <SectionCard title="Contact information">
          <FieldLabel text="Email" />
          <PlaceholderInput />
          <View className="h-4" />
          <FieldLabel text="Phone" />
          <PlaceholderInput />
        </SectionCard>

        <SectionCard title="Social media">
          {socials.map((s, idx) => (
            <View key={s.id} className={idx === 0 ? '' : 'mt-3'}>
              <Text className="mb-2 text-xs font-bold text-neutral-900">
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

      {/* Bottom safe area only for the footer */}
      <View style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
        <FooterActions />
      </View>
    </View>
  );
}

