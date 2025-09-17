import React, { useMemo } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { supabase } from '~/src/lib/supabase'

// Child components
import ProfileHeader from '~/src/components/profile/ProfileHeader'
import StatsRow from '~/src/components/profile/StatsRow'
import ContactInfo from '~/src/components/profile/ContactInfo'
import SocialLinks from '~/src/components/profile/SocialLinks'
import ProfileQRCode from '~/src/components/profile/ProfileQRCode'

// Types + helper
import { ProfileType } from '~/src/types/ProfileTypes'
import { buildSocialLinks } from '~/src/utils/buildSocialLinks'

// Mock profile data (replace later with Supabase fetch)
const mockProfile: ProfileType = {
  user_id: 'uuid-123',
  email: 'ogechukwucarolineogechi@gmail.com',
  nickname: 'oge',
  fullname: 'Ogechukwu Caroline',
  instagram: 'instagram.com/username',
  twitter: 'x.com/formerly_twitter',
  linkedin: 'linkedin.com/in/ogechukwu',
  phone: '08123456789',
  extras: ['behance.net/ogechukwu'],
  created_at: '2025-09-16T00:00:00Z',
  updated_at: '2025-09-16T00:00:00Z'
}

const Index: React.FC = () => {
  // Memoize built social links so they are not rebuilt on unrelated re-renders.
  const socialList = useMemo(() => buildSocialLinks(mockProfile), [])

  return (
    <View className="flex-1 bg-neutral-100 dark:bg-neutral-900">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* //Sign out button */}
        {/* <TouchableOpacity
          onPress={() => supabase.auth.signOut()}
          className="self-end m-4 px-4 py-2 rounded-full bg-neutral-900 dark:bg-neutral-100"
          activeOpacity={0.6}
        >
          <Text className="text-sm font-medium text-white dark:text-black">
            Sign Out
          </Text>
        </TouchableOpacity> */}

        {/* Header */}
        <ProfileHeader
          fullName={mockProfile.fullname}
          tagline="I design for a living"
          avatarUrl={mockProfile.profile_url}
        />

        {/* Stats */}
        <StatsRow tokens={0} connections={10} />

        {/* QR Code */}
        <View className="mt-8">
          <ProfileQRCode userId={mockProfile.user_id} />
        </View>

        {/* Contact */}
        <View className="mt-6">
          <ContactInfo email={mockProfile.email} phone={mockProfile.phone} />
        </View>

        {/* Socials */}
        <View className="mt-6 mb-8">
          <SocialLinks links={socialList} />
        </View>
      </ScrollView>
    </View>
  )
}

export default Index