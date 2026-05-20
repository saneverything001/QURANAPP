import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider, useApp } from '@/context/AppContext';

function RootStack() {
  const { isDark } = useApp();
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="selectVerse" options={{ presentation: 'modal' }} />
        <Stack.Screen name="recitation" options={{ presentation: 'modal' }} />
        <Stack.Screen name="correction" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  return (
    <AppProvider>
      <RootStack />
    </AppProvider>
  );
}
