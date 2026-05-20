import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { IslamicStar, GeometricAccent } from '@/components/ui/IslamicPattern';
import { FontSize, Spacing } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { theme } = useApp();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 14, stiffness: 90 }),
    ]).start();
  }, []);

  const features = [
    { icon: '📖', text: 'AI-powered Tajwid correction' },
    { icon: '🎙️', text: 'Live recitation feedback' },
    { icon: '🧠', text: 'Smart Hifz memorization' },
    { icon: '📊', text: 'Detailed progress tracking' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.heroSection, { backgroundColor: theme.primary }]}>
        <View style={styles.decorTop}>
          <GeometricAccent size={220} color="#fff" opacity={1} />
        </View>
        <Animated.View style={[styles.heroContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <IslamicStar size={80} color="#fff" opacity={0.9} />
          <Text style={styles.heroTitle}>Quran Companion AI</Text>
          <Text style={styles.heroArabic}>رفيقك في حفظ القرآن</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.bottomSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={[styles.subtitle, { color: theme.text.primary }]}>
          Master the Quran with AI-powered guidance
        </Text>

        <View style={styles.features}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={[styles.featureText, { color: theme.text.secondary }]}>{f.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttons}>
          <Button label="Get Started" onPress={() => router.push('/(auth)/register')} fullWidth size="lg" />
          <Button label="Sign In" onPress={() => router.push('/(auth)/login')} variant="secondary" fullWidth size="lg" style={{ marginTop: 12 }} />
          <Button label="Continue as Guest" onPress={() => router.replace('/(tabs)')} variant="ghost" fullWidth size="md" style={{ marginTop: 8 }} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroSection: { height: height * 0.42, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  decorTop: { position: 'absolute', top: -40, right: -40, opacity: 0.12 },
  heroContent: { alignItems: 'center' },
  heroTitle: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 16, letterSpacing: -0.5 },
  heroArabic: { color: 'rgba(255,255,255,0.8)', fontSize: 18, marginTop: 6 },
  bottomSection: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  subtitle: { fontSize: FontSize.xl, fontWeight: '700', textAlign: 'center', marginBottom: Spacing.lg },
  features: { gap: 12, marginBottom: Spacing.xl },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: { fontSize: 20, width: 32 },
  featureText: { fontSize: FontSize.md, flex: 1 },
  buttons: { gap: 0 },
});
