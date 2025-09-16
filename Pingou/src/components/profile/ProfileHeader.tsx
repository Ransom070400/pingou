import { View, Text, Image, TouchableOpacity } from 'react-native'

type Props = {
  fullName: string
  tagline: string
  avatarUrl?: string | null
}

const ProfileHeader = ({ fullName, tagline, avatarUrl }: Props) => {
  return (
    <View className="items-center mt-8">
      {/* Avatar wrapper - larger size to match design */}
      <View className="h-32 w-32 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 items-center justify-center overflow-hidden border-4 border-white shadow-lg">
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} className="h-full w-full" resizeMode="cover" />
        ) : (
          <View className="h-full w-full rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 items-center justify-center">
            <Text className="text-3xl font-bold text-white">
              {fullName.split(' ').map(name => name.charAt(0)).join('')}
            </Text>
          </View>
        )}
      </View>
      {/* Name */}
      <Text className="mt-6 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        {fullName}
      </Text>
      {/* Tagline */}
      <Text className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        "{tagline}"
      </Text>
      {/* Edit profile button */}
      <TouchableOpacity
        onPress={() => {}}
        className="mt-4 px-6 py-2 rounded-full bg-neutral-900 dark:bg-neutral-100"
        activeOpacity={0.7}
      >
        <Text className="text-sm font-medium text-white dark:text-black">
          Edit profile ✏️
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ProfileHeader