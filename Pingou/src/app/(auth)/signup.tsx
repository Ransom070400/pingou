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
} from 'react-native';
import { Mail, Lock } from 'lucide-react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { router } from 'expo-router';
import { handleUserSignUp } from '~/src/utils/signUpUtils';
import { handleLoginWithAppleAuthUtil } from '~/src/utils/signInUtils';

/**
 * Simple SignUp screen modeled after the SignIn UI.
 * Kept structure and styling consistent so the app feels cohesive.
 */
export default function SignUp() {
  // Detect iOS so we can show Apple auth button (same approach as SignIn).
  const isIOS = Platform.OS === 'ios';

  // Local state for the form fields.
  // email: user's email address
  const [email, setEmail] = useState('');
  // password: chosen password
  const [password, setPassword] = useState('');
  // confirmPassword: must match password
  const [confirmPassword, setConfirmPassword] = useState('');
  // loading: used while doing async work (Apple auth kept using it)
  const [loading, setLoading] = useState(false);

  // NOTE: Sign up functionality removed per request.

  const handleSignUp = async () => {
    if (password !== confirmPassword) Alert.alert('Easy there!', 'Passwords do not match');
    const { success, error } = await handleUserSignUp(email, password);
    if (error) Alert.alert('Sign up error', error.message);
    if (success) router.replace('/(auth)/onboarding');
  };
  // You (the user) will implement the registration logic/util and hook it here.

  const handleAppleButtonPress = async () => {
    try {
      await handleLoginWithAppleAuthUtil()
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
        router.push("/(auth)/onboarding")
    }
  };

  // Reuse Apple auth UI for iOS (same behavior as SignIn).
  return (
    <View className="flex-1 bg-neutral-100 px-5 pt-9">
      {/* Logo / Mascot area */}
      <View className="mb-6 items-center">
        <View className="h-42 w-28 items-center justify-center rounded-full dark:bg-white">
          <Image
            source={require('../../../assets/PingouLogoWOBG.png')}
            className="h-[126px] w-[91px]"
          />
        </View>
      </View>

      {/* Heading */}
      <View className="mb-6 items-center">
        <Text className="text-2xl font-semibold text-neutral-900">Welcome to Pingou!</Text>
        <Text className="mt-1 text-sm text-neutral-500">Your networking companion</Text>
      </View>

      {/* Card */}
      <View className="rounded-2xl bg-white px-5 pb-6 pt-5 shadow-sm">
        <Text className="mb-4 text-center text-lg font-semibold text-neutral-900">Sign up</Text>

        {/* Social / Apple button */}
        <View className="mb-5 flex-row items-center justify-center">
          {isIOS && (
            <View className="items-center">
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={20}
                style={styles.button}
                // For now mimic sign-in behavior; wire to your register-with-apple util later.
                onPress={handleAppleButtonPress}
              />
            </View>
          )}
        </View>

        {/* OR separator */}
        <View className="mb-5 flex-row items-center">
          <View className="h-px flex-1 bg-neutral-300" />
          <Text className="mx-3 text-xs font-medium text-neutral-500">OR</Text>
          <View className="h-px flex-1 bg-neutral-300" />
        </View>

        {/* NOTE: Name input removed per request */}

        {/* Email input */}
        <View className="mb-3 h-12 flex-row items-center rounded-full border border-neutral-300 bg-white px-4">
          <Mail color="gray" size={20} style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-sm text-neutral-900"
            placeholder="Enter your Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            accessibilityLabel="Email input"
            autoCorrect={false}
          />
        </View>

        {/* Password input */}
        <View className="mb-3 h-12 flex-row items-center rounded-full border border-neutral-300 bg-white px-4">
          <Lock color="gray" size={20} style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-sm text-neutral-900"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            autoCapitalize="none"
            accessibilityLabel="Password input"
            autoCorrect={false}
          />
        </View>

        {/* Confirm password input */}
        <View className="mb-4 h-12 flex-row items-center rounded-full border border-neutral-300 bg-white px-4">
          <Lock color="gray" size={20} style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-sm text-neutral-900"
            placeholder="Confirm password"
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
          className="h-12 flex-row items-center justify-center rounded-full bg-black active:opacity-90"
          // Sign-up logic removed. Implement your register util and replace this handler.
          onPress={handleSignUp}
          disabled={loading}>
          <Text className="mr-3 text-sm font-semibold text-white">
            {loading ? 'Working...' : 'Sign up'}
          </Text>
          <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
            <Text className="self-center text-black">→</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer link to Sign In */}
      <View className="mt-6 items-center">
        <Text onPress={() => router.replace('/(auth)/signin')} className="text-xs text-neutral-600">
          Already have an account? <Text className="text-amber-600">Sign in</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Button size for AppleAuthentication button
  button: {
    width: 200,
    height: 44,
  },
});
