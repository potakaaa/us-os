import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { supabase } from '@/utils/supabase';
import bcrypt from 'bcryptjs';
import { Stack, useRouter } from 'expo-router';
import { LockIcon } from 'lucide-react-native';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

type CoupleState = 'loading' | 'has_couple_with_lock' | 'has_couple_no_lock' | 'no_couple';

export default function LockScreen() {
  const router = useRouter();
  const [authState, setAuthState] = React.useState<
    'loading' | 'authenticated' | 'unauthenticated'
  >('loading');
  const [coupleState, setCoupleState] = React.useState<CoupleState>('loading');
  const [coupleId, setCoupleId] = React.useState<string | null>(null);
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(session ? 'authenticated' : 'unauthenticated');
    });
  }, []);

  React.useEffect(() => {
    if (authState === 'unauthenticated') {
      router.replace('/sign-in');
      return;
    }
    if (authState !== 'authenticated') return;

    const checkCouple = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setCoupleState('no_couple');
        return;
      }

      const { data: memberships } = await supabase
        .from('couple_members')
        .select('couple_id')
        .eq('user_id', user.id);

      if (!memberships?.length) {
        setCoupleState('no_couple');
        return;
      }

      const cid = memberships[0].couple_id;
      const { data: lock } = await supabase
        .from('couple_lock')
        .select('key_hash')
        .eq('couple_id', cid)
        .maybeSingle();

      if (lock?.key_hash) {
        setCoupleId(cid);
        setCoupleState('has_couple_with_lock');
      } else {
        setCoupleState('has_couple_no_lock');
      }
    };

    checkCouple();
  }, [authState]);

  React.useEffect(() => {
    if (coupleState === 'no_couple') {
      router.replace('/create-couple');
    } else if (coupleState === 'has_couple_no_lock') {
      router.replace('/home');
    }
  }, [coupleState, router]);

  const validatePassword = async (): Promise<boolean> => {
    if (!password.trim()) return false;
    if (!coupleId) {
      setError('Unable to verify. Please try again.');
      return false;
    }
    const { data: lock } = await supabase
      .from('couple_lock')
      .select('key_hash')
      .eq('couple_id', coupleId)
      .maybeSingle();
    if (!lock?.key_hash) return true;
    return new Promise<boolean>((resolve) => {
      bcrypt.compare(password, lock.key_hash, (err, same) => {
        if (err) {
          setError('Unable to verify password.');
          resolve(false);
        } else {
          if (!same) setError('Incorrect password.');
          resolve(same ?? false);
        }
      });
    });
  };

  const handleUnlock = async () => {
    setError('');

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      const isValid = await validatePassword();

      if (isValid) {
        // Navigate to home screen after successful unlock
        router.replace('/home');
      } else {
        // Error is already set by validatePassword
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const isChecking =
    authState === 'loading' ||
    authState === 'unauthenticated' ||
    coupleState === 'loading' ||
    coupleState === 'no_couple' ||
    coupleState === 'has_couple_no_lock';

  if (isChecking) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Lock Screen',
          headerShown: false,
        }}
      />
      <View className="flex-1 items-center justify-center bg-background p-6">
        <View className="w-full max-w-sm gap-8">
          {/* Icon Area */}
          <View className="items-center gap-4">
            <View className="items-center justify-center rounded-full bg-primary/10 p-6">
              <Icon as={LockIcon} className="text-primary" size={48} />
            </View>
          </View>

          {/* Title and Subtitle */}
          <View className="items-center gap-2">
            <Text variant="h1" className="text-foreground">
              Together
            </Text>
            <Text variant="muted" className="text-center">
              Enter your password to continue
            </Text>
          </View>

          {/* Password Input */}
          <View className="gap-2">
            <Input
              placeholder="Enter password"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
              autoFocus
              onSubmitEditing={handleUnlock}
              className="w-full"
              editable={!isLoading}
            />

            {error ? (
              <Text className="text-center text-sm text-destructive">{error}</Text>
            ) : null}
          </View>

          <Button
            onPress={handleUnlock}
            disabled={!password.trim() || isLoading}
            className="w-full"
            size="lg">
            <Text>Unlock</Text>
          </Button>
        </View>
      </View>
    </>
  );
}
