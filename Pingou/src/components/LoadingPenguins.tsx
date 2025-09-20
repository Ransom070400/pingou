import React, { useEffect, useRef } from 'react'
// Use Animated for simple, native-driver rotation
import { View, Text, Image, Animated, Easing, type ImageSourcePropType } from 'react-native'

type LoadingPenguinsProps = {
  // Optional image source for a penguin asset. If not provided, we render emoji "🐧".
  penguinSource?: ImageSourcePropType
  // Diameter of the rotating ring (container). Keep it small to fit in many screens.
  size?: number
  // Width/height of each penguin
  penguinSize?: number
  // Full rotation duration (ms)
  speedMs?: number
  // Loading label shown in center (e.g., "Pingou")
  label?: string
  // Direction of rotation
  rotateDirection?: 'cw' | 'ccw'
  // Optional tailwind classes for container
  className?: string
  // Optional testID for testing
  testID?: string
}

const LoadingPenguins: React.FC<LoadingPenguinsProps> = ({
  // Provide defaults that look good out of the box
  penguinSource,
  size = 160,
  penguinSize = 36,
  speedMs = 1500,
  label = 'Pingou',
  rotateDirection = 'cw',
  className,
  testID = 'loading-penguins',
}) => {
  // Create a single Animated.Value that goes from 0 -> 1 repeatedly
  const progress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Start an infinite loop of 0->1 with linear easing
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: speedMs,
        easing: Easing.linear,
        useNativeDriver: true, // offloads to native thread for smoother perf
      })
    )
    // Kick off the animation
    loop.start()
    // Stop when unmounting to avoid memory leaks
    return () => loop.stop()
  }, [progress, speedMs])

  // Convert 0->1 into degrees for rotation
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: rotateDirection === 'cw' ? ['0deg', '360deg'] : ['0deg', '-360deg'],
  })

  // Compute radius so penguins sit just inside the ring
  const radius = (size - penguinSize) / 2

  // Small helper to render one penguin at a cardinal position
  const Penguin = ({
    translateX = 0,
    translateY = 0,
    rotateDeg = '0deg',
    keyId,
  }: {
    translateX?: number
    translateY?: number
    rotateDeg?: string
    keyId: string
  }) => (
    // Position each penguin relative to the center of the ring
    <View key={keyId} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
      {/* Move the penguin from the center to the requested position */}
      <View style={{ transform: [{ translateX }, { translateY }] }}>
        {/* Rotate each penguin so it faces outward for a playful look */}
        <View style={{ transform: [{ rotate: rotateDeg }] }}>
          {penguinSource ? (
            // Render provided penguin asset
            <Image
              // Set the image size square
              style={{ width: penguinSize, height: penguinSize }}
              source={penguinSource}
              resizeMode="contain"
              // Basic accessibility
              accessibilityRole="image"
              accessibilityLabel="Loading penguin"
            />
          ) : (
            // Fallback: render an emoji if you haven't provided an asset yet
            <Text
              // Make emoji roughly same visual size
              style={{ fontSize: penguinSize, color: '#000' }}
            >
              {/* Penguin emoji fallback */}
              🐧
            </Text>
          )}
        </View>
      </View>
    </View>
  )

  return (
    // Outer container now fills the screen and centers everything
    <View
      testID={testID}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Rotating ring that carries the four penguins */}
      <Animated.View
        // Square area that defines the circle diameter
        style={{
          width: size,
          height: size,
          // Optional: rounded for visual debugging (we keep it invisible)
          borderRadius: size / 2,
          // Apply continuous rotation
          transform: [{ rotate }],
        }}
        // Prevent the spinner from intercepting touches
        pointerEvents="none"
      >
        {/* Top penguin (12 o'clock) */}
        <Penguin keyId="top" translateY={-radius} rotateDeg="0deg" />
        {/* Right penguin (3 o'clock) */}
        <Penguin keyId="right" translateX={radius} rotateDeg="90deg" />
        {/* Bottom penguin (6 o'clock) */}
        <Penguin keyId="bottom" translateY={radius} rotateDeg="180deg" />
        {/* Left penguin (9 o'clock) */}
        <Penguin keyId="left" translateX={-radius} rotateDeg="270deg" />
      </Animated.View>

      {/* Center label — keeps your brand visible during loading */}
      <Text style={{ marginTop: 12, fontSize: 16, fontWeight: '600', color: '#000' }}>
        {/* Split "Pingou" so we can color the 'o' */}
        Pin
        <Text style={{ color: '#f97316' }}>g</Text>
        ou
      </Text>
    </View>
  )
}

export default LoadingPenguins