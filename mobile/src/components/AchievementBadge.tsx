import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { COLORS } from "../constants";
import type { Achievement } from "../utils/profileStats";

interface AchievementBadgeProps {
  achievement: Achievement;
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const progressPct = Math.round((achievement.progress / achievement.target) * 100);

  return (
    <View
      className="bg-white rounded-2xl p-4 items-center"
      style={{
        width: 128,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      {achievement.unlocked ? (
        <LinearGradient
          colors={[COLORS.brand, COLORS.brandDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl items-center justify-center mb-3"
          style={{
            width: 56,
            height: 56,
            shadowColor: COLORS.brand,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Ionicons name={achievement.icon as any} size={28} color={COLORS.white} />
        </LinearGradient>
      ) : (
        <View
          className="bg-gray-100 rounded-2xl items-center justify-center mb-3"
          style={{ width: 56, height: 56 }}
        >
          <Ionicons name="lock-closed" size={20} color={COLORS.textTertiary} />
        </View>
      )}

      <Text
        className={`text-xs font-bold text-center ${
          achievement.unlocked ? "text-gray-900" : "text-gray-400"
        }`}
        numberOfLines={1}
      >
        {achievement.title}
      </Text>
      <Text className="text-[10px] text-gray-400 text-center mt-1" numberOfLines={2}>
        {achievement.description}
      </Text>

      {!achievement.unlocked && achievement.target > 1 && (
        <View className="w-full mt-3">
          <View className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <View
              className="h-full bg-brand rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </View>
          <Text className="text-[9px] text-gray-400 font-semibold text-center mt-1">
            {achievement.progress}/{achievement.target}
          </Text>
        </View>
      )}
    </View>
  );
}
