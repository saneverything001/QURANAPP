import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { IslamicHeader } from '@/components/ui/IslamicHeader';
import { FontSize, Spacing } from '@/constants/theme';

export default function RegisterScreen() {
  const { theme } = useApp();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    if (!name || !email || !password) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    setError('');
    const { error: e } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: name.trim() } },
    });
    setLoading(false);
    if (e) { setError(e.message); return; }
    router.replace('/(tabs)');
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <IslamicHeader title="Create Account" subtitle="Begin your Quran journey today" showBack />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={[styles.iconBadge, { backgroundColor: theme.primaryLight }]}>
            <Text style={{ fontSize: 40 }}>✨</Text>
          </View>
          <Text style={[styles.title, { color: theme.text.primary }]}>Join Us</Text>
          <Text style={[styles.arabicText, { color: theme.gold }]}>بارك الله فيك</Text>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: `${theme.error}15`, borderColor: `${theme.error}30` }]}>
              <Text style={{ color: theme.error, fontSize: FontSize.sm }}>{error}</Text>
            </View>
          ) : null}

          <Input label="Full Name" placeholder="Your name" value={name} onChangeText={setName}
            leftIcon={<User size={18} color={theme.text.tertiary} />} containerStyle={styles.gap} />
          <Input label="Email Address" placeholder="your@email.com" value={email} onChangeText={setEmail}
            keyboardType="email-address" autoCapitalize="none"
            leftIcon={<Mail size={18} color={theme.text.tertiary} />} containerStyle={styles.gap} />
          <Input label="Password" placeholder="Create a password" value={password} onChangeText={setPassword}
            secureTextEntry={!showPw}
            leftIcon={<Lock size={18} color={theme.text.tertiary} />}
            rightIcon={<TouchableOpacity onPress={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={18} color={theme.text.tertiary} /> : <Eye size={18} color={theme.text.tertiary} />}</TouchableOpacity>}
            containerStyle={styles.gap} />
          <Input label="Confirm Password" placeholder="Repeat password" value={confirm} onChangeText={setConfirm}
            secureTextEntry={!showPw}
            leftIcon={<Lock size={18} color={theme.text.tertiary} />} containerStyle={styles.gap} />

          <Button label="Create Account" onPress={handleRegister} loading={loading} fullWidth size="lg" style={styles.btn} />

          <View style={styles.footer}>
            <Text style={{ color: theme.text.secondary, fontSize: FontSize.sm }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={{ color: theme.primary, fontSize: FontSize.sm, fontWeight: '600' }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.xl, paddingTop: Spacing.lg },
  iconBadge: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md, alignSelf: 'center' },
  title: { fontSize: FontSize.xxxl, fontWeight: '800', textAlign: 'center' },
  arabicText: { fontSize: FontSize.xl, textAlign: 'center', marginBottom: Spacing.xl, marginTop: 4 },
  errorBox: { borderRadius: 10, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1 },
  gap: { marginBottom: Spacing.md },
  btn: { marginTop: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
});
