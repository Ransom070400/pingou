import { View, Text, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { Camera, Edit, PencilIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

type Props = {
  fullName: string;
  tagline: string;
  avatarUrl?: string | null;
};

const ProfileHeader = ({ fullName, tagline, avatarUrl }: Props) => {
  // Get current color scheme to adapt icon color for dark/light mode
  const colorScheme = useColorScheme();
  // Used for the camera badge (contrasts with badge bg)
  const badgeIconColor = colorScheme === 'dark' ? '#000' : '#fff';
  // Used for inline "Edit" icon to match the button text color
  const editIconColor = colorScheme === 'dark' ? '#fff' : '#000';
  const [imageUri, setImageUri] = useState<string | null>(null);


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };


  // Create a cross-platform shadow style for the Edit button.
  // Using elevation for Android and shadow* properties for iOS.
  // We slightly reduce shadow intensity in dark mode so it doesn't look harsh.
  const buttonShadowStyle =
    colorScheme === 'dark'
      ? {
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.12,
          shadowRadius: 2,
        }
      : {
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        };

  return (
    <View className="mt-[80px] items-center">
      {/* Avatar + badge wrapper: make this container relative and sized to avatar */}
      <View className="relative h-32 w-32">
        {/* Avatar wrapper - larger size to match design */}
        <View className="h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-orange-400 to-yellow-500 shadow-lg">

          {/* //TO-DO: Remember to change it to avatarUrl */}
          {imageUri ? (
            <View>
              <Image source={{ uri: imageUri }} className="h-44 w-44" resizeMode="contain" />
            </View>
          ) : (
            <View className="h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-yellow-500">
              <Text className="text-3xl font-bold text-white">
                {fullName
                  .split(' ')
                  .map((name) => name.charAt(0))
                  .join('')}
              </Text>
            </View>
          )}
        </View>

        {/* 
          Positioned badge: use absolute positioning relative to the avatar container.
          We offset it slightly outside the right edge (right: -12) and vertically center it
          using top: '50%' and translateY: -20 (half of badge height = 20).
        */}
        <TouchableOpacity
          onPress={pickImage}
          accessibilityLabel="Open photo picker"
          // Inline style used for precise pixel offsets and transform (more reliable cross-platform).
          style={{
            position: 'absolute',
            right: -2, // move badge slightly outside the avatar's right edge
            top: '65%', // start at half the container height
            transform: [{ translateY: -1 }], // shift up by half the badge height to vertically center
          }}
          activeOpacity={0.8}>
          {/* Small circular badge with icon; adapts to dark mode */}
          <View className="h-10 w-10 items-center justify-center rounded-full bg-black shadow dark:bg-white">
            {/* Lucide icon: color chosen based on color scheme so it contrasts with background */}
            <Camera size={25} color={badgeIconColor} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Name */}
      <Text className="mt-6 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        {fullName}
      </Text>
      {/* Tagline */}
      <Text className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">"{tagline}"</Text>

      {/* Edit profile button - Replaced inline icon inside Text with a horizontal row
          so we can control spacing between the label and the icon. */}
      <TouchableOpacity
        onPress={() => {}}
        className="mt-4 rounded-full bg-white p-2 px-6 py-2 dark:bg-neutral-100"
        // Apply the computed cross-platform shadow style via style prop.
        style={buttonShadowStyle}
        activeOpacity={0.7}>
        {/* Row layout to place text and icon side-by-side */}
        <View className="flex-row items-center p-2">
          {/* Button label - text color adapts to color scheme via tailwind classes */}
          <Text className="text-xl font-medium  text-black dark:text-white">Edit profile</Text>

          {/* Small left margin to create space between text and icon.
              We use an inline style on the icon because lucide-react-native components
              don't accept tailwind className spacing reliably. */}
          <Edit size={15} color={editIconColor} style={{ marginLeft: 8 }} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;
