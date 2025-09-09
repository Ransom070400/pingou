import { View, Text } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const index = () => {
  return (
    <View className='justify-center bg-white flex-1 dark:bg-black'>
      <Text onPress={() => router.push("/(auth)/onboarding")} className='self-center dark:text-white'>Go to onboarding</Text>
    </View>
  )
}

export default index