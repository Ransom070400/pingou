import React from 'react';
import { Canvas, Text, matchFont, Mask, Rect } from '@shopify/react-native-skia';
import { useSharedValue, withTiming, useDerivedValue } from 'react-native-reanimated';
import { Platform } from 'react-native';

interface TextRevealProps {
  text: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  duration?: number;
  trigger?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  fontSize = 24,
  fontWeight = 'normal',
  duration = 1000,
  trigger = false
}) => {
  const font = matchFont({
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'Roboto',
      default: 'System'
    }),
    fontSize,
    fontStyle: 'normal',
    fontWeight,
  });

  const progress = useSharedValue(0);

  React.useEffect(() => {
    if (trigger) {
      progress.value = withTiming(1, { duration });
    } else {
      progress.value = withTiming(0, { duration: duration / 2 });
    }
  }, [trigger, duration]);

  const textWidth = font.measureText(text).width;
  const textHeight = fontSize * 1.2;

  // Bridge progress to Skia using useDerivedValue
  const maskWidth = useDerivedValue(() => progress.value * textWidth);

  return (
    <Canvas style={{ width: textWidth, height: textHeight }}>
      <Mask
        mask={
          <Rect x={0} y={0} width={maskWidth} height={textHeight} color="white" />
        }
      >
        <Text
          x={0}
          y={fontSize}
          text={text}
          font={font}
          color="black"
        />
      </Mask>
    </Canvas>
  );
};