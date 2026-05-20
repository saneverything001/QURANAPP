import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { useApp } from '@/context/AppContext';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, hint, leftIcon, rightIcon, containerStyle, style, ...rest }: InputProps) {
  const { theme } = useApp();
  const [focused, setFocused] = useState(false);

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={{ color: theme.text.secondary, fontSize: FontSize.sm, fontWeight: '500', marginBottom: 6 }}>
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.surface,
          borderRadius: BorderRadius.md,
          borderWidth: 1.5,
          borderColor: error ? theme.error : focused ? theme.primary : theme.border,
          paddingHorizontal: Spacing.md,
        }}
      >
        {leftIcon && <View style={{ marginRight: 10 }}>{leftIcon}</View>}
        <TextInput
          style={[
            {
              flex: 1,
              color: theme.text.primary,
              fontSize: FontSize.md,
              paddingVertical: 14,
            },
            style,
          ]}
          placeholderTextColor={theme.text.tertiary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {rightIcon && <View style={{ marginLeft: 10 }}>{rightIcon}</View>}
      </View>
      {(error || hint) && (
        <Text style={{ color: error ? theme.error : theme.text.tertiary, fontSize: FontSize.xs, marginTop: 4 }}>
          {error ?? hint}
        </Text>
      )}
    </View>
  );
}
