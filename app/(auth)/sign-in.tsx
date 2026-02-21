import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { supabase } from '@/utils/supabase';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LogInIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

export default function SignInScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ redirect?: string }>();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignIn = async () => {
    setError('');

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message ?? 'Sign in failed. Please try again.');
        return;
      }

      const redirect = params.redirect ? `/${params.redirect}` : '/';
      router.replace(redirect as '/');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <View className="w-full max-w-sm gap-8">
        <View className="items-center gap-4">
          <View className="items-center justify-center rounded-full bg-primary/10 p-6">
            <Icon as={LogInIcon} className="text-primary" size={48} />
          </View>
        </View>

        <View className="items-center gap-2">
          <Text variant="h1" className="text-foreground">
            Sign In
          </Text>
          <Text variant="muted" className="text-center">
            Sign in to create or access your couple space
          </Text>
        </View>

        <View className="gap-4">
          <Input
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            className="w-full"
            editable={!isLoading}
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError('');
            }}
            secureTextEntry
            autoComplete="password"
            className="w-full"
            editable={!isLoading}
          />

          {error ? (
            <Text className="text-center text-sm text-destructive">{error}</Text>
          ) : null}
        </View>

        <View className="gap-3">
          <Button
            onPress={handleSignIn}
            disabled={!email.trim() || !password.trim() || isLoading}
            className="w-full"
            size="lg"
          >
            <Text>Sign In</Text>
          </Button>
          <Button
            variant="ghost"
            onPress={() => router.push('/sign-up')}
            className="w-full"
          >
            <Text className="text-muted-foreground">
              Don&apos;t have an account? Sign up
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
