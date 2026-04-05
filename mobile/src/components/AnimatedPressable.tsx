import React from "react";
import { Pressable, type PressableProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPress = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = { damping: 15, stiffness: 150 };

interface AnimatedPressableProps extends PressableProps {
  scaleValue?: number;
  className?: string;
  children: React.ReactNode;
}

export default function AnimatedPressable({
  scaleValue = 0.97,
  children,
  onPressIn,
  onPressOut,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPress
      onPressIn={(e) => {
        scale.value = withSpring(scaleValue, SPRING_CONFIG);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, SPRING_CONFIG);
        onPressOut?.(e);
      }}
      style={animatedStyle}
      {...props}
    >
      {children}
    </AnimatedPress>
  );
}
