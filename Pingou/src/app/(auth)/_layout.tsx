import React, { use } from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '~/src/context/AuthProvider';

export default function AuthLayout() {
  const {profile} = useAuth();
  console.log("Profile in Auth Layout:", profile);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Public screens - blocked when there is NO profile */}
      <Stack.Protected guard={!!profile}>
        <Stack.Screen name="welcome" options={{ title: 'Welcome' }} />
        <Stack.Screen name="signin" options={{ title: 'Sign in' }} />
        <Stack.Screen name="signup" options={{ title: 'Sign up' }} />
      </Stack.Protected>
      
      {/* Onboarding screen - blocked when there IS a profile */}
      <Stack.Protected guard={!profile}>
        <Stack.Screen name="onboarding" options={{ title: 'Onboarding' }} />
      </Stack.Protected>
    </Stack>
  );
};