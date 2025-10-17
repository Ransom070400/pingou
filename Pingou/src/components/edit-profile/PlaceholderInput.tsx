import React from 'react';
import { View, TextInput } from 'react-native';

export default function PlaceholderInput({ tall = false }: { tall?: boolean }) {
  return (
<View className={tall ? 'h-24 rounded-xl bg-neutral-200' : 'h-12 rounded-full bg-neutral-200'}>
    <TextInput className="h-full w-full rounded-xl bg-transparent px-4 py-2 text-base text-black placeholder:text-neutral-500" 
    placeholder="Type something..." />
</View>
  );
}
