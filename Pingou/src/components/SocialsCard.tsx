import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import OnboardingCard from './OnboardingCard'
import Field from './SocialCardField'

type SocialValues = {
  phone?: string
  instagram?: string
  x?: string
  linkedin?: string
  extras?: string[]
}

type Props = {
  initial?: SocialValues
  currentStep: number
  totalSteps: number
  onBack: () => void
  onContinue: (data: SocialValues) => void
}

export default function SocialsCard({
  initial,
  currentStep,
  totalSteps,
  onBack,
  onContinue
}: Props) {
  // individual social states (keep flat + simple)
  const [phone, setPhone] = useState(initial?.phone || '')
  const [instagram, setInstagram] = useState(initial?.instagram || '')
  const [x, setX] = useState(initial?.x || '')
  const [linkedin, setLinkedin] = useState(initial?.linkedin || '')
  const [extras, setExtras] = useState<string[]>(initial?.extras || [])

  // derived boolean: at least one field has content
  const hasAny =
    [phone, instagram, x, linkedin, ...extras].some(v => v.trim().length > 0)

  // add a new blank extra link
  const addExtra = () => setExtras(prev => [...prev, ''])

  // update a specific extra link by index
  const updateExtra = (text: string, idx: number) =>
    setExtras(prev => prev.map((v, i) => (i === idx ? text : v)))

  // Helper: clean extras before sending upward (trim, drop blanks, dedupe)
  const sanitizeExtras = (values: string[]) => {
    // Trim each, keep non-empty
    const cleaned = values
      .map(v => v.trim())
      .filter(v => v.length > 0)
    // Deduplicate while preserving order
    return Array.from(new Set(cleaned))
  }

  return (
    <OnboardingCard
      currentStep={currentStep}
      totalSteps={totalSteps}
      title="Link your social media"
      subtitle="Add at least one socials."
    >
      {/* Scroll to handle small screens; keep padding minimal */}
      <ScrollView
        className="max-h-[420px]"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Phone */}
        <Field
          label="Phone"
          placeholder="08123456789"
          value={phone}
          onChangeText={setPhone}
        />
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
            onChangeText={t => updateExtra(t, idx)}
          />
        ))}

        {/* Add new link trigger */}
        <TouchableOpacity
          onPress={addExtra}
          className="flex-row items-center mb-6"
        >
          <View className="w-6 h-6 rounded-full bg-black items-center justify-center mr-2">
            <Text className="text-white text-sm">+</Text>
          </View>
          <Text className="text-sm text-neutral-700">
            Click to add more links
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Actions row */}
      <View className="flex-row mt-2">
        <TouchableOpacity
          onPress={onBack}
          className="flex-row flex-1 h-12 border border-neutral-300 rounded-full items-center justify-center mr-3"
        >
          <Text className="text-neutral-800 font-medium">Back</Text>
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
              extras: sanitizeExtras(extras)
            })
          }
          className={`flex-row flex-1 h-12 rounded-full items-center justify-center ${
            hasAny ? 'bg-black' : 'bg-neutral-400'
          }`}
        >
          <Text className="text-white font-semibold mr-3">Continue</Text>
          <View className="bg-white rounded-full w-8 h-8 items-center justify-center">
            <Text className="text-black">→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </OnboardingCard>
  )
}
