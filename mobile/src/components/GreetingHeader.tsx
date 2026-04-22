import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFormattedDate(): string {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
}

export default function GreetingHeader() {
  return (
    <Animated.View entering={FadeIn}>
      <Text className="text-xl font-bold text-gray-800">{getGreeting()}</Text>
      <Text className="text-sm text-gray-400">{getFormattedDate()}</Text>
    </Animated.View>
  );
}
