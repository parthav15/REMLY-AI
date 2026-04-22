import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { COLORS } from "../src/constants";

const CARD_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 3,
};

export default function AboutScreen() {
  const steps = [
    {
      title: "Set a reminder",
      body: "Type or speak what you need to remember and pick the time it matters most.",
    },
    {
      title: "We call you",
      body: "A real phone call rings through, cutting past the notification noise you ignore.",
    },
    {
      title: "Snooze conversationally",
      body: "Talk to the agent like a human. Push it ten minutes or mark it done, all by voice.",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-5 pt-3 pb-4 flex-row items-center gap-3">
        <Pressable onPress={() => router.back()} className="bg-gray-100 rounded-full p-2">
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900 flex-1">About Us</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Animated.View entering={FadeIn.duration(500)} className="items-center">
          <LinearGradient
            colors={[COLORS.brand, COLORS.brandDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-full p-6"
            style={{
              shadowColor: COLORS.brand,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <Ionicons name="sparkles" size={44} color={COLORS.white} />
          </LinearGradient>
          <Text className="text-3xl font-extrabold text-gray-900 mt-5 tracking-tight">
            Remly AI
          </Text>
          <Text className="text-sm text-gray-500 mt-1.5">Never miss what matters</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(100).duration(500).springify()}
          className="mt-8"
        >
          <View className="bg-white rounded-2xl p-5" style={CARD_SHADOW}>
            <Text className="text-xs font-bold text-brand uppercase tracking-widest mb-2">
              Our Mission
            </Text>
            <Text className="text-base font-bold text-gray-900 mb-2.5">
              Reminders that actually reach you
            </Text>
            <Text className="text-[14px] text-gray-600 leading-[22px]">
              Notifications get ignored. Badges pile up. Important things slip through. Remly AI
              uses a pattern-interrupt phone call to get your attention when it counts, bypassing
              the notification blindness that lets deadlines, pills, and promises fall through the
              cracks.
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(500).springify()}
          className="mt-5"
        >
          <View className="bg-white rounded-2xl p-5" style={CARD_SHADOW}>
            <Text className="text-xs font-bold text-brand uppercase tracking-widest mb-4">
              How It Works
            </Text>
            <View className="gap-4">
              {steps.map((step, idx) => (
                <View key={step.title} className="flex-row items-start gap-3">
                  <View
                    className="rounded-full w-8 h-8 items-center justify-center"
                    style={{ backgroundColor: COLORS.brandLight }}
                  >
                    <Text className="text-sm font-extrabold text-brand">{idx + 1}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-[15px] font-bold text-gray-900">{step.title}</Text>
                    <Text className="text-[13px] text-gray-500 leading-5 mt-0.5">
                      {step.body}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(500).springify()}
          className="mt-5"
        >
          <LinearGradient
            colors={[COLORS.brandLight, "#f0edff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl p-5 flex-row items-center gap-4"
          >
            <View className="bg-white rounded-xl p-3">
              <Ionicons name="mic-outline" size={22} color={COLORS.brand} />
            </View>
            <View className="flex-1">
              <Text className="text-[13px] font-bold text-brand">Built With</Text>
              <Text className="text-[13px] text-indigo-400 mt-0.5">
                Powered by Retell AI for natural conversations
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
