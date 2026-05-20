import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { TAJWID_RULES } from '@/constants/quran';
import { FontSize, Spacing } from '@/constants/theme';

export default function TajwidScreen() {
  const { theme } = useApp();
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | null>(0);
  const statusBarH = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;

  const ruleColors = ['#15803d', '#d97706', '#0284c7', '#dc2626', '#7c3aed', '#059669', '#ea580c', '#1d4ed8', '#9f1239'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: statusBarH + 8, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <ChevronLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <View>
          <Text style={{ color: theme.text.primary, fontSize: FontSize.xl, fontWeight: '800' }}>Tajwid Lessons</Text>
          <Text style={{ color: theme.gold, fontSize: FontSize.sm }}>أحكام التجويد</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.introBanner} padding={Spacing.lg}>
          <Text style={{ color: '#fff', fontSize: FontSize.lg, fontWeight: '700' }}>Learn Tajwid Rules</Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: FontSize.sm, marginTop: 6 }}>
            Master the rules of Quran recitation with clear explanations and examples.
          </Text>
        </Card>

        {TAJWID_RULES.map((rule, i) => (
          <TouchableOpacity key={i} onPress={() => setExpanded(expanded === i ? null : i)} activeOpacity={0.85}>
            <Card style={[styles.ruleCard, { borderLeftColor: ruleColors[i % ruleColors.length], borderLeftWidth: 4 }]} padding={Spacing.md}>
              <View style={styles.ruleHeader}>
                <View style={[styles.ruleIcon, { backgroundColor: ruleColors[i % ruleColors.length] + '20' }]}>
                  <Text style={{ color: ruleColors[i % ruleColors.length], fontWeight: '800', fontSize: FontSize.md }}>
                    {rule.arabic.charAt(0)}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: FontSize.md }}>{rule.rule}</Text>
                  <Text style={{ color: ruleColors[i % ruleColors.length], fontSize: FontSize.sm }}>{rule.arabic}</Text>
                </View>
                {expanded === i ? <ChevronUp size={18} color={theme.text.tertiary} /> : <ChevronDown size={18} color={theme.text.tertiary} />}
              </View>
              {expanded === i && (
                <View style={[styles.ruleBody, { borderTopColor: theme.border }]}>
                  <Text style={{ color: theme.text.secondary, fontSize: FontSize.md, lineHeight: 24 }}>{rule.description}</Text>
                  <View style={[styles.exampleBox, { backgroundColor: theme.surfaceSecondary }]}>
                    <Text style={{ color: theme.text.tertiary, fontSize: FontSize.xs, marginBottom: 4 }}>EXAMPLE</Text>
                    <Text style={{ color: theme.primary, fontSize: 22, textAlign: 'right' }}>{rule.example}</Text>
                  </View>
                </View>
              )}
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' },
  content: { padding: Spacing.lg, paddingBottom: 80, gap: 12 },
  introBanner: { backgroundColor: '#15803d', borderRadius: 16, marginBottom: 4 },
  ruleCard: {},
  ruleHeader: { flexDirection: 'row', alignItems: 'center' },
  ruleIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  ruleBody: { marginTop: 14, paddingTop: 14, borderTopWidth: 1 },
  exampleBox: { borderRadius: 10, padding: Spacing.md, marginTop: 12 },
});
