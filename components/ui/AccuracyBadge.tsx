import React from 'react';
import { View, Text } from 'react-native';
import { useApp } from '@/context/AppContext';
import { FontSize, BorderRadius } from '@/constants/theme';

interface AccuracyBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AccuracyBadge({ score, size = 'md' }: AccuracyBadgeProps) {
  const { theme } = useApp();

  const color = score >= 90 ? theme.success : score >= 70 ? theme.gold : theme.error;

  const label = score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Work';

  const sizes = { sm: { fs: FontSize.xs, pad: 4 }, md: { fs: FontSize.sm, pad: 6 }, lg: { fs: FontSize.md, pad: 8 } };
  const s = sizes[size];

  return (
    <View style={{
      backgroundColor: `${color}18`,
      borderRadius: BorderRadius.full,
      paddingVertical: s.pad,
      paddingHorizontal: s.pad * 2,
      borderWidth: 1,
      borderColor: `${color}40`,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    }}>
      <Text style={{ color, fontSize: s.fs, fontWeight: '700' }}>{score}%</Text>
      <Text style={{ color, fontSize: s.fs, opacity: 0.8 }}>{label}</Text>
    </View>
  );
}
