import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useApp } from '@/context/AppContext';
import { ArabicFontSize } from '@/constants/theme';

interface ArabicTextProps {
  text: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  color?: string;
  style?: TextStyle;
  highlighted?: boolean;
  mistake?: boolean;
}

export function ArabicText({ text, size = 'medium', color, style, highlighted, mistake }: ArabicTextProps) {
  const { theme, settings } = useApp();
  const fs = ArabicFontSize[settings.arabicFontSize] ?? ArabicFontSize[size];

  return (
    <Text
      style={[
        {
          fontSize: fs,
          color: mistake ? theme.error : color ?? theme.text.primary,
          backgroundColor: highlighted ? theme.primaryLight : mistake ? `${theme.error}22` : 'transparent',
          textAlign: 'right',
          lineHeight: fs * 1.8,
          fontFamily: 'System',
          borderRadius: 4,
          paddingHorizontal: highlighted || mistake ? 4 : 0,
        },
        style,
      ]}
    >
      {text}
    </Text>
  );
}
