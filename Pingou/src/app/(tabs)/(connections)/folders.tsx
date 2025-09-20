import { View, Text } from 'react-native'
import React from 'react'
import Fab from '~/src/components/Fab'
import EmptyState from '~/src/components/EmptyState'

const folders = () => {
  return (
    <View className='flex-1 bg-white  dark:bg-black'>
       <EmptyState
        title="No Connections yet"
        description="Add your first connection or create a folder to organize them"
        // You can change the emoji per screen to differentiate if you like
        // emoji="📇"
      />

      {/* Floating create button */}
      <Fab label="Create" onPress={() => console.log("")} />
    </View>
  )
}

export default folders