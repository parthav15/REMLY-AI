import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "../src/constants";

const CARD_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 3,
};

interface BulletListProps {
  items: string[];
  positive: boolean;
}

function BulletList({ items, positive }: BulletListProps) {
  const iconName = positive ? "checkmark-circle" : "close-circle";
  const iconColor = positive ? "#16a34a" : COLORS.red;
  return (
    <View className="gap-3">
      {items.map((item) => (
        <View key={item} className="flex-row items-start gap-2.5">
          <Ionicons name={iconName} size={18} color={iconColor} />
          <Text className="text-[13px] text-gray-600 leading-5 flex-1">{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function AiUsageScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-5 pt-3 pb-4 flex-row items-center gap-3">
        <Pressable onPress={() => router.back()} className="bg-gray-100 rounded-full p-2">
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900 flex-1">AI Usage</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Animated.View entering={FadeInDown.delay(50).duration(500).springify()}>
          <LinearGradient
            colors={[COLORS.brand, COLORS.brandDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl p-5"
            style={{
              shadowColor: COLORS.brand,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center gap-3 mb-2.5">
              <View className="bg-white/20 rounded-xl p-2.5">
                <Ionicons name="sparkles" size={20} color={COLORS.white} />
              </View>
              <Text className="text-white text-base font-extrabold flex-1">Voice AI</Text>
            </View>
            <Text className="text-[13px] text-indigo-100 leading-5">
              We use Retell AI's LLM-powered voice agent (GPT-4.1 Mini) to make your reminder
              calls sound natural. The agent reads your message aloud and can hold a brief
              back-and-forth when you need to snooze.
            </Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(150).duration(500).springify()}
          className="mt-5"
        >
          <View className="bg-white rounded-2xl p-5" style={CARD_SHADOW}>
            <Text className="text-base font-extrabold text-gray-900 mb-3.5">
              What the AI can do
            </Text>
            <BulletList
              positive
              items={[
                "Read your reminder aloud in a natural voice",
                "Understand when you want to snooze or reschedule",
                "Handle conversational interruptions gracefully",
              ]}
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(240).duration(500).springify()}
          className="mt-5"
        >
          <View className="bg-white rounded-2xl p-5" style={CARD_SHADOW}>
            <Text className="text-base font-extrabold text-gray-900 mb-3.5">
              What the AI cannot do
            </Text>
            <BulletList
              positive={false}
              items={[
                "Access your personal data beyond the reminder message",
                "Make calls outside your scheduled reminders",
                "Share your data with third parties",
              ]}
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(330).duration(500).springify()}
          className="mt-5"
        >
          <View className="bg-white rounded-2xl p-5" style={CARD_SHADOW}>
            <View className="flex-row items-center gap-2.5 mb-3">
              <View
                className="rounded-xl p-2"
                style={{ backgroundColor: COLORS.brandLight }}
              >
                <Ionicons name="eye-outline" size={18} color={COLORS.brand} />
              </View>
              <Text className="text-base font-extrabold text-gray-900">Human oversight</Text>
            </View>
            <Text className="text-[13px] text-gray-600 leading-5">
              All calls are capped at 2 minutes. You can cancel any scheduled reminder anytime
              from the home screen, and you can end a call simply by hanging up.
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(420).duration(500).springify()}
          className="mt-5"
        >
          <View className="bg-white rounded-2xl p-5" style={CARD_SHADOW}>
            <View className="flex-row items-center gap-2.5 mb-3">
              <View
                className="rounded-xl p-2"
                style={{ backgroundColor: COLORS.brandLight }}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={18} color={COLORS.brand} />
              </View>
              <Text className="text-base font-extrabold text-gray-900">Concerns?</Text>
            </View>
            <Text className="text-[13px] text-gray-600 leading-5 mb-1">
              Reach out to our AI ethics team anytime:
            </Text>
            <Text className="text-[14px] font-semibold text-brand">ai@remly.ai</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
