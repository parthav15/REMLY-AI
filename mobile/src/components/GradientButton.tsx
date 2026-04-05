import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { COLORS } from "../constants";
import AnimatedPressable from "./AnimatedPressable";

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
}

export default function GradientButton({
  label,
  onPress,
  loading = false,
  loadingLabel,
  disabled = false,
}: GradientButtonProps) {
  return (
    <Animated.View entering={FadeIn.delay(200).duration(500)}>
      <AnimatedPressable
        onPress={onPress}
        disabled={disabled || loading}
        scaleValue={0.96}
      >
        <LinearGradient
          colors={[COLORS.brand, COLORS.brandDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={`rounded-2xl py-4 items-center flex-row justify-center gap-2 ${
            loading || disabled ? "opacity-70" : ""
          }`}
          style={{ shadowColor: COLORS.brand, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 }}
        >
          {loading && <ActivityIndicator size="small" color={COLORS.white} />}
          <Text className="text-white text-base font-bold tracking-wide">
            {loading ? (loadingLabel ?? label) : label}
          </Text>
        </LinearGradient>
      </AnimatedPressable>
    </Animated.View>
  );
}
