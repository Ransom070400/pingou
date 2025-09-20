import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

const ConnectionsHeader = () => {
  // Get current color scheme (light/dark mode)
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className={`px-4 pb-4 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header with title */}
      <View className="flex-row items-center justify-center mt-8 mb-4">
        <Text className={`text-xl font-semibold ml-4 ${isDark ? 'text-white' : 'text-black'}`}>
          Connections
        </Text>
      </View>

      {/* Search bar */}
      {/* Use rounded-full for the pill shape and a subtle border for the iOS look */}
      <View
        className={`flex-row items-center px-3 py-2 rounded-full border ${
          isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
        }`}
      >
        {/* Use the outline icon for a lighter, cleaner look */}
        <Ionicons
          name="search-outline"
          size={28}
          color={isDark ? '#9CA3AF' : '#9CA3AF'}
        />
        {/* Expand to fill the row; keep text readable and placeholder subtle */}
        <TextInput
          // Placeholder text
          placeholder="Search connections..."
          // Keep placeholder a soft gray in both themes
          placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
          // Make input take the remaining width and match theme colors
          className={`flex-1 p-[15px] text-[15px] ${isDark ? 'text-white' : 'text-black'}`}
          // Tell keyboard this is a search action
          returnKeyType="search"
          // Avoid auto-capitalizing names unless you prefer it
          autoCapitalize="none"
          // Show the clear "x" on iOS while typing
          clearButtonMode="while-editing"
          // Match caret/selection to theme for polish
          cursorColor={isDark ? '#D1D5DB' : '#374151'}
          selectionColor={isDark ? '#4B5563' : '#D1D5DB'}
        />
      </View>
    </View>
  );
};

export default ConnectionsHeader;