import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useApp } from '@/context/AppContext';
import { FontSize } from '@/constants/theme';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}

export function ProgressRing({ progress, size = 100, strokeWidth = 8, label, sublabel, color }: ProgressRingProps) {
  const { theme } = useApp();
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const activeColor = color ?? theme.primary;
  const cx = size / 2;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cx} r={r} stroke={theme.border} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={cx} cy={cx} r={r}
          stroke={activeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cx})`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        {label && <Text style={{ color: theme.text.primary, fontSize: FontSize.xl, fontWeight: '700' }}>{label}</Text>}
        {sublabel && <Text style={{ color: theme.text.tertiary, fontSize: FontSize.xs }}>{sublabel}</Text>}
      </View>
    </View>
  );
}
