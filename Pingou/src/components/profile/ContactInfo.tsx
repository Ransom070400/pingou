import React from 'react'
import { View, Text } from 'react-native'

interface ContactInfoProps {
  email?: string
  phone?: string
}

const ContactInfo: React.FC<ContactInfoProps> = ({ email, phone }) => {
  return (
    <View className="bg-white dark:bg-neutral-900 rounded-2xl p-6 mx-4 shadow-sm">
      {/* Title */}
      <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
        Contact information
      </Text>

      {/* Email section (render only if provided) */}
      {email && (
        <View className="mb-4">
          <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
            Email
          </Text>
          <Text className="text-base text-neutral-800 dark:text-neutral-200">
            {email}
          </Text>
        </View>
      )}

      {/* Phone section */}
      {phone && (
        <View>
          <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
            Phone
          </Text>
          <Text className="text-base text-neutral-800 dark:text-neutral-200">
            {phone}
          </Text>
        </View>
      )}
    </View>
  )
}

export default ContactInfo