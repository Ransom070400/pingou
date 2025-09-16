import React from 'react'
import { View, Text } from 'react-native'

interface StatsRowProps {
  // Total tokens earned
  tokens: number
  // Total connections made
  connections: number
}

const StatsRow: React.FC<StatsRowProps> = ({ tokens, connections }) => {
  return (
    <View className="flex-row justify-center gap-16 py-6">
      {/* Tokens block - circular design */}
      <View className="items-center">
        <View className="h-16 w-16 rounded-full bg-black dark:bg-white items-center justify-center">
          <Text className="text-xl font-bold text-white dark:text-black">
            {tokens}
          </Text>
        </View>
        <Text className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
          Ping Tokens
        </Text>
      </View>
      
      {/* Connections block - circular design */}
      <View className="items-center">
        <View className="h-16 w-16 rounded-full bg-black dark:bg-white items-center justify-center">
          <Text className="text-xl font-bold text-white dark:text-black">
            {connections}
          </Text>
        </View>
        <Text className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
          Connections
        </Text>
      </View>
    </View>
  )
}

export default StatsRow