import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { supabase } from '@/utils/supabase';
import { createURL } from 'expo-linking';
import { useRouter } from 'expo-router';
import { UserPlusIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignUp = async () => {
    setError('');

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const emailRedirectTo = createURL('auth/callback');

      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo },
      });

      if (signUpError) {
        setError(signUpError.message ?? 'Sign up failed. Please try again.');
        return;
      }

      router.replace({
        pathname: '/check-email',
        params: { email: email.trim() },
      });
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
            <Icon as={UserPlusIcon} className="text-primary" size={48} />
          </View>
        </View>

        <View className="items-center gap-2">
          <Text variant="h1" className="text-foreground">
            Sign Up
          </Text>
          <Text variant="muted" className="text-center">
            Create an account to get started
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
            placeholder="Password (min 6 characters)"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError('');
            }}
            secureTextEntry
            autoComplete="new-password"
            className="w-full"
            editable={!isLoading}
          />

          {error ? (
            <Text className="text-center text-sm text-destructive">{error}</Text>
          ) : null}
        </View>

        <View className="gap-3">
          <Button
            onPress={handleSignUp}
            disabled={!email.trim() || !password.trim() || isLoading}
            className="w-full"
            size="lg"
          >
            <Text>Sign Up</Text>
          </Button>
          <Button
            variant="ghost"
            onPress={() => router.push('/sign-in')}
            className="w-full"
          >
            <Text className="text-muted-foreground">
              Already have an account? Sign in
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
