```typescript

// ...existing code...
import React, { useState } from 'react'
// Import RN primitives used in this component
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
// Import Expo Image Picker to let user pick photos
import * as ImagePicker from 'expo-image-picker'
// Import the shared card chrome component
import OnboardingCard from './OnboardingCard'
// Import camera icon from lucide-react-native
import { Camera } from 'lucide-react-native'

interface Props {
  // 1-based current step index (optional)
  onBack: () => void
  // continuation callback receives selected image URI
  onContinue: (imageUri: string) => void
  currentStep?: number
  // total number of onboarding steps (optional)
  totalSteps?: number
}

export default function AddProfileCard({ currentStep, totalSteps, onBack, onContinue }: Props) {
  // Local state to hold selected image URI (null when none)
  const [imageUri, setImageUri] = useState<string | null>(null)

  // Ask permission + open image library, then save chosen image URI
  const pickImage = async () => {
    // Request media library permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      // Alert user if permission is denied
      Alert.alert('Permission required', 'We need permission to access your photos.')
      return
    }

    // Open the image picker with square crop to fit circular avatar
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    // Support both old and new result shapes
    const uri = (result as any).assets?.[0]?.uri ?? (result as any).uri
    if (uri) {
      // Save and show the selected image
      setImageUri(uri)
    }
  }

  // Derived: enable Continue only when an image exists
  const hasAny = !!imageUri

  return (
    <OnboardingCard
      currentStep={currentStep}
      totalSteps={totalSteps}
      title="Almost there!"
      subtitle="Tap the camera icon to upload a photo"
    >
      <View className="items-center mb-6">
        {/* Avatar circle - tappable to pick an image */}
        <View className="relative">
          {/* Touchable area is the whole circle */}
          <TouchableOpacity
            // Larger circle for better UI (w-48 ~ 192px). Dark mode friendly bg.
            className="w-48 h-48 rounded-full bg-neutral-200 dark:bg-neutral-800 items-center justify-center overflow-hidden"
            onPress={pickImage}
            accessibilityLabel="Add profile photo"
          >
            {imageUri ? (
              // Show chosen image filling the circle; resizeMode cover crops to fit
              <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
            ) : (
              // Placeholder: Pingou logo centered inside grey circle
              <Image
                source={require('../../assets/PingouLogoWOBG.png')}
                className="w-28 h-28"
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>

          {/* Camera badge positioned bottom-right inside the circle */}
          <TouchableOpacity
            // Absolute positioning relative to parent .relative
            onPress={pickImage}
            className="absolute right-3 bottom-3"
            accessibilityLabel="Open photo picker"
          >
            {/* Small circular badge with icon; adapts to dark mode */}
            <View className="w-10 h-10 rounded-full bg-black dark:bg-white items-center justify-center shadow">
              {/* Lucide icon: set size and color to contrast with bg */}
              <Camera size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Hint under avatar */}
        <Text className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">Add a profile photo</Text>
      </View>

      {/* Actions row: Back + Continue */}
      <View className="mt-2 flex-row">
        <TouchableOpacity
          onPress={onBack}
          className="mr-3 h-12 flex-1 flex-row items-center justify-center rounded-full border border-neutral-300"
        >
          <Text className="font-medium text-neutral-800 dark:text-neutral-200">Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!hasAny}
          onPress={() => onContinue(imageUri ?? '')}
          className={`h-12 flex-1 flex-row items-center justify-center rounded-full ${
            hasAny ? 'bg-black' : 'bg-neutral-400'
          }`}
        >
          <Text className="mr-3 font-semibold text-white">Continue</Text>
          <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
            <Text className="text-black">→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </OnboardingCard>
  )
}
// ...existing code...

```