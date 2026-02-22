import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import {
  getRuleLabel,
  type PasswordRule,
  validatePassword,
} from '@/lib/password-validation';
import { supabase } from '@/utils/supabase';
import bcrypt from 'bcryptjs';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LockIcon } from 'lucide-react-native';
import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { View } from 'react-native';

const ALL_RULES: PasswordRule[] = [
  'minLength',
  'uppercase',
  'lowercase',
  'number',
  'special',
];

export default function CreateCouplePasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ coupleId?: string }>();
  const coupleId = params.coupleId as string | undefined;

  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const validation = useMemo(() => validatePassword(password), [password]);
  const passwordsMatch =
    password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const canSubmit =
    validation.valid && passwordsMatch && !isLoading;

  useEffect(() => {
    if (!coupleId) {
      router.replace('/create-couple');
    }
  }, [coupleId, router]);

  const handleSetPassword = async () => {
    setError('');

    if (!validation.valid) {
      setError('Please fix the password requirements above.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace('/sign-in?redirect=create-couple-password');
        return;
      }

      if (!coupleId) {
        router.replace('/create-couple');
        return;
      }

      const keyHash = await new Promise<string>((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) reject(err);
          else resolve(hash ?? '');
        });
      });

      const { error: rpcError } = await supabase.rpc('set_couple_lock', {
        p_couple_id: coupleId,
        p_key_hash: keyHash,
      });

      if (rpcError) {
        setError(rpcError.message ?? 'Failed to set password. Please try again.');
        return;
      }

      router.replace('/home');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace('/home');
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (error) setError('');
  };

  const handleConfirmChange = (text: string) => {
    setConfirmPassword(text);
    if (error) setError('');
  };

  if (!coupleId) {
    return null;
  }

  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <View className="w-full max-w-sm gap-8">
        {/* Icon Area */}
        <View className="items-center gap-4">
          <View className="bg-primary/10 rounded-full p-6 items-center justify-center">
            <Icon as={LockIcon} className="text-primary" size={48} />
          </View>
        </View>

        {/* Title and Subtitle */}
        <View className="items-center gap-2">
          <Text variant="h1" className="text-foreground">
            Secure Your Space
          </Text>
          <Text variant="muted" className="text-center">
            Create a password to lock your couple space. Share your couple space
            name and password with your partner so they can join.
          </Text>
        </View>

        {/* Password Inputs */}
        <View className="gap-4">
          <Input
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            onSubmitEditing={() => {}}
            className="w-full"
            editable={!isLoading}
          />
          <Input
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={handleConfirmChange}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            onSubmitEditing={handleSetPassword}
            className="w-full"
            editable={!isLoading}
          />

          {/* Validation checklist */}
          <View className="gap-1">
            {ALL_RULES.map((rule) => {
              const passed = !validation.failedRules.includes(rule);
              return (
                <Text
                  key={rule}
                  className={`text-xs ${passed ? 'text-muted-foreground' : 'text-foreground/70'}`}
                >
                  {passed ? '✓ ' : '○ '}
                  {getRuleLabel(rule)}
                </Text>
              );
            })}
          </View>

          {password.length > 0 && confirmPassword.length > 0 && !passwordsMatch ? (
            <Text className="text-destructive text-sm">Passwords do not match</Text>
          ) : null}

          {error ? (
            <Text className="text-destructive text-sm text-center">{error}</Text>
          ) : null}
        </View>

        {/* Buttons */}
        <View className="gap-3">
          <Button
            onPress={handleSetPassword}
            disabled={!canSubmit}
            className="w-full"
            size="lg"
          >
            <Text>Set Password</Text>
          </Button>
          <Button variant="ghost" onPress={handleSkip} className="w-full">
            <Text className="text-muted-foreground">Skip for now</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
