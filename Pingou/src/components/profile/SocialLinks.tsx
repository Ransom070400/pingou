import React from 'react'
import { View, Text, TouchableOpacity, Linking } from 'react-native'

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

// Cross‑platform shadow that resembles a raised button
const cardShadow = {
  // iOS shadow props
  shadowColor: '#000',
  shadowOpacity: 0.10,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  // Android elevation
  elevation: 6
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

      {/* List with vertical spacing between cards */}
      <View
        // Increase gap between card wrappers so their shadows don't visually merge.
        // space-y-6 = 24px margin-top applied to every child except the first.
        className="space-y-6"
      >
        {links.map(link => (
          // Wrapper adds the shadow; keep rounded so shadow matches shape
          <View key={link.id} style={cardShadow} className="rounded-xl">
            {/* Card content */}
            <TouchableOpacity
              onPress={() => Linking.openURL(link.url)}
              activeOpacity={0.8}
              // Card look: own background + padding + rounded corners
              className="flex-row items-center gap-4 p-4 mb-2 bg-white dark:bg-neutral-800 rounded-xl"
              accessibilityRole="link"
              accessibilityLabel={`${link.label} link`}
            >
              {/* Platform icon with brand-like background */}
              <View className={`h-10 w-10 rounded-full ${getPlatformColor(link.label)} items-center justify-center`}>
                <Text className="text-white font-bold text-lg">
                  {getPlatformIcon(link.label)}
                </Text>
              </View>

              {/* Texts: label + muted URL preview */}
              <View className="flex-1">
                <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  {link.label}
                </Text>
                {/* numberOfLines truncates like your screenshot */}
                <Text numberOfLines={1} className="text-sm text-neutral-500 dark:text-neutral-400">
                  {link.url}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  )
}

export default SocialLinks