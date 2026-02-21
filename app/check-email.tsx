import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { MailIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

export default function CheckEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email ?? '';

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Check your email',
          headerShown: false,
        }}
      />
      <View className="flex-1 items-center justify-center bg-background p-6">
        <View className="w-full max-w-sm gap-8">
          <View className="items-center gap-4">
            <View className="items-center justify-center rounded-full bg-primary/10 p-6">
              <Icon as={MailIcon} className="text-primary" size={48} />
            </View>
          </View>

          <View className="items-center gap-2">
            <Text variant="h1" className="text-center text-foreground">
              Check your email
            </Text>
            <Text variant="muted" className="text-center">
              We&apos;ve sent a confirmation link to{' '}
              {email ? (
                <Text className="font-semibold text-foreground">{email}</Text>
              ) : (
                'your email'
              )}
              . Click the link to verify your account and get started.
            </Text>
          </View>

          <View className="gap-3">
            <Button
              variant="ghost"
              onPress={() => router.replace('/sign-in')}
              className="w-full"
            >
              <Text className="text-muted-foreground">Back to sign in</Text>
            </Button>
          </View>
        </View>
      </View>
    </>
  );
}
