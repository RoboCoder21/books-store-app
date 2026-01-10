import FontAwesome from '@expo/vector-icons/FontAwesome';
import Constants from 'expo-constants';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isAdmin =
    process.env.EXPO_PUBLIC_ADMIN_MODE === 'true' ||
    ((Constants?.expoConfig?.extra as Record<string, any> | undefined)?.EXPO_PUBLIC_ADMIN_MODE === 'true');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerTitle: 'Discover',
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: 'Books',
          tabBarIcon: ({ color }) => <TabBarIcon name="th-large" color={color} />,
          headerTitle: 'Browse categories',
        }}
      />
      <Tabs.Screen
        name="audio"
        options={{
          title: 'Audio',
          tabBarIcon: ({ color }) => <TabBarIcon name="headphones" color={color} />,
          headerTitle: 'Audio books',
        }}
      />
      <Tabs.Screen
        name="two"
        href={isAdmin ? undefined : null}
        options={{
          title: 'Add Book',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus-square" color={color} />,
          headerTitle: 'Add your book',
          tabBarButton: isAdmin ? undefined : () => null,
        }}
      />
      <Tabs.Screen
        name="downloads"
        options={{
          title: 'Downloads',
          tabBarIcon: ({ color }) => <TabBarIcon name="download" color={color} />,
          headerTitle: 'Your library',
        }}
      />
    </Tabs>
  );
}
