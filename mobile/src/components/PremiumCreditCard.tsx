import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { COLORS } from "../constants";

interface PremiumCreditCardProps {
  credits: number;
}

export default function PremiumCreditCard({ credits }: PremiumCreditCardProps) {
  const shimmer = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.15 + shimmer.value * 0.25,
    transform: [{ translateX: -80 + shimmer.value * 260 }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Pressable onPress={() => router.push("/credits")}>
      <View
        className="mx-4 mt-1 rounded-3xl overflow-hidden"
        style={{
          shadowColor: COLORS.brand,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.35,
          shadowRadius: 20,
          elevation: 12,
        }}
      >
        <LinearGradient
          colors={["#6366f1", COLORS.brand, COLORS.brandDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 22, minHeight: 168 }}
        >
          <View
            className="absolute"
            style={{
              right: -40,
              top: -40,
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />
          <View
            className="absolute"
            style={{
              left: -60,
              bottom: -60,
              width: 180,
              height: 180,
              borderRadius: 90,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />

          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                bottom: 0,
                width: 80,
                backgroundColor: "white",
              },
              shimmerStyle,
            ]}
          />

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="bg-white/25 rounded-lg p-1.5">
                <Ionicons name="sparkles" size={14} color={COLORS.white} />
              </View>
              <Text className="text-white text-xs font-bold tracking-[2px] uppercase">Remly AI</Text>
            </View>
            <View className="flex-row items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              <Text className="text-white text-[10px] font-bold tracking-wide uppercase">Active</Text>
            </View>
          </View>

          <View className="mt-8 flex-row items-end justify-between">
            <View>
              <Text className="text-indigo-200 text-[10px] font-bold uppercase tracking-[2px] mb-1">
                Balance
              </Text>
              <View className="flex-row items-baseline gap-2">
                <Animated.Text
                  className="text-white font-extrabold"
                  style={[{ fontSize: 48, lineHeight: 52, letterSpacing: -1 }, pulseStyle]}
                >
                  {credits}
                </Animated.Text>
                <Text className="text-indigo-200 text-sm font-semibold">credits</Text>
              </View>
            </View>
            <View className="bg-white/20 rounded-2xl px-3.5 py-2.5 flex-row items-center gap-1.5">
              <Ionicons name="add" size={16} color={COLORS.white} />
              <Text className="text-white text-xs font-bold">Top up</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Pressable>
  );
}
