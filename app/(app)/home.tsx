import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { supabase } from '@/utils/supabase';
import { type Href, Link } from 'expo-router';
import {
  ChevronRightIcon,
  Images,
  MailIcon,
  SettingsIcon,
  StickyNoteIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
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

const NOTE_COLORS: Record<string, string> = {
  accent: 'bg-accent/80 border-l-4 border-l-accent-foreground/30',
  primary: 'bg-primary/15 border-l-4 border-l-primary',
  secondary: 'bg-secondary border-l-4 border-l-secondary-foreground/30',
};

function SectionHeader({ title, href }: { title: string; href: Href }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text variant="h4" className="text-foreground">
        {title}
      </Text>
      <Link href={href} asChild>
        <Button variant="ghost" size="sm" className="gap-1">
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
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 120,
        paddingHorizontal: 20,
      }}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="mb-8">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text variant="muted" className="mb-1 text-xs font-medium uppercase tracking-wider">
              Welcome back
            </Text>
            <Text variant="h3" className="text-foreground">
              {greeting}
            </Text>
            <Text variant="muted" className="mt-1.5">
              {subtitle}
            </Text>
          </View>
          <Link href="/settings" asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border border-border bg-card">
              <Icon as={SettingsIcon} size={22} />
            </Button>
          </Link>
        </View>
      </View>

      {/* Recent Photos */}
      <View className="mb-8 gap-4">
        <SectionHeader title="Recent Photos" href="/photos" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingRight: 4 }}
          className="-mx-1">
          {MOCK_PHOTOS.map((photo) => (
            <View
              key={photo.id}
              className="h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
              <Icon as={Images} size={36} className="text-muted-foreground" />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Sticky Notes */}
      <View className="mb-8 gap-4">
        <SectionHeader title="Sticky Notes" href="/notes" />
        <View className="gap-3">
          {MOCK_NOTES.map((note) => (
            <Card
              key={note.id}
              className={`overflow-hidden rounded-xl border-0 shadow-sm ${NOTE_COLORS[note.color] ?? NOTE_COLORS.accent}`}>
              <CardContent className="py-4">
                <View className="flex-row items-center gap-3">
                  <View className="rounded-lg bg-background/50 p-2">
                    <Icon as={StickyNoteIcon} size={18} className="text-foreground" />
                  </View>
                  <Text
                    className="flex-1 text-card-foreground"
                    numberOfLines={2}
                    style={{ lineHeight: 22 }}>
                    {note.body}
                  </Text>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>

      {/* Albums */}
      <View className="mb-8 gap-4">
        <SectionHeader title="Albums" href="/photos" />
        <Card className="overflow-hidden rounded-2xl border border-border shadow-sm">
          <CardContent className="py-4">
            {MOCK_ALBUMS.length > 0 ? (
              <View className="gap-2">
                {MOCK_ALBUMS.map((album) => (
                  <View
                    key={album.id}
                    className="flex-row items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                    <Text className="font-medium text-card-foreground">{album.name}</Text>
                    <Icon as={ChevronRightIcon} size={18} className="text-muted-foreground" />
                  </View>
                ))}
              </View>
            ) : (
              <View className="items-center gap-3 py-8">
                <View className="rounded-2xl bg-muted p-4">
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

      {/* Letters / Inbox */}
      <View className="gap-4">
        <SectionHeader title="Letters" href="/letters" />
        <Card className="overflow-hidden rounded-2xl border border-border shadow-sm">
          <CardHeader className="flex justify-center pb-2">
            <CardTitle className="">
              <View className="flex-row items-center justify-center gap-3">
                <View className="flex justify-center rounded-full bg-primary/10 p-2">
                  <Icon as={MailIcon} size={20} className="text-primary" />
                </View>
                <Text className="font-semibold">Inbox</Text>
              </View>
            </CardTitle>
            <CardDescription>Letters from your partner</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="items-center gap-4 rounded-xl bg-muted/30 py-10">
              <View className="rounded-2xl bg-muted p-4">
                <View className="flex justify-center">
                  <Icon as={MailIcon} size={40} className="text-muted-foreground" />
                </View>
              </View>
              <View className="items-center gap-1">
                <Text variant="muted" className="text-center">
                  No letters yet. Write your first letter to your partner.
                </Text>
                <Link href="/letters" asChild>
                  <Button size="sm" className="mt-2">
                    <Text>Write a letter</Text>
                  </Button>
                </Link>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
