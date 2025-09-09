import { View, Text } from 'react-native'
import React from 'react'

interface OnboardingCardProps {
  title: string
  description: string
  className?: string
  tiltDegrees?: number // Positive for clockwise, negative for anticlockwise
}

const OnboardingCard = ({ title, description, className = '', tiltDegrees = 0 }: OnboardingCardProps) => {
  return (
    <View 
      className={`bg-white rounded-3xl p-8 mx-4 shadow-lg ${className}`}
      style={{
        transform: tiltDegrees !== 0 ? [{ rotate: `${tiltDegrees}deg` }] : undefined
      }}
    >
      <Text className='text-2xl font-bold text-center text-gray-800 mb-4'>
        {title}
      </Text>
      <Text className='text-gray-600 text-center leading-6'>
        {description}
      </Text>
    </View>
  )
}

export default OnboardingCard
