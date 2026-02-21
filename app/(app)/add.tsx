import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { PlusIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-center gap-4 bg-background p-6"
      style={{ paddingTop: insets.top + 24 }}>
      <View className="items-center justify-center rounded-full bg-primary/10 p-6">
        <Icon as={PlusIcon} size={48} className="text-primary" />
      </View>
      <Text variant="h3" className="text-center text-foreground">
        Add Image
      </Text>
      <Text variant="muted" className="text-center">
        Camera and photo picker will be available here.
      </Text>
    </View>
  );
}
