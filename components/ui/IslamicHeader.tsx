import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { FontSize, Spacing } from '@/constants/theme';

interface IslamicHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function IslamicHeader({ title, subtitle, showBack, rightAction }: IslamicHeaderProps) {
  const { theme } = useApp();
  const router = useRouter();
  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;

  return (
    <View
      style={{
        backgroundColor: theme.surface,
        paddingTop: statusBarHeight + 8,
        paddingBottom: 16,
        paddingHorizontal: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {showBack && (
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
          <ChevronLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.text.primary, fontSize: FontSize.lg, fontWeight: '700' }}>{title}</Text>
        {subtitle && (
          <Text style={{ color: theme.text.secondary, fontSize: FontSize.sm, marginTop: 2 }}>{subtitle}</Text>
        )}
      </View>
      {rightAction}
    </View>
  );
}
