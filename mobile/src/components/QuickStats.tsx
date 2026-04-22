import React from "react";
import { ScrollView, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import AnimatedPressable from "./AnimatedPressable";
import { Reminder } from "../types";

interface QuickStatsProps {
  reminders: Reminder[];
  activeFilter: string | null;
  onFilterChange: (status: string | null) => void;
}

const FILTERS = [
  { id: "pending", label: "Pending" },
  { id: "triggered", label: "Triggered" },
] as const;

export default function QuickStats({
  activeFilter,
  onFilterChange,
}: QuickStatsProps) {
  return (
    <Animated.View entering={FadeIn} className="px-4 py-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <AnimatedPressable
              key={f.id}
              scaleValue={0.95}
              onPress={() => onFilterChange(isActive ? null : f.id)}
              className={`rounded-full px-4 py-2 ${
                isActive ? "bg-indigo-600" : "bg-white border border-gray-200"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  isActive ? "text-white" : "text-gray-600"
                }`}
              >
                {f.label}
              </Text>
            </AnimatedPressable>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}
