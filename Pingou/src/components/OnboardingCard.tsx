import React from 'react'
import { View, Text } from 'react-native'

type Props = {
  // progress (0..1) fallback if you don't provide step data
  progress?: number
  // segmented mode: current 1-based step and total steps
  currentStep?: number
  totalSteps?: number
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export default function OnboardingCard({
  progress = 0,
  currentStep,
  totalSteps,
  title,
  subtitle,
  children
}: Props) {
  // Decide if we use segmented bar
  const useSegments = typeof currentStep === 'number' && typeof totalSteps === 'number' && totalSteps > 1



  // Clamp progress if using plain bar
  const clamped = Math.max(0, Math.min(1, progress))

  return (
    <View className="mx-2">
      {/* Top progress region */}
      {useSegments ? (
        // Segmented: map steps -> small bars (flex for equal width)
        <View className="flex-row items-center mb-4">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            // Is this segment completed or current?
            const active = idx < (currentStep as number)
            return (
              <View
                // index as key ok (small static list)
                key={idx}
                // base track style
                className={`h-1 rounded-full flex-1 ${active ? 'bg-black' : 'bg-neutral-300'}`}
                // add spacing except last
                style={{ marginRight: idx === (totalSteps as number) - 1 ? 0 : 8 }}
              />
            )
          })}
        </View>
      ) : (
        // Single continuous bar fallback
        <View className="h-2 bg-neutral-200 rounded-full overflow-hidden mb-4">
          <View style={{ width: `${clamped * 100}%` }} className="h-2 bg-black rounded-full" />
        </View>
      )}

      {/* Card shell */}
      <View className="bg-white dark:bg-black rounded-2xl px-6 py-6 shadow-lg">
        <Text className="text-center text-lg font-semibold text-neutral-900 mb-2">
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-center text-sm text-neutral-600 mb-4">
            {subtitle}
          </Text>
        ) : null}
        {children}
      </View>
    </View>
  )
}
