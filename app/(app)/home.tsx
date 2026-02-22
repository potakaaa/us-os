import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { NativeOnlyAnimatedView } from '@/components/ui/native-only-animated-view';
import { Text } from '@/components/ui/text';
import { supabase } from '@/utils/supabase';
import { type Href, Link } from 'expo-router';
import {
  ChevronRightIcon,
  Images,
  MailIcon,
  SettingsIcon,
  SparklesIcon,
  StickyNoteIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MOCK_PHOTOS = [
  { id: '1', placeholder: true },
  { id: '2', placeholder: true },
  { id: '3', placeholder: true },
  { id: '4', placeholder: true },
];

const MOCK_NOTES = [
  { id: '1', body: 'Pick up flowers for dinner', color: 'accent' },
  { id: '2', body: 'Anniversary next week!', color: 'primary' },
  { id: '3', body: 'Movie night Friday', color: 'secondary' },
];

const MOCK_ALBUMS = [
  { id: '1', name: 'Summer 2024' },
  { id: '2', name: 'Weekend trip' },
];

const NOTE_STYLES: Record<string, string> = {
  accent:
    'bg-primary/5 border-l-4 border-l-primary/60 dark:bg-primary/10 dark:border-l-primary/80',
  primary:
    'bg-primary/10 border-l-4 border-l-primary dark:bg-primary/15 dark:border-l-primary',
  secondary:
    'bg-secondary/50 border-l-4 border-l-secondary-foreground/40 dark:bg-secondary/30',
};

function SectionHeader({ title, href }: { title: string; href: Href }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text variant="h4" className="text-foreground">
        {title}
      </Text>
      <Link href={href} asChild>
        <Button variant="ghost" size="sm" className="gap-1 -mr-2">
          <Text variant="small" className="text-muted-foreground">
            View all
          </Text>
          <Icon as={ChevronRightIcon} size={16} className="text-muted-foreground" />
        </Button>
      </Link>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = React.useState<string | null>(null);
  const [coupleName, setCoupleName] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadUserAndCouple = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name.split(' ')[0]);
      } else if (user?.email) {
        setUserName(user.email.split('@')[0]);
      } else {
        setUserName(null);
      }

      if (!user) return;

      const { data: membership } = await supabase
        .from('couple_members')
        .select('couple_id, couples(name)')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      const couple = membership?.couples as { name: string | null } | undefined;
      setCoupleName(couple?.name ?? null);
    };
    loadUserAndCouple();
  }, []);

  const greeting = userName ? `Hi, ${userName}` : 'Our Space';
  const subtitle = coupleName ?? 'Your shared space';

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 32,
        paddingHorizontal: 24,
      }}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <NativeOnlyAnimatedView entering={FadeIn.duration(400)}>
        <View className="mb-10">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <View className="mb-2 flex-row items-center gap-2">
                <View className="rounded-full bg-primary/10 p-1.5 dark:bg-primary/20">
                  <Icon as={SparklesIcon} size={12} className="text-primary" />
                </View>
                <Text
                  variant="muted"
                  className="text-xs font-medium uppercase tracking-[0.2em]">
                  Welcome back
                </Text>
              </View>
              <Text variant="h3" className="text-foreground" style={{ letterSpacing: -0.5 }}>
                {greeting}
              </Text>
              <Text variant="muted" className="mt-2 text-base">
                {subtitle}
              </Text>
            </View>
            <Link href="/settings" asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-full border border-border/80 bg-card/80 dark:border-border dark:bg-card/50">
                <Icon as={SettingsIcon} size={20} />
              </Button>
            </Link>
          </View>
        </View>
      </NativeOnlyAnimatedView>

      {/* Recent Photos */}
      <NativeOnlyAnimatedView entering={FadeInDown.duration(450).delay(60)}>
        <View className="mb-10 gap-4">
          <SectionHeader title="Recent Photos" href="/photos" />
          <View className="flex-row flex-wrap gap-3">
            {MOCK_PHOTOS.map((photo) => (
              <View
                key={photo.id}
                className="h-24 w-[47%] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/50 dark:border-border/40 dark:bg-muted/30"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 2,
                }}>
                <Icon as={Images} size={32} className="text-muted-foreground/70" />
              </View>
            ))}
          </View>
        </View>
      </NativeOnlyAnimatedView>

      {/* Sticky Notes */}
      <NativeOnlyAnimatedView entering={FadeInDown.duration(450).delay(120)}>
        <View className="mb-10 gap-4">
          <SectionHeader title="Sticky Notes" href="/notes" />
          <View className="gap-3">
            {MOCK_NOTES.map((note) => (
              <Card
                key={note.id}
                className={`overflow-hidden rounded-2xl border-0 px-4 py-4 shadow-sm ${NOTE_STYLES[note.color] ?? NOTE_STYLES.accent}`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.03,
                  shadowRadius: 6,
                  elevation: 1,
                }}>
                <View className="flex-row items-center gap-4">
                  <View className="rounded-xl bg-background/60 p-2.5 dark:bg-background/30">
                    <Icon as={StickyNoteIcon} size={18} className="text-foreground/80" />
                  </View>
                  <Text
                    className="flex-1 text-card-foreground"
                    numberOfLines={2}
                    style={{ lineHeight: 22, fontSize: 15 }}>
                    {note.body}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </View>
      </NativeOnlyAnimatedView>

      {/* Albums */}
      <NativeOnlyAnimatedView entering={FadeInDown.duration(450).delay(180)}>
        <View className="mb-10 gap-4">
          <SectionHeader title="Albums" href="/photos" />
          <Card
            className="overflow-hidden rounded-2xl border border-border/60 shadow-sm dark:border-border/40"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}>
            <CardContent className="py-3">
              {MOCK_ALBUMS.length > 0 ? (
                <View className="gap-1">
                  {MOCK_ALBUMS.map((album) => (
                    <View
                      key={album.id}
                      className="flex-row items-center justify-between rounded-xl px-4 py-3.5">
                      <Text className="font-medium text-card-foreground">{album.name}</Text>
                      <Icon as={ChevronRightIcon} size={18} className="text-muted-foreground" />
                    </View>
                  ))}
                </View>
              ) : (
                <View className="items-center gap-4 py-10">
                  <View className="rounded-2xl bg-muted/50 p-5 dark:bg-muted/30">
                    <Icon as={Images} size={36} className="text-muted-foreground" />
                  </View>
                  <Text variant="muted" className="text-center">
                    No albums yet. Add photos to create your first album.
                  </Text>
                </View>
              )}
            </CardContent>
          </Card>
        </View>
      </NativeOnlyAnimatedView>

      {/* Letters / Inbox */}
      <NativeOnlyAnimatedView entering={FadeInDown.duration(450).delay(240)}>
        <View className="gap-4">
          <SectionHeader title="Letters" href="/letters" />
          <Card
            className="overflow-hidden rounded-3xl border-0 bg-primary/5 shadow-md dark:bg-primary/10"
            style={{
              shadowColor: 'hsl(346.8, 77.2%, 49.8%)',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 4,
            }}>
            <CardHeader className="items-center pb-2 pt-6">
              <View className="mb-3 rounded-2xl bg-primary/15 p-4 dark:bg-primary/20">
                <Icon as={MailIcon} size={28} className="text-primary" />
              </View>
              <CardTitle>
                <Text className="text-lg font-semibold text-foreground">Inbox</Text>
              </CardTitle>
              <CardDescription className="mt-1">
                Letters from your partner
              </CardDescription>
            </CardHeader>
            <CardContent className="items-center gap-4 pb-8 pt-2">
              <Text variant="muted" className="text-center">
                No letters yet. Write your first letter to your partner.
              </Text>
              <Link href="/letters" asChild>
                <Button size="lg" className="rounded-xl px-6">
                  <Icon as={MailIcon} size={18} className="text-primary-foreground" />
                  <Text>Write a letter</Text>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </View>
      </NativeOnlyAnimatedView>
    </ScrollView>
  );
}
