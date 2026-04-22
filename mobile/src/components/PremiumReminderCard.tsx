import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { COLORS } from "../constants";
import type { Reminder } from "../types";
import AnimatedPressable from "./AnimatedPressable";

const STATUS_ACCENT: Record<string, string> = {
  pending: COLORS.brand,
  triggered: "#d97706",
  answered: "#059669",
  missed: "#ef4444",
};

function formatRelative(iso: string): string {
  const target = new Date(iso).getTime();
  const now = Date.now();
  const diff = target - now;
  const abs = Math.abs(diff);
  const future = diff > 0;

  const mins = Math.floor(abs / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (abs < 60000) return future ? "in a moment" : "just now";
  if (mins < 60) return future ? `in ${mins}m` : `${mins}m ago`;
  if (hrs < 24) return future ? `in ${hrs}h ${mins % 60}m` : `${hrs}h ago`;
  if (days < 7) return future ? `in ${days}d` : `${days}d ago`;
  return future ? `in ${Math.floor(days / 7)}w` : `${Math.floor(days / 7)}w ago`;
}

function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

interface PremiumReminderCardProps {
  reminder: Reminder;
  onLongPress?: () => void;
}

export default function PremiumReminderCard({ reminder, onLongPress }: PremiumReminderCardProps) {
  const accent = STATUS_ACCENT[reminder.status] ?? COLORS.brand;
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (reminder.status === "triggered") {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.6, { duration: 800, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.in(Easing.ease) })
        ),
        -1
      );
    }
  }, [reminder.status]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 2 - pulse.value,
  }));

  const isUpcoming = reminder.status === "pending";

  return (
    <AnimatedPressable onLongPress={onLongPress} scaleValue={0.98}>
      <View
        className="bg-white rounded-2xl mb-3 flex-row overflow-hidden"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 16,
          elevation: 3,
        }}
      >
        <View style={{ width: 4, backgroundColor: accent }} />

        <View className="flex-1 p-4">
          <View className="flex-row items-center gap-2 mb-2">
            {reminder.status === "triggered" && (
              <View style={{ width: 8, height: 8 }}>
                <Animated.View
                  style={[
                    {
                      position: "absolute",
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: accent,
                    },
                    pulseStyle,
                  ]}
                />
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: accent,
                  }}
                />
              </View>
            )}
            <Text className="text-[15px] font-bold text-gray-900">{formatClock(reminder.scheduled_at)}</Text>
            <View className="w-1 h-1 rounded-full bg-gray-300" />
            <Text className="text-xs text-gray-400 font-medium">{formatRelative(reminder.scheduled_at)}</Text>
          </View>

          <Text className="text-base font-semibold text-gray-800 leading-[22px]" numberOfLines={3}>
            {reminder.message}
          </Text>

          <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <View className="flex-row items-center gap-3">
              {reminder.is_recurring && (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="repeat" size={12} color={COLORS.brand} />
                  <Text className="text-[11px] text-brand font-bold">Daily</Text>
                </View>
              )}
              {isUpcoming && !reminder.is_recurring && (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="call-outline" size={12} color={COLORS.textTertiary} />
                  <Text className="text-[11px] text-gray-400 font-medium">1 credit</Text>
                </View>
              )}
            </View>
            {isUpcoming && (
              <View className="flex-row items-center gap-1">
                <Text className="text-[11px] text-gray-300 font-medium">Hold to cancel</Text>
                <Ionicons name="chevron-forward" size={10} color={COLORS.textTertiary} />
              </View>
            )}
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}
