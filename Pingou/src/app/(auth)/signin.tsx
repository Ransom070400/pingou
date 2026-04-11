import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, Platform, StyleSheet, Alert, useColorScheme } from 'react-native'
import { Mail, Lock } from 'lucide-react-native'
import * as AppleAuthentication from 'expo-apple-authentication';
import { handleLoginUtil, handleLoginWithAppleAuthUtil } from '~/src/utils/signInUtils';
import { router } from 'expo-router';

export default function SignIn() {
  const isIOS = Platform.OS === 'ios';
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#9CA3AF' : 'gray';
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true);
    const { success, error } = await handleLoginUtil(email, password);
    setLoading(false);

    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Error', error.message);
    }
  }

  return (
    <View className="flex-1 bg-neutral-100 dark:bg-neutral-900 px-5 pt-9">
      {/* Logo */}
      <View className="items-center mb-6">
        <View className="w-28 h-42 rounded-full items-center justify-center">
          <Image source={require('../../../assets/PingouLogoWOBG.png')} className="w-[91px] h-[126px]" />
        </View>
      </View>

      {/* Heading */}
      <View className="items-center mb-6">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-white">Welcome back</Text>
        <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Your Networking companion</Text>
      </View>

      {/* Card */}
      <View className="bg-white dark:bg-neutral-800 rounded-2xl px-5 pt-5 pb-6 shadow-sm">
        <Text className="text-lg font-semibold text-neutral-900 dark:text-white text-center mb-4">
          Sign in
        </Text>

        {/* Apple Sign In */}
        <View className="flex-row items-center justify-center mb-5">
          {isIOS && (
            <View className='items-center'>
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={isDark
                  ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                  : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={20}
                style={styles.button}
                onPress={async () => {
                  const { success, error } = await handleLoginWithAppleAuthUtil();
                  if (success) {
                    router.replace('/(tabs)');
                  } else {
                    Alert.alert('Login Error', error.message);
                  }
                }}
              />
            </View>
          )}
        </View>

        {/* OR separator */}
        <View className="flex-row items-center mb-5">
          <View className="flex-1 h-px bg-neutral-300 dark:bg-neutral-600" />
          <Text className="mx-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">OR</Text>
          <View className="flex-1 h-px bg-neutral-300 dark:bg-neutral-600" />
        </View>

        {/* Email input */}
        <View className="flex-row items-center h-12 rounded-full border border-neutral-300 dark:border-neutral-600 px-4 mb-3 bg-white dark:bg-neutral-700">
          <Mail color={iconColor} size={20} style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-sm text-neutral-900 dark:text-white"
            placeholder="Enter your Email"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            accessibilityLabel="Email input"
            autoCorrect={false}
          />
        </View>

        {/* Password input */}
        <View className="flex-row items-center h-12 rounded-full border border-neutral-300 dark:border-neutral-600 px-4 mb-4 bg-white dark:bg-neutral-700">
          <Lock color={iconColor} size={20} style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-sm text-neutral-900 dark:text-white"
            placeholder="Password"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            autoCapitalize="none"
            accessibilityLabel="Password input"
            autoCorrect={false}
          />
        </View>

        {/* Login button */}
        <TouchableOpacity
          className="h-12 rounded-full bg-black dark:bg-white items-center justify-center flex-row active:opacity-90"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white dark:text-black font-semibold mr-3 text-sm">{loading ? 'Logging in' : 'Login'}</Text>
          <View className='bg-white dark:bg-black rounded-full w-8 h-8 justify-center items-center'>
            <Text className='text-black dark:text-white self-center'>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer link */}
      <View className="items-center mt-6">
        <Text onPress={() => router.replace('/(auth)/signup')} className="text-xs text-neutral-600 dark:text-neutral-400">
          Don't have an account? <Text className="text-amber-600 dark:text-amber-400">Sign up</Text>
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 44,
  },
});
