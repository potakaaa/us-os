import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import { HeartIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

export default function CreateCoupleScreen() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCreateCouple = async () => {
    setError('');

    if (!name.trim()) {
      setError('Please enter a name for your couple space.');
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        setIsLoading(false);
        router.replace('/sign-in?redirect=create-couple');
        return;
      }

      const { data: coupleId, error: rpcError } = await supabase.rpc('create_couple', {
        couple_name: name.trim(),
      });

      if (rpcError) {
        setError(rpcError.message ?? 'Failed to create couple space.');
        return;
      }

      if (!coupleId) {
        setError('Failed to create couple space. Please try again.');
        return;
      }

      router.replace(
        `/create-couple-password?coupleId=${encodeURIComponent(coupleId)}`
      );
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
    if (error) setError('');
  };

  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <View className="w-full max-w-sm gap-8">
        {/* Icon Area */}
        <View className="items-center gap-4">
          <View className="bg-primary/10 rounded-full p-6 items-center justify-center">
            <Icon as={HeartIcon} className="text-primary" size={48} />
          </View>
        </View>

        {/* Title and Subtitle */}
        <View className="items-center gap-2">
          <Text variant="h1" className="text-foreground">
            Create Us
          </Text>
          <Text variant="muted" className="text-center">
            Give your couple space a name
          </Text>
        </View>

        {/* Name Input */}
        <View className="gap-2">
          <Input
            placeholder="Our Space"
            value={name}
            onChangeText={handleNameChange}
            autoCapitalize="words"
            onSubmitEditing={handleCreateCouple}
            className="w-full"
            editable={!isLoading}
          />

          {error ? (
            <Text className="text-destructive text-sm text-center">{error}</Text>
          ) : null}
        </View>

        {/* Create Button */}
        <Button
          onPress={handleCreateCouple}
          disabled={!name.trim() || isLoading}
          className="w-full"
          size="lg"
        >
          <Text>Create Couple Space</Text>
        </Button>
        <Button
          variant="ghost"
          onPress={() => router.push('/join-couple')}
          className="w-full"
        >
          <Text className="text-muted-foreground">Join existing couple</Text>
        </Button>
      </View>
    </View>
  );
}
