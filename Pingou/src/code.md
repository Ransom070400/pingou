'''typescript

import React from 'react'
import { View, Text } from 'react-native'

/* Props for the card: progress is 0..1, title is optional, children is card body. */
type Props = {
  progress?: number
  title: string
  subtitle?:string
  children?: React.ReactNode
}

/* Reusable onboarding card with a thin progress line on top. */
export default function OnboardingCard({ progress = 0, title, children, subtitle }: Props) {
  return (
    // Root wrapper for the card + top progress line
    <View className="mx-2">
      {/* Progress bar container - light track with rounded corners */}
      <View className="h-2 bg-neutral-200 rounded-full overflow-hidden mb-4">
        {/* Filled part of the progress bar. Width is controlled inline from progress prop. */}
        <View
          // Inline width uses progress percentage for precise control.
          style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
          className="h-2 bg-black rounded-full"
        />
      </View>

      {/* Card container - white box with rounded corners and shadow */}
      <View className="bg-white rounded-2xl px-6 py-6 shadow-lg">
        {/* Optional title centered */}
        <Text className="text-center text-lg font-semibold text-neutral-900 mb-4">{title}</Text> 
        {subtitle ? <Text className="text-center text-sm text-neutral-600 mb-4">{subtitle}</Text> : null}
        {/* Card content supplied by children */}
        {children}
      </View>
    </View>
  )
}


'''