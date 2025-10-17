import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function FooterActions() {
  return (
    <View className="px-3 pb-3">
      <View className="flex-row items-center justify-between gap-3">
        <TouchableOpacity className="h-11 flex-1 items-center justify-center rounded-full border border-neutral-300 bg-white"
        onPress={() => router.back()}
        >
          <Text className="text-[15px] font-semibold text-neutral-800">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-full bg-black">
          <Text className="text-[15px] font-semibold text-white">Update</Text>
          <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
            <Text className="-mt-[2px] text-lg text-black">→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
