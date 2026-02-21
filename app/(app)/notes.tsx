import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { StickyNoteIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-center gap-4 bg-background p-6"
      style={{ paddingTop: insets.top + 24 }}>
      <View className="items-center justify-center rounded-full bg-muted p-6">
        <Icon as={StickyNoteIcon} size={48} className="text-muted-foreground" />
      </View>
      <Text variant="h3" className="text-center text-foreground">
        Sticky Notes
      </Text>
      <Text variant="muted" className="text-center">
        Your notes and reminders will appear here.
      </Text>
    </View>
  );
}
