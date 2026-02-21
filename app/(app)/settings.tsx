import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import { ChevronLeftIcon, SettingsIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/sign-in');
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top + 16, paddingHorizontal: 16 }}>
      <View className="mb-6 flex-row items-center gap-4">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <Icon as={ChevronLeftIcon} size={24} />
        </Button>
        <Text variant="h3" className="text-foreground">
          Settings
        </Text>
      </View>
      <View className="items-center justify-center gap-4 py-16">
        <View className="items-center justify-center rounded-full bg-muted p-6">
          <Icon as={SettingsIcon} size={48} className="text-muted-foreground" />
        </View>
        <Text variant="muted" className="text-center">
          Settings options will be available here.
        </Text>
        <Button variant="outline" onPress={handleLogout}>
          <Text>Log out</Text>
        </Button>
      </View>
    </View>
  );
}
