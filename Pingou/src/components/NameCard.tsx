import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
// Use the Expo Router to navigate between screens in the app router.
import { router } from 'expo-router'
import OnboardingCard from './OnboardingCard'

/* Props: optional initial values and an optional callback when continuing. */
type Props = {
  initialName?: string
  initialBio?: string
  onContinue?: (payload: { name: string; bio: string }) => void
}

/* NameCard: collects name + bio and navigates to the next onboarding screen on continue. */
export default function NameCard({ initialName = '', initialBio = '', onContinue }: Props) {
  // Local state for the form fields.
  const [name, setName] = useState(initialName)
  // Local state for the bio texta\rea.
  const [bio, setBio] = useState(initialBio)


  // Handle continue press: call optional callback and navigate to socials screen.
  const handleContinue = () => {
    // Call the optional callback so parent components can capture the values.
    if (onContinue) onContinue({ name, bio })

    // Navigate to the next onboarding step.
    // Adjust the path to match your file in app/(auth)/ — here we assume a "socials" screen exists.
    // router.push('/(auth)/socials')
  }

  return (
    // Use the shared OnboardingCard for consistent chrome and progress line.
    <OnboardingCard progress={0.25} title="What's your name" subtitle="We want to know you">
      {/* Name input */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-neutral-700 mb-2">Your name</Text>
        <TextInput
          // Simple NativeWind styling for the input.
          className="h-12 border border-neutral-300 rounded-lg px-4 text-sm text-neutral-900 bg-white"
          placeholder="Type your name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </View>

      {/* Bio input */}
      <View className="mb-6">
        <Text className="text-sm font-medium text-neutral-700 mb-2">Your Bio</Text>
        <TextInput
          className="h-20 border border-neutral-300 rounded-lg px-4 py-3 text-sm text-neutral-900 bg-white"
          placeholder="type what you do here..."
          value={bio}
          onChangeText={setBio}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Continue button that triggers navigation */}
      <TouchableOpacity className="h-12 bg-black rounded-full items-center justify-center flex-row" onPress={handleContinue}>
        <Text className="text-white font-semibold text-sm mr-3">Continue</Text>
        <View className="bg-white rounded-full w-8 h-8 items-center justify-center">
          <Text className="text-black">→</Text>
        </View>
      </TouchableOpacity>
    </OnboardingCard>
  )
}