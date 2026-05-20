import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useApp } from '@/context/AppContext';

interface WaveformVisualizerProps {
  data: number[];
  isActive: boolean;
  color?: string;
  height?: number;
}

export function WaveformVisualizer({ data, isActive, color, height = 60 }: WaveformVisualizerProps) {
  const { theme } = useApp();
  const activeColor = color ?? theme.primary;
  const animations = useRef(data.map(() => new Animated.Value(0.1))).current;

  useEffect(() => {
    if (isActive) {
      const anims = animations.map((anim, i) =>
        Animated.sequence([
          Animated.delay(i * 30),
          Animated.spring(anim, {
            toValue: data[i] ?? 0.1,
            useNativeDriver: false,
            speed: 20,
          }),
        ])
      );
      Animated.parallel(anims).start();
    } else {
      animations.forEach((anim) =>
        Animated.spring(anim, { toValue: 0.1, useNativeDriver: false, speed: 5 }).start()
      );
    }
  }, [data, isActive]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height, gap: 3, justifyContent: 'center' }}>
      {animations.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            width: 3,
            height: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [4, height],
            }),
            backgroundColor: activeColor,
            borderRadius: 2,
            opacity: isActive ? 1 : 0.3,
          }}
        />
      ))}
    </View>
  );
}
