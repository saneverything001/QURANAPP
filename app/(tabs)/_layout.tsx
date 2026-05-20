import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { Home, BookOpen, Mic, BarChart3, Settings } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { FontSize } from '@/constants/theme';

function TabIcon({ Icon, color, focused }: { Icon: any; color: string; focused: boolean }) {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 2,
    }}>
      <Icon size={22} color={color} strokeWidth={focused ? 2.5 : 1.8} />
    </View>
  );
}

export default function TabLayout() {
  const { theme } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text.tertiary,
        tabBarLabelStyle: { fontSize: FontSize.xs, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={Home} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: 'Quran',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={BookOpen} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="recite"
        options={{
          title: 'Recite',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: theme.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: Platform.OS === 'ios' ? 16 : 8,
              shadowColor: theme.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 6,
            }}>
              <Mic size={22} color="#fff" strokeWidth={2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={BarChart3} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={Settings} color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
