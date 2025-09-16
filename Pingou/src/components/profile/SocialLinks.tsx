import React from 'react'
import { View, Text, TouchableOpacity, Linking } from 'react-native'

import { Twitter, Instagram, Linkedin, Palette, Globe } from 'lucide-react-native'

export interface SocialLink {
  // Stable unique id for key extraction
  id: string
  // Human readable platform label
  label: string
  // Full URL we open
  url: string
}

interface SocialLinksProps {
  // Pre-built list (kept dumb; parent handles building)
  links: SocialLink[]
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
  // Function to get platform icon based on platform name
  const getPlatformIcon = (label: string) => {
    const platform = label.toLowerCase()
    if (platform.includes('twitter') || platform.includes('x')) return '𝕏'
    if (platform.includes('instagram')) return '📷'
    if (platform.includes('linkedin')) return '💼'
    if (platform.includes('behance')) return '🎨'
    return label.charAt(0)
  }

  // Function to get platform background color
  const getPlatformColor = (label: string) => {
    const platform = label.toLowerCase()
    if (platform.includes('twitter') || platform.includes('x')) return 'bg-black'
    if (platform.includes('instagram')) return 'bg-pink-500'
    if (platform.includes('linkedin')) return 'bg-blue-600'
    if (platform.includes('behance')) return 'bg-blue-500'
    return 'bg-neutral-600'
  }

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-2xl p-6 mx-4 shadow-sm">
      {/* Title */}
      <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
        Social media
      </Text>

      {/* List */}
      <View className="space-y-3">
        {links.map(link => (
          <TouchableOpacity
            key={link.id}
            onPress={() => Linking.openURL(link.url)}
            activeOpacity={0.7}
            className="flex-row items-center gap-4 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl"
          >
            {/* Platform icon with color */}
            <View className={`h-10 w-10 rounded-full ${getPlatformColor(link.label)} items-center justify-center`}>
              <Text className="text-white font-bold text-lg">
                {getPlatformIcon(link.label)}
              </Text>
            </View>
            {/* Platform name */}
            <Text className="flex-1 text-base font-medium text-neutral-800 dark:text-neutral-200">
              {link.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default SocialLinks