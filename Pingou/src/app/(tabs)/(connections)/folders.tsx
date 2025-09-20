import { View, Text, Alert } from 'react-native'
import React from 'react'
import Fab from '~/src/components/Fab'
import EmptyState from '~/src/components/EmptyState'

const folders = () => {
  return (
    <View className='flex-1 bg-white  dark:bg-black'>
       <EmptyState
        title="No Folders yet."
        description="Create a folder now and add connections specific to event "
        // You can change the emoji per screen to differentiate if you like
        // emoji="📇"
      />

      {/* Floating create button */}
      <Fab label="Create" onPress={() => Alert.prompt("Create Folder")} />
    </View>
  )
}

export default folders