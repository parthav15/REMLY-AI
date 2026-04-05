import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AnimatedPressable from "./AnimatedPressable";
import { COLORS } from "../constants";

interface NotificationBellProps {
  count: number;
}

export default function NotificationBell({ count }: NotificationBellProps) {
  const displayCount = count > 9 ? "9+" : String(count);

  return (
    <AnimatedPressable scaleValue={0.9} className="relative p-2">
      <Ionicons
        name="notifications-outline"
        size={22}
        color={COLORS.textPrimary}
      />
      {count > 0 && (
        <View
          className="absolute bg-red-500 items-center justify-center rounded-full"
          style={{ top: -4, right: -6, minWidth: 18, height: 18 }}
        >
          <Text className="text-white text-xs font-bold text-center">
            {displayCount}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
}
