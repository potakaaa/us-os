import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ImageIcon,
  LockIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
  UserPlusIcon,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ThemeOption = 'light' | 'dark' | 'system';

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme, setColorScheme } = useColorScheme();

  const [coupleId, setCoupleId] = React.useState<string | null>(null);
  const [coupleName, setCoupleName] = React.useState<string | null>(null);
  const [memberCount, setMemberCount] = React.useState(0);
  const [currentUserAvatar, setCurrentUserAvatar] = React.useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = React.useState<string | null>(null);
  React.useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setCurrentUserAvatar((user.user_metadata?.avatar_url as string) ?? null);
      const fullName = (user.user_metadata?.full_name as string) ?? null;
      const emailName = user.email ? user.email.split('@')[0] : null;
      setCurrentUserName(fullName ?? emailName ?? null);

      const { data: membership } = await supabase
        .from('couple_members')
        .select('couple_id, couples(name)')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      const couple = membership?.couples as { name: string | null } | undefined;
      const cid = membership?.couple_id ?? null;
      setCoupleId(cid);
      setCoupleName(couple?.name ?? null);

      if (!cid) return;

      const { data: members } = await supabase
        .from('couple_members')
        .select('user_id')
        .eq('couple_id', cid);
      setMemberCount(members?.length ?? 0);
    };
    loadData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/sign-in');
  };

  const themeLabel: Record<ThemeOption, string> = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  };
  const effectiveTheme: ThemeOption =
    colorScheme === 'light' || colorScheme === 'dark' ? colorScheme : 'system';

  const cycleTheme = () => {
    const next: ThemeOption =
      effectiveTheme === 'light' ? 'dark' : effectiveTheme === 'dark' ? 'system' : 'light';
    setColorScheme(next);
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-muted/20 dark:bg-background"
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-8 flex-row items-center gap-4">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <Icon as={ChevronLeftIcon} size={24} />
          </Button>
          <View className="flex-1">
            <Text
              variant="muted"
              className="mb-0.5 text-xs font-medium uppercase tracking-wider dark:text-foreground/70">
              Preferences
            </Text>
            <Text variant="h3" className="text-foreground">
              Settings
            </Text>
          </View>
        </View>

        {/* Profile / Couple Section */}
        <Card className="mb-8 overflow-hidden rounded-2xl border border-border py-0 shadow-sm">
          <View className="bg-primary/5 px-4 pb-6 pt-6 dark:bg-primary/10">
            <View className="items-center gap-4">
              <View className="flex-row items-center justify-center">
                <Avatar
                  alt={currentUserName ?? 'Profile'}
                  className="size-20 border-4 border-card shadow-md">
                  <AvatarImage source={{ uri: currentUserAvatar ?? undefined }} />
                  <AvatarFallback>
                    <Text className="text-xl font-medium text-muted-foreground">
                      {getInitials(currentUserName)}
                    </Text>
                  </AvatarFallback>
                </Avatar>
                {memberCount >= 2 ? (
                  <Avatar alt="Partner" className="-ml-4 size-20 border-4 border-card shadow-md">
                    <AvatarFallback>
                      <Text className="text-xl font-medium text-muted-foreground">?</Text>
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar alt="Partner" className="-ml-4 size-20 border-4 border-card shadow-md">
                    <AvatarFallback>
                      <Icon as={UserPlusIcon} size={28} className="text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </View>
              <View className="items-center gap-1">
                <Text variant="h4" className="text-foreground">
                  {coupleName ?? 'Our Space'}
                </Text>
                <Text variant="muted" className="text-sm">
                  Your shared space
                </Text>
              </View>
              {memberCount < 2 && (
                <Text variant="muted" className="text-center text-sm">
                  Share your couple space name and password with your partner so they can join.
                </Text>
              )}
            </View>
          </View>
        </Card>

        {/* Our Space */}
        <View className="mb-8 gap-4">
          <View>
            <Text
              variant="muted"
              className="mb-1 text-xs font-medium uppercase tracking-wider dark:text-foreground/70">
              Shared
            </Text>
            <Text variant="h4" className="text-foreground">
              Our Space
            </Text>
          </View>
          <Card className="overflow-hidden rounded-2xl border border-border py-0 shadow-sm">
            <CardContent className="gap-2 px-4 py-5">
              <View className="flex-row items-center justify-between rounded-xl bg-muted/50 p-3 dark:bg-muted">
                <Text className="min-w-3 flex-1 font-medium text-foreground">Couple name</Text>
                <Text variant="muted" className="shrink-0 pl-2">
                  {coupleName ?? '—'}
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Appearance */}
        <View className="mb-8 gap-4">
          <View>
            <Text
              variant="muted"
              className="mb-1 text-xs font-medium uppercase tracking-wider dark:text-foreground/70">
              Look & feel
            </Text>
            <Text variant="h4" className="text-foreground">
              Appearance
            </Text>
          </View>
          <Card className="overflow-hidden rounded-2xl border border-border py-0 shadow-sm">
            <CardContent className="gap-2 px-4 py-5">
              <Button
                variant="ghost"
                className="min-h-11 min-w-0 shrink flex-row items-center justify-between rounded-xl bg-muted/50 dark:bg-muted"
                onPress={cycleTheme}>
                <View className="min-w-0 flex-1 flex-row items-center gap-3">
                  <View className="rounded-lg bg-primary/20 p-2 dark:bg-primary/30">
                    <Icon
                      as={effectiveTheme === 'dark' ? MoonIcon : SunIcon}
                      size={20}
                      className="shrink-0 text-primary"
                    />
                  </View>
                  <Text className="min-w-0 flex-1 font-medium text-foreground" numberOfLines={1}>
                    Theme
                  </Text>
                </View>
                <View className="shrink-0 flex-row items-center gap-2 pl-2">
                  <Text variant="muted" className="text-muted-foreground" numberOfLines={1}>
                    {themeLabel[effectiveTheme]}
                  </Text>
                  <Icon as={ChevronRightIcon} size={18} className="text-muted-foreground" />
                </View>
              </Button>
              <Button
                variant="ghost"
                className="min-h-11 min-w-0 shrink flex-row items-center justify-between rounded-xl bg-muted/50 dark:bg-muted"
                onPress={() => {}}>
                <View className="min-w-0 flex-1 flex-row items-center gap-3">
                  <View className="rounded-lg bg-primary/20 p-2 dark:bg-primary/30">
                    <Icon as={ImageIcon} size={20} className="shrink-0 text-primary" />
                  </View>
                  <Text className="min-w-0 flex-1 font-medium text-foreground" numberOfLines={1}>
                    Wallpaper
                  </Text>
                </View>
                <View className="shrink-0 flex-row items-center gap-2 pl-2">
                  <Text variant="muted" className="text-muted-foreground" numberOfLines={1}>
                    Pick from photos
                  </Text>
                  <Icon as={ChevronRightIcon} size={18} className="text-muted-foreground" />
                </View>
              </Button>
            </CardContent>
          </Card>
        </View>

        {/* Privacy */}
        <View className="mb-8 gap-4">
          <View>
            <Text
              variant="muted"
              className="mb-1 text-xs font-medium uppercase tracking-wider dark:text-foreground/70">
              Security
            </Text>
            <Text variant="h4" className="text-foreground">
              Privacy
            </Text>
          </View>
          <Card className="overflow-hidden rounded-2xl border border-border py-0 shadow-sm">
            <CardContent className="gap-2 px-4 py-5">
              <Button
                variant="ghost"
                className="min-h-11 min-w-0 shrink flex-row items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5 dark:bg-muted"
                onPress={() => {}}>
                <View className="min-w-0 flex-1 flex-row items-center gap-3">
                  <View className="rounded-lg bg-primary/20 p-2 dark:bg-primary/30">
                    <Icon as={LockIcon} size={20} className="shrink-0 text-primary" />
                  </View>
                  <Text className="min-w-0 flex-1 font-medium text-foreground" numberOfLines={1}>
                    App lock
                  </Text>
                </View>
                <Icon as={ChevronRightIcon} size={18} className="shrink-0 text-muted-foreground" />
              </Button>
            </CardContent>
          </Card>
        </View>

        {/* Account */}
        <View className="mb-8 gap-4">
          <View>
            <Text
              variant="muted"
              className="mb-1 text-xs font-medium uppercase tracking-wider dark:text-foreground/70">
              Session
            </Text>
            <Text variant="h4" className="text-foreground">
              Account
            </Text>
          </View>
          <Card className="overflow-hidden rounded-2xl border border-border py-0 shadow-sm">
            <CardContent className="gap-2 px-4 py-5">
              <Button
                variant="ghost"
                className="min-h-11 min-w-0 shrink flex-row items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5 dark:bg-muted"
                onPress={handleLogout}>
                <View className="min-w-0 flex-1 flex-row items-center gap-3">
                  <View className="rounded-lg bg-red-500/20 p-2 dark:bg-red-500/30">
                    <Icon as={LogOutIcon} size={20} className="text-red-500" />
                  </View>
                  <Text className="min-w-0 flex-1 font-medium text-red-500" numberOfLines={1}>
                    Log out
                  </Text>
                </View>
                <Icon as={ChevronRightIcon} size={18} className="shrink-0 text-red-500" />
              </Button>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}
