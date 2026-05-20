import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';
import { useApp } from '@/context/AppContext';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({
  label, onPress, variant = 'primary', size = 'md',
  loading, disabled, icon, style, textStyle, fullWidth,
}: ButtonProps) {
  const { theme } = useApp();

  const sizeStyles: Record<string, { paddingVertical: number; paddingHorizontal: number; fontSize: number; borderRadius: number }> = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: FontSize.sm, borderRadius: BorderRadius.md },
    md: { paddingVertical: 14, paddingHorizontal: 24, fontSize: FontSize.md, borderRadius: BorderRadius.md },
    lg: { paddingVertical: 18, paddingHorizontal: 32, fontSize: FontSize.lg, borderRadius: BorderRadius.lg },
  };

  const variantStyles: Record<string, { bg: string; text: string; border?: string }> = {
    primary: { bg: theme.primary, text: '#fff' },
    secondary: { bg: theme.surfaceSecondary, text: theme.text.primary, border: theme.border },
    ghost: { bg: 'transparent', text: theme.primary },
    gold: { bg: theme.gold, text: '#000' },
    danger: { bg: theme.error, text: '#fff' },
  };

  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        {
          backgroundColor: v.bg,
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          borderRadius: s.borderRadius,
          borderWidth: v.border ? 1 : 0,
          borderColor: v.border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <>
          {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text style={[{ color: v.text, fontSize: s.fontSize, fontWeight: '600' }, textStyle]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
