import { View, Text } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { supabase } from '~/src/lib/supabase'

const index = () => {
  return (
    <View className='justify-center bg-white flex-1 dark:bg-black'>
      <Text onPress={() => supabase.auth.signOut()} className='self-center dark:text-white'>Sign Out</Text>
    </View>
  )
}

export default index