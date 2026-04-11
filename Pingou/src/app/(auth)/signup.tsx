import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  Alert,
  useColorScheme,
} from 'react-native';
import { Mail, Lock } from 'lucide-react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { router } from 'expo-router';
import { handleUserSignUp } from '~/src/utils/signUpUtils';
import { handleLoginWithAppleAuthUtil } from '~/src/utils/signInUtils';

export default function SignUp() {
  const isIOS = Platform.OS === 'ios';
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#9CA3AF' : 'gray';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Easy there!', 'Passwords do not match');
      return;
    }
    setLoading(true);
    const { success, error } = await handleUserSignUp(email, password);
    setLoading(false);

    if (error && !success) {
      Alert.alert('Sign up error', error.message);
      return;
    }
    if (success) router.replace('/(auth)/onboarding');
  };

  const handleAppleButtonPress = async () => {
    try {
      const { success, error } = await handleLoginWithAppleAuthUtil();
      if (success) {
        router.push('/(auth)/onboarding');
      } else {
        Alert.alert('Apple Sign-In Error', error?.message ?? 'Something went wrong');
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    }
  };

  return (
    <View className="flex-1 bg-neutral-100 dark:bg-neutral-900 px-5 pt-9">
      {/* Logo */}
      <View className="mb-6 items-center">
        <View className="h-42 w-28 items-center justify-center rounded-full">
          <Image
            source={require('../../../assets/PingouLogoWOBG.png')}
            className="h-[126px] w-[91px]"
          />
        </View>
      </View>

      {/* Heading */}
      <View className="mb-6 items-center">
        <Text className="text-2xl font-semibold text-neutral-900 dark:text-white">Welcome to Pingou!</Text>
        <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Your networking companion</Text>
      </View>

      {/* Card */}
      <View className="rounded-2xl bg-white dark:bg-neutral-800 px-5 pb-6 pt-5 shadow-sm">
        <Text className="mb-4 text-center text-lg font-semibold text-neutral-900 dark:text-white">Sign up</Text>

        {/* Apple button */}
        <View className="mb-5 flex-row items-center justify-center">
          {isIOS && (
            <View className="items-center">
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={isDark
                  ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                  : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={20}
                style={styles.button}
                onPress={handleAppleButtonPress}
              />
            </View>
          )}
        </View>

        {/* OR separator */}
        <View className="mb-5 flex-row items-center">
          <View className="h-px flex-1 bg-neutral-300 dark:bg-neutral-600" />
          <Text className="mx-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">OR</Text>
          <View className="h-px flex-1 bg-neutral-300 dark:bg-neutral-600" />
        </View>

        {/* Email input */}
        <View className="mb-3 h-12 flex-row items-center rounded-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4">
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
        <View className="mb-3 h-12 flex-row items-center rounded-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4">
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

        {/* Confirm password */}
        <View className="mb-4 h-12 flex-row items-center rounded-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-4">
          <Lock color={iconColor} size={20} style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-sm text-neutral-900 dark:text-white"
            placeholder="Confirm password"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            autoCapitalize="none"
            accessibilityLabel="Confirm password input"
            autoCorrect={false}
          />
        </View>

        {/* Sign up button */}
        <TouchableOpacity
          className="h-12 flex-row items-center justify-center rounded-full bg-black dark:bg-white active:opacity-90"
          onPress={handleSignUp}
          disabled={loading}>
          <Text className="mr-3 text-sm font-semibold text-white dark:text-black">
            {loading ? 'Working...' : 'Sign up'}
          </Text>
          <View className="h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-black">
            <Text className="self-center text-black dark:text-white">→</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="mt-6 items-center">
        <Text onPress={() => router.replace('/(auth)/signin')} className="text-xs text-neutral-600 dark:text-neutral-400">
          Already have an account? <Text className="text-amber-600 dark:text-amber-400">Sign in</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 44,
  },
});
