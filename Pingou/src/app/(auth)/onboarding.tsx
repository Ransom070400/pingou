import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import OnboardingCard from '../../components/OnboardingCard'

// Card metadata array
const onboardingCards = [
  {
    title: "Build Your Pingou Profile",
    description: "Create your professional identity and connect your social networks in one place",
    tiltDegrees: 0 // Keep the same as current (clockwise)
  },
  {
    title: "Connect Instantly", 
    description: "Scan QR codes to connect with new contacts seamlessly at events and meetings",
    tiltDegrees: -4 // Anticlockwise
  },
  {
    title: "Stay Organized",
    description: "Keep your network tidy with smart folders for events and connections", 
    tiltDegrees: 3 // Clockwise
  }
]

const Onboarding = () => {
  const [remainingCards, setRemainingCards] = useState(onboardingCards)
  const currentCardIndex = onboardingCards.length - remainingCards.length
  return (
    // Main container - keeps big images visible outside bounds
    <View className='flex-1 bg-gray-100'>

      {/* Top right penguin (bigger). Rotate anticlockwise from top so bottom is cut off */}
      <Image
        source={require('../../../assets/PingouLogoWOBG.png')}
        className='absolute top-8 -right-40 w-[500px] h-[500px]'
        style={{
          transform: [
            // Negative deg = anticlockwise, rotate from top
            { rotate: '-25deg' },
          ],
          transformOrigin: 'top center'
        }}
        resizeMode="contain"
      />

      {/* Bottom left penguin. Positioned at leftmost part just above skip button */}
      <Image
        source={require('../../../assets/PingouLogoWOBG.png')}
        className='absolute bottom-20 right-[210px] w-[500px] h-[520px]'
        style={{
          transform: [
            // Positive deg = clockwise, rotate from bottom
            { rotate: '20deg' },
          ],
          transformOrigin: 'bottom center'
        }}
        resizeMode="contain"
      />

      {/* Main content cards - stacked on top of each other */}
      <View className='flex-1 justify-center px-6'>
        <View className='relative'>
          {remainingCards.map((card, index) => {
            const isTopCard = index === remainingCards.length - 1
            const stackOffset = (remainingCards.length - 1 - index) * 4
            const scale = 1 - (remainingCards.length - 1 - index) * 0.05
            
            return (
              <View
                key={`${card.title}-${index}`}
                className='absolute w-full'
                style={{
                  zIndex: index,
                  transform: [
                    { translateY: -stackOffset },
                    { scale: scale }
                  ],
                  opacity: isTopCard ? 1 : 0.7
                }}
              >
                <OnboardingCard 
                  title={card.title}
                  description={card.description}
                  tiltDegrees={card.tiltDegrees}
                />
              </View>
            )
          })}
        </View>
      </View>

      {/* Bottom controls */}
      <View className='pb-12 px-6'>
        <View className='flex-row justify-center mb-8 space-x-2'>
          {onboardingCards.map((_, index) => {
            const isActive = index === currentCardIndex
            const isCompleted = index < currentCardIndex
            
            return (
              <View 
                key={index}
                className={`h-2 rounded-full ${
                  isActive 
                    ? 'w-8 bg-gray-800' 
                    : isCompleted 
                    ? 'w-2 bg-gray-500'
                    : 'w-2 bg-gray-300'
                }`} 
              />
            )
          })}
        </View>

        <View className='flex-row justify-between items-center'>
          <TouchableOpacity className='px-6 py-3 border p-7 rounded-full border-gray-300'>
            <Text className='text-black font-medium'>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className='bg-gray-800 px-8 py-3 rounded-full flex-row items-center'
            onPress={() => {
              if (remainingCards.length > 1) {
                // Remove the top card from the stack
                setRemainingCards(prev => prev.slice(0, -1))
              } else {
                // Handle final card - navigate to next screen or complete onboarding
                console.log('Onboarding completed!')
              }
            }}
          >
            <Text className='text-white font-medium mr-2'>
              {remainingCards.length === 1 ? 'Get Started' : 'Next'}
            </Text>
            <View className='bg-white rounded-full w-8 h-8 justify-center items-center'>
              <Text className='text-black self-center'>→</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Onboarding