import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import OnboardingCard from './OnboardingCard';
import Field from './SocialCardField';

export type SocialValues = {
  phone?: string;
  instagram?: string;
  x?: string;
  linkedin?: string;
  extras?: string[];
};

type Props = {
  initial?: SocialValues;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onContinue: (data: SocialValues) => void;
};

export default function SocialsCard({
  initial,
  currentStep,
  totalSteps,
  onBack,
  onContinue,
}: Props) {
  // individual social states (keep flat + simple)
  const [phone, setPhone] = useState(initial?.phone || '');
  const [instagram, setInstagram] = useState(initial?.instagram || '');
  const [x, setX] = useState(initial?.x || '');
  const [linkedin, setLinkedin] = useState(initial?.linkedin || '');
  const [extras, setExtras] = useState<string[]>(initial?.extras || []);

  // derived boolean: at least one field has content
  const hasAny = [phone, instagram, x, linkedin, ...extras].some((v) => v.trim().length > 0);

  // add a new blank extra link
  const addExtra = () => setExtras((prev) => [...prev, '']);

  // update a specific extra link by index
  const updateExtra = (text: string, idx: number) =>
    setExtras((prev) => prev.map((v, i) => (i === idx ? text : v)));

  // Helper: clean extras before sending upward (trim, drop blanks, dedupe)
  const sanitizeExtras = (values: string[]) => {
    // Trim each, keep non-empty
    const cleaned = values.map((v) => v.trim()).filter((v) => v.length > 0);
    // Deduplicate while preserving order
    return Array.from(new Set(cleaned));
  };

  return (
    <OnboardingCard
      currentStep={currentStep}
      totalSteps={totalSteps}
      title="Link your social media"
      subtitle="Add at least one socials.">
      {/* Scroll to handle small screens; keep padding minimal */}
      <ScrollView
        className="max-h-[420px]"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Phone */}
        <Field label="Phone" placeholder="08123456789" value={phone} onChangeText={setPhone} />
        {/* Instagram */}
        <Field
          label="Instagram"
          placeholder="https://www.instagram.com/username"
          value={instagram}
          onChangeText={setInstagram}
        />
        {/* X / Twitter */}
        <Field
          label="X (Formerly Twitter)"
          placeholder="https://x.com/handle"
          value={x}
          onChangeText={setX}
        />
        {/* LinkedIn */}
        <Field
          label="LinkedIn"
          placeholder="https://www.linkedin.com/in/username"
          value={linkedin}
          onChangeText={setLinkedin}
        />
        {/* Dynamic extra links */}
        {extras.map((val, idx) => (
          <Field
            key={idx}
            label={`Extra Link ${idx + 1}`}
            placeholder="https://..."
            value={val}
            onChangeText={(t) => updateExtra(t, idx)}
          />
        ))}

        {/* Add new link trigger */}
        <TouchableOpacity onPress={addExtra} className="mb-6 flex-row items-center">
          <View className="mr-2 h-6 w-6 items-center justify-center rounded-full bg-black">
            <Text className="text-sm text-white">+</Text>
          </View>
          <Text className="text-sm text-neutral-700">Click to add more links</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Actions row */}
      <View className="mt-2 flex-row">
        <TouchableOpacity
          onPress={onBack}
          className="mr-3 h-12 flex-1 flex-row items-center justify-center rounded-full border border-neutral-300">
          <Text className="font-medium text-neutral-800">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!hasAny}
          onPress={() =>
            onContinue({
              phone,
              instagram,
              // Map local 'x' state to canonical field name you store (twitter)
              x,
              linkedin,
              // Pass sanitized extras
              extras: sanitizeExtras(extras),
            })
          }
          className={`h-12 flex-1 flex-row items-center justify-center rounded-full ${
            hasAny ? 'bg-black' : 'bg-neutral-400'
          }`}>
          <Text className="mr-3 font-semibold text-white">Continue</Text>
          <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
            <Text className="text-black">→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </OnboardingCard>
  );
}
