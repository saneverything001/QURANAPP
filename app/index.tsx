import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { GeometricAccent, IslamicStar } from '@/components/ui/IslamicPattern';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { session, loading, theme } = useApp();
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 100 }),
      ]),
      Animated.delay(100),
      Animated.timing(logoFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(textFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(subtitleFade, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/welcome');
      }
    }, 2800);
    return () => clearTimeout(timer);
  }, [loading, session]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Background decorations */}
      <View style={[styles.topDecor, { opacity: 0.08 }]}>
        <GeometricAccent size={300} color={theme.gold} opacity={1} />
      </View>
      <View style={[styles.bottomDecor, { opacity: 0.06 }]}>
        <GeometricAccent size={250} color={theme.gold} opacity={1} />
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Logo area */}
        <Animated.View style={[styles.logoContainer, { opacity: logoFade, backgroundColor: `${theme.primary}15`, borderColor: `${theme.gold}30` }]}>
          <IslamicStar size={100} color={theme.gold} opacity={1} />
          <View style={[styles.bismillahBadge, { backgroundColor: theme.primary }]}>
            <Text style={styles.bismillahText}>بسم الله</Text>
          </View>
        </Animated.View>

        {/* App name */}
        <Animated.View style={{ opacity: textFade, alignItems: 'center', marginTop: 32 }}>
          <Text style={[styles.appName, { color: theme.primary }]}>Quran Companion</Text>
          <View style={[styles.aiChip, { backgroundColor: theme.gold }]}>
            <Text style={styles.aiText}>AI</Text>
          </View>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={{ opacity: subtitleFade, alignItems: 'center', marginTop: 16 }}>
          <Text style={[styles.tagline, { color: theme.text.secondary }]}>
            Your intelligent Quran learning companion
          </Text>
          <Text style={[styles.arabicTagline, { color: theme.gold }]}>
            رفيقك الذكي في تعلم القرآن الكريم
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Bottom dot indicator */}
      <Animated.View style={[styles.bottomDots, { opacity: subtitleFade }]}>
        <View style={[styles.dot, styles.dotActive, { backgroundColor: theme.primary }]} />
        <View style={[styles.dot, { backgroundColor: theme.border }]} />
        <View style={[styles.dot, { backgroundColor: theme.border }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', paddingHorizontal: 40 },
  topDecor: { position: 'absolute', top: -60, right: -60 },
  bottomDecor: { position: 'absolute', bottom: -60, left: -60 },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  bismillahBadge: {
    position: 'absolute',
    bottom: -14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  bismillahText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  appName: { fontSize: 36, fontWeight: '800', letterSpacing: -0.5 },
  aiChip: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 20,
  },
  aiText: { color: '#000', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  tagline: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  arabicTagline: { fontSize: 15, marginTop: 6, textAlign: 'center' },
  bottomDots: { position: 'absolute', bottom: 60, flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { width: 24 },
});
