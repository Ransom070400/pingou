import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack initialRouteName="onboarding" screenOptions={{ headerShown: false }}>
      {/* define screens here so you can customize titles/options */}
      <Stack.Screen name="onboarding" options={{ title: 'Welcome' }} />
      <Stack.Screen name="signin" options={{ title: 'Sign in' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign up' }} />
    </Stack>
  );
};