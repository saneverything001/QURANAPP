import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { IslamicHeader } from '@/components/ui/IslamicHeader';
import { FontSize, Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const { theme } = useApp();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setError('');
    const { error: e } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (e) { setError(e.message); return; }
    router.replace('/(tabs)');
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <IslamicHeader title="Welcome Back" subtitle="Sign in to continue your journey" showBack />

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={[styles.iconBadge, { backgroundColor: theme.primaryLight }]}>
            <Text style={{ fontSize: 40 }}>🕌</Text>
          </View>

          <Text style={[styles.title, { color: theme.text.primary }]}>Sign In</Text>
          <Text style={[styles.arabicGreeting, { color: theme.gold }]}>أهلاً وسهلاً</Text>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: `${theme.error}15`, borderColor: `${theme.error}30` }]}>
              <Text style={{ color: theme.error, fontSize: FontSize.sm }}>{error}</Text>
            </View>
          ) : null}

          <Input
            label="Email Address"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={18} color={theme.text.tertiary} />}
            containerStyle={styles.inputGap}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPw}
            leftIcon={<Lock size={18} color={theme.text.tertiary} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={18} color={theme.text.tertiary} /> : <Eye size={18} color={theme.text.tertiary} />}
              </TouchableOpacity>
            }
            containerStyle={styles.inputGap}
          />

          <TouchableOpacity style={styles.forgot}>
            <Text style={{ color: theme.primary, fontSize: FontSize.sm }}>Forgot password?</Text>
          </TouchableOpacity>

          <Button label="Sign In" onPress={handleLogin} loading={loading} fullWidth size="lg" style={styles.loginBtn} />

          <View style={styles.footer}>
            <Text style={{ color: theme.text.secondary, fontSize: FontSize.sm }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/register')}>
              <Text style={{ color: theme.primary, fontSize: FontSize.sm, fontWeight: '600' }}>Create Account</Text>
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
  arabicGreeting: { fontSize: FontSize.xl, textAlign: 'center', marginBottom: Spacing.xl, marginTop: 4 },
  errorBox: { borderRadius: 10, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1 },
  inputGap: { marginBottom: Spacing.md },
  forgot: { alignItems: 'flex-end', marginTop: -4, marginBottom: Spacing.lg },
  loginBtn: { marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
});
