import { View, Text } from 'react-native'
import React from 'react'
import EmptyState from '~/src/components/EmptyState'

const connections = () => {
  return (
    <View className='flex-1 bg-white dark:bg-black'>
      <EmptyState
        title="No Connections yet"
        description="Add your first connection or create a folder to organize them"
      />
    </View>
  )
}


export default connections