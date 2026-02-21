import { Icon } from '@/components/ui/icon';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import { Tabs } from 'expo-router';
import {
  HomeIcon,
  Images,
  MailIcon,
  PlusIcon,
  StickyNoteIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIMARY = 'hsl(346.8, 77.2%, 49.8%)';
const PRIMARY_FOREGROUND = 'hsl(355.7, 100%, 97.3%)';

type TabBarButtonProps = {
  children: React.ReactNode;
  accessibilityState?: { selected?: boolean };
} & Record<string, unknown>;

function TabBarButtonWithPill({ children, accessibilityState, ...props }: TabBarButtonProps) {
  const focused = accessibilityState?.selected ?? false;
  return (
    <Pressable {...(props as React.ComponentProps<typeof Pressable>)} className="flex-1 items-center justify-center py-2">
      <View
        className={`items-center justify-center rounded-2xl px-2 py-2 ${focused ? 'bg-primary/10' : ''}`}
        style={focused ? styles.activePill : undefined}>
        {children}
      </View>
    </Pressable>
  );
}

function AddTabButton({ children, ...props }: TabBarButtonProps) {
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      {...(props as React.ComponentProps<typeof Pressable>)}
      className="flex-1 items-center justify-center"
      style={{ marginBottom: insets.bottom > 0 ? 0 : 8 }}>
      <View style={styles.fab} className="h-14 w-14 items-center justify-center rounded-full bg-primary">
        {children}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  activePill: {
    minWidth: 56,
  },
  fab: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

export default function AppLayout() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const tabBarStyle = {
    backgroundColor: theme.card,
    borderTopColor: theme.border,
    borderTopWidth: 1,
    paddingTop: 12,
    paddingBottom: Math.max(insets.bottom, 12),
    height: 60 + Math.max(insets.bottom, 12),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 16,
      },
    }),
  };

  const tabBarButton = (props: TabBarButtonProps) => (
    <TabBarButtonWithPill {...props} />
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: theme.mutedForeground,
        tabBarStyle,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarLabel: ({ color, children }) => (
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            numberOfLines={1}
            style={{ color, fontSize: 11, fontWeight: '500', textAlign: 'center' }}>
            {children}
          </Text>
        ),
        tabBarPosition: 'bottom',
        tabBarLabelPosition: 'below-icon',
        tabBarItemStyle: { gap: 4 },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarButton,
          tabBarIcon: ({ color, size }) => (
            <Icon as={HomeIcon} size={size} color={color} className="text-foreground" />
          ),
        }}
      />
      <Tabs.Screen
        name="photos"
        options={{
          title: 'Photos',
          tabBarButton,
          tabBarIcon: ({ color, size }) => (
            <Icon as={Images} size={size} color={color} className="text-foreground" />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarShowLabel: false,
          tabBarIcon: ({ size }) => (
            <Icon
              as={PlusIcon}
              size={size + 4}
              color={PRIMARY_FOREGROUND}
              className="text-primary-foreground"
            />
          ),
          tabBarButton: (props: TabBarButtonProps) => (
            <AddTabButton {...props}>
              <Icon
                as={PlusIcon}
                size={28}
                color={PRIMARY_FOREGROUND}
                className="text-primary-foreground"
              />
            </AddTabButton>
          ),
        }}
      />
      <Tabs.Screen
        name="letters"
        options={{
          title: 'Letters',
          tabBarButton,
          tabBarIcon: ({ color, size }) => (
            <Icon as={MailIcon} size={size} color={color} className="text-foreground" />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarButton,
          tabBarIcon: ({ color, size }) => (
            <Icon as={StickyNoteIcon} size={size} color={color} className="text-foreground" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
