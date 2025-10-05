import React, { useEffect, useRef } from 'react'
import { View, Text, Image, Animated, Easing, type ImageSourcePropType } from 'react-native'

type LoadingPenguinsProps = {
  penguinSource?: ImageSourcePropType
  size?: number
  penguinSize?: number
  speedMs?: number
  label?: string
  rotateDirection?: 'cw' | 'ccw'
  className?: string
  testID?: string
}

const LoadingPenguins: React.FC<LoadingPenguinsProps> = ({
  penguinSource,
  size = 160,
  penguinSize = 36,
  speedMs = 1500,
  label = 'Pingou',
  rotateDirection = 'cw',
  className,
  testID = 'loading-penguins',
}) => {
  const progress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: speedMs,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    )
    loop.start()
    return () => loop.stop()
  }, [progress, speedMs])

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: rotateDirection === 'cw' ? ['0deg', '360deg'] : ['0deg', '-360deg'],
  })

  const radius = (size - penguinSize) / 2

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
    <View key={keyId} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ transform: [{ translateX }, { translateY }] }}>
        <View style={{ transform: [{ rotate: rotateDeg }] }}>
          {penguinSource ? (
            <Image
              style={{ width: penguinSize, height: penguinSize }}
              source={penguinSource}
              resizeMode="contain"
              accessibilityRole="image"
              accessibilityLabel="Loading penguin"
            />
          ) : (
            <Text style={{ fontSize: penguinSize, color: '#000' }}>🐧</Text>
          )}
        </View>
      </View>
    </View>
  )

  return (
    <View
      testID={testID}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
      }}
    >
      <View
        style={{
          width: size,
          height: size,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        pointerEvents="none"
      >
        {/* Steady Center Label */}
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}>
          <Text style={{ fontSize: 34, fontWeight: '800', color: '#000' }}>
            Pin
            <Text style={{ color: '#f97316' }}>g</Text>
            ou
          </Text>
        </View>

        {/* Rotating ring with penguins */}
        <Animated.View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            position: 'absolute',
            top: 0, left: 0,
            transform: [{ rotate }],
            zIndex: 0,
          }}
          pointerEvents="none"
        >
          <Penguin keyId="top" translateY={-radius} rotateDeg="0deg" />
          <Penguin keyId="right" translateX={radius} rotateDeg="90deg" />
          <Penguin keyId="bottom" translateY={radius} rotateDeg="180deg" />
          <Penguin keyId="left" translateX={-radius} rotateDeg="270deg" />
        </Animated.View>
      </View>
    </View>
  )
}

export default LoadingPenguins