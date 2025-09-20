import React from 'react';
import { withLayoutContext} from 'expo-router';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, useColorScheme } from 'react-native';
import ConnectionsHeader from '../../../components/ConnectionsHeader';

const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

const ConnectionsLayout = () => {
  // Get safe area measurements to avoid status bar overlap
  const insets = useSafeAreaInsets();
  // Get current theme (light/dark mode)
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <View 
      style={{ 
        flex: 1, 
        // Apply top padding for status bar + our header space
        paddingTop: insets.top,
        backgroundColor: isDark ? '#111827' : '#ffffff'
      }}
    >
      {/* Fixed header component */}
      <ConnectionsHeader />
      
      {/* Tab navigator for switching between views */}
      <TopTabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: isDark ? 'white' : '#black',
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
          },
           // Add: control the color/thickness of the active tab underline
          tabBarIndicatorStyle: {
            // Color of the underline (active tab). Swap to your brand color if you want.
            backgroundColor:"orange",
            // Thickness of the underline (optional)
            height: 3,
          },
          tabBarActiveTintColor: 'black', // Blue for active tab
          tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280', // Gray for inactive
        }}
      >
        <TopTabs.Screen name="index" options={{ title: 'All Connections' }} />
        <TopTabs.Screen name="folders" options={{ title: 'Folders' }} />
      </TopTabs>
    </View>
  );
};

export default ConnectionsLayout;
