import React from "react";
import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { COLORS } from "../constants";
import AnimatedPressable from "./AnimatedPressable";

export default function QuickCreateFAB() {
  return (
    <Animated.View
      entering={FadeIn.delay(300)}
      style={{ position: "absolute", bottom: 24, right: 20 }}
    >
      <AnimatedPressable
        scaleValue={0.9}
        onPress={() => router.push("/(tabs)/create")}
        className="h-14 w-14 items-center justify-center rounded-full bg-indigo-600"
        style={{
          shadowColor: COLORS.brand,
          shadowOpacity: 0.35,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </AnimatedPressable>
    </Animated.View>
  );
}
