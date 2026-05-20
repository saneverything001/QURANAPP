import React from 'react';
import { View, ViewStyle, TouchableOpacity, StyleProp } from 'react-native';
import { useApp } from '@/context/AppContext';
import { BorderRadius, Spacing } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padding?: number;
}

export function Card({ children, style, onPress, padding = Spacing.md }: CardProps) {
  const { theme } = useApp();

  const cardStyle: ViewStyle = {
    backgroundColor: theme.card,
    borderRadius: BorderRadius.lg,
    padding,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  };

  if (onPress) {
    return (
      <TouchableOpacity style={[cardStyle, style]} onPress={onPress} activeOpacity={0.85}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}
