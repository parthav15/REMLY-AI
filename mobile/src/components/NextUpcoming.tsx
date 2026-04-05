import React, { useMemo } from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Reminder } from "../types";
import { COLORS } from "../constants";

interface NextUpcomingProps {
  reminders: Reminder[];
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const month = d.toLocaleString("en-US", { month: "short" });
  const day = d.getDate();
  const time = d
    .toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    .replace(" ", " ");
  return `${month} ${day}, ${time}`;
}

export default function NextUpcoming({ reminders }: NextUpcomingProps) {
  const next = useMemo(() => {
    const now = new Date().getTime();
    return reminders
      .filter((r) => r.status === "pending" && new Date(r.scheduled_at).getTime() >= now)
      .sort(
        (a, b) =>
          new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
      )[0] ?? null;
  }, [reminders]);

  if (!next) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      className="bg-white rounded-2xl p-4 mx-4 mb-2"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: COLORS.brand,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Top row */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
          NEXT UP
        </Text>
        <Ionicons name="alarm-outline" size={18} color={COLORS.brand} />
      </View>

      {/* Message */}
      <Text className="text-base font-semibold text-gray-800 mb-3" numberOfLines={2}>
        {next.message}
      </Text>

      {/* Bottom row */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={14} color={COLORS.textTertiary} />
          <Text className="text-sm text-gray-400 ml-1">
            {formatDateTime(next.scheduled_at)}
          </Text>
        </View>

        {next.is_recurring && (
          <View className="flex-row items-center bg-indigo-50 rounded-full px-2 py-0.5">
            <Ionicons name="repeat-outline" size={12} color={COLORS.brand} />
            <Text className="text-xs font-medium text-indigo-600 ml-1">Recurring</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}
