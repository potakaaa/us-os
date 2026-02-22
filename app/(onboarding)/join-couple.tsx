import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import { LogInIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

export default function JoinCoupleScreen() {
  const router = useRouter();
  const [coupleName, setCoupleName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleJoin = async () => {
    setError('');

    if (!coupleName.trim()) {
      setError('Please enter the couple space name.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter the password.');
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
        router.replace('/sign-in?redirect=join-couple');
        return;
      }

      const { data: coupleId, error: rpcError } = await supabase.rpc(
        'join_couple_by_password',
        {
          p_couple_name: coupleName.trim(),
          p_password: password,
        }
      );

      if (rpcError) {
        setError(rpcError.message ?? 'Failed to join. Please try again.');
        return;
      }

      if (coupleId) {
        router.replace('/home');
      } else {
        setError('Failed to join. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoupleNameChange = (text: string) => {
    setCoupleName(text);
    if (error) setError('');
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (error) setError('');
  };

  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <View className="w-full max-w-sm gap-8">
        <View className="items-center gap-4">
          <View className="bg-primary/10 rounded-full p-6 items-center justify-center">
            <Icon as={LogInIcon} className="text-primary" size={48} />
          </View>
        </View>

        <View className="items-center gap-2">
          <Text variant="h1" className="text-foreground">
            Join Us
          </Text>
          <Text variant="muted" className="text-center">
            Enter the couple space name and password your partner shared with you
          </Text>
        </View>

        <View className="gap-4">
          <Input
            placeholder="Couple space name"
            value={coupleName}
            onChangeText={handleCoupleNameChange}
            autoCapitalize="words"
            onSubmitEditing={() => {}}
            className="w-full"
            editable={!isLoading}
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            onSubmitEditing={handleJoin}
            className="w-full"
            editable={!isLoading}
          />

          {error ? (
            <Text className="text-destructive text-sm text-center">{error}</Text>
          ) : null}
        </View>

        <View className="gap-3">
          <Button
            onPress={handleJoin}
            disabled={!coupleName.trim() || !password.trim() || isLoading}
            className="w-full"
            size="lg"
          >
            <Text>Join Couple Space</Text>
          </Button>
          <Button
            variant="ghost"
            onPress={() => router.back()}
            className="w-full"
          >
            <Text className="text-muted-foreground">Back</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
