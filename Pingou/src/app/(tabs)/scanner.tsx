import { View, Text } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const scanner = () => {
  return (
    <View className='flex-1 justify-center bg-white  dark:bg-black'>
   <Text onPress={() => router.push("/(auth)/onboarding")} className='self-center dark:text-white'>Work in Progress - Scanner</Text>
    </View>
  )
}

export default scanner