// Import React + hooks + core RN primitives
import React, { useState, memo } from 'react'
// Import building blocks for UI
import { View, ScrollView, Text, TextInput, Pressable, Image, Platform, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Mail, Lock } from 'lucide-react-native'
import * as AppleAuthentication from 'expo-apple-authentication';
import { handleLoginUtil, handleLoginWithAppleAuthUtil } from '~/src/utils/signInUtils';
import { router } from 'expo-router';


/**
 * Main SignIn screen component.
 * Named with PascalCase (React component convention).
 */
export default function SignIn() {
  // Local state to hold email input; keep it simple for now.
  const isIOS = Platform.OS === 'ios';
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)


  const handleLogin = async () => {
    setLoading(true);
    const { success, error } = await handleLoginUtil(email, password);
    setLoading(false);

    if (success) {
      // Handle successful login (e.g., navigate to main app)
      router.replace("/(tabs)")
    } else {
      // Handle login error (e.g., show error message)
      Alert.alert("Login Error", error.message);
    }
  }

  return (
    // Outer container: fills screen, light gray background similar to screenshot
    <View className="flex-1 bg-neutral-100 px-5 pt-9">
      {/* Logo / Mascot placeholder (replace with real asset later) */}
      <View className="items-center mb-6">
        {/* Placeholder circle mascot; replace with Image source when asset ready */}
        <View className="w-28 h-42 rounded-full dark:bg-white items-center justify-center">
          <Image source={require('../../../assets/PingouLogoWOBG.png')} className="w-[91px] h-[126px]" />
        </View>
      </View>

      {/* Heading section */}
      <View className="items-center mb-6">
        <Text className="text-2xl font-semibold text-neutral-900">Welcome back!</Text>
        <Text className="text-sm text-neutral-500 mt-1">Your Networking companion</Text>
      </View>

      {/* Card container (white box) */}
      <View className="bg-white rounded-2xl px-5 pt-5 pb-6 shadow-sm">
        {/* Title inside card (screenshot shows Sign up but context is sign in) */}
        <Text className="text-lg font-semibold text-neutral-900 text-center mb-4">
          Sign in
        </Text>

        {/* Row for social buttons */}
        {/* Center children horizontally since this is a row (main axis = horizontal). */}
        <View className="flex-row items-center justify-center mb-5">
          {/* NEW: Apple sign-in rendered inside form so it fits with layout */}
            {isIOS && (
              <View className='items-center' >
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                  buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                  cornerRadius={20}
                  style={styles.button}

                 onPress={async () => {
                  const { success, error } = await handleLoginWithAppleAuthUtil()
                  if (success){
                    router.replace("/(tabs)")
                  } else {
                    Alert.alert("Login Error", error.message);
                  }
                 }} 
                />
              </View>
            )}
          
        </View>
        

        {/* Separator line with OR */}
        <View className="flex-row items-center mb-5">
          <View className="flex-1 h-px bg-neutral-300" />
          <Text className="mx-3 text-xs font-medium text-neutral-500">OR</Text>
          <View className="flex-1 h-px bg-neutral-300" />
        </View>

        {/* Email input wrapper (rounded pill) */}
        <View className="flex-row items-center h-12 rounded-full border border-neutral-300 px-4 mb-3 bg-white">
          {/* Simple icon placeholder (replace later) */}
          {/* Add right spacing using style prop (marginRight ~ 8px). lucide icon doesn't use NativeWind className. */}
          <Mail color="gray" size={20} style={{ marginRight: 8 }} />
          {/* Text input for email */}
          <TextInput
            // Basic text input styling
            className="flex-1 text-sm text-neutral-900"
            // Placeholder shown when empty
            placeholder="Enter your Email"
            // Use email keyboard on mobile
            keyboardType="email-address"
            // Do not auto-cap since emails are case-insensitive
            autoCapitalize="none"
            // Controlled component binding to state
            value={email}
            // Update state on each keystroke
            onChangeText={setEmail}
            // Accessibility label
            accessibilityLabel="Email input"
            // Hide autoCorrect for emails
            autoCorrect={false}
          />
        </View>

        {/* Second input below the email (e.g., password) */}
        <View className="flex-row items-center h-12 rounded-full border border-neutral-300 px-4 mb-4 bg-white">
          {/* If you want an icon for this field add it here (e.g., lock). Left empty for now. */}
            <Lock color="gray" size={20} style={{ marginRight: 8 }} />
          {/* Password TextInput below the email; secureTextEntry hides input. */}
          <TextInput
            // Basic text input styling
            className="flex-1 text-sm text-neutral-900"
            // Placeholder shown when empty
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            // Use secure text entry
            // Hide characters for password fields
            secureTextEntry={true}
            // Do not auto-cap for password
            autoCapitalize="none"
            // Accessibility label
            accessibilityLabel="Password input"
            // Hide autoCorrect for passwords
            autoCorrect={false}
          />
        </View>

        {/* Login button */}
        <TouchableOpacity
          className="h-12 rounded-full  bg-black items-center justify-center flex-row active:opacity-90"
          onPress={handleLogin}
        >
          <Text className="text-white font-semibold mr-3 text-sm">Login</Text>
          {/* Simple arrow placeholder; swap for icon later */}
         <View className='bg-white rounded-full  w-8 h-8 justify-center items-center'>
                      <Text className='text-black  self-center'>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer link */}
      <View className="items-center mt-6">
        <Text className="text-xs text-neutral-600">
          {/* Combine plain + link style */}
          Don’t have an account? <Text className="text-amber-600">Sign up</Text>
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 200,
    height: 44,
  },
});