import React, { useMemo } from 'react'
import { View, Text } from 'react-native'
// If you have a QR lib installed (e.g. react-native-qrcode-svg) uncomment below:
// import QRCode from 'react-native-qrcode-svg'

interface ProfileQRCodeProps {
  // The unique user id we encode
  userId: string
  // Optional explicit value override (lets you pass a deep link later)
  valueOverride?: string
  // Optional size so parent can control dimensions (defaults sensible)
  size?: number
}

const ProfileQRCode: React.FC<ProfileQRCodeProps> = ({
  userId,
  valueOverride,
  size = 160
}) => {
  // Build the value ONCE per userId/valueOverride change.
  // useMemo caches the computed string; cheap now but shows correct pattern.
  const qrValue = useMemo(
    () => valueOverride ?? `pingou:user:${userId}`,
    [userId, valueOverride]
  )

  return (
    <View className="bg-white dark:bg-neutral-900 rounded-2xl p-6 mx-4 shadow-sm">
      {/* Section title */}
      <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100 text-center">
        Your QR Code
      </Text>
      {/* Subtitle */}
      <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 text-center">
        Scan to connect
      </Text>

      {/* QR visual wrapper */}
      <View className="mt-6 items-center">
        <View className="p-4 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
          {/* Placeholder block if QR library not yet added */}
          <View
            // Fixed size container using passed size (h/w must match for square)
            style={{ height: size, width: size }}
            className="items-center justify-center bg-neutral-100 dark:bg-neutral-700 rounded-xl"
          >
            <Text className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              📱 QR Code
            </Text>
            <Text className="mt-2 max-w-[140px] text-xs text-center text-neutral-400 dark:text-neutral-400">
              Scan with camera
            </Text>
          </View>

          {/*
            Real usage (uncomment when lib installed):
            <QRCode
              value={qrValue}
              size={size}
              backgroundColor="transparent"
              color={isDark ? '#fff' : '#000'}
            />
          */}
        </View>
      </View>
    </View>
  )
}

export default ProfileQRCode