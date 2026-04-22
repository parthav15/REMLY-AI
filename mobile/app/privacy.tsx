import { Ionicons } from "@expo/vector-icons";
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

interface SectionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  items: string[];
  delay: number;
}

function Section({ icon, title, items, delay }: SectionProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500).springify()}
      className="mt-5"
    >
      <View className="bg-white rounded-2xl p-5" style={CARD_SHADOW}>
        <View className="flex-row items-center gap-2.5 mb-3">
          <View className="rounded-xl p-2" style={{ backgroundColor: COLORS.brandLight }}>
            <Ionicons name={icon} size={18} color={COLORS.brand} />
          </View>
          <Text className="text-base font-extrabold text-gray-900 flex-1">{title}</Text>
        </View>
        <View className="gap-2">
          {items.map((item) => (
            <View key={item} className="flex-row items-start gap-2">
              <Text className="text-brand font-bold">•</Text>
              <Text className="text-[13px] text-gray-600 leading-5 flex-1">{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

export default function PrivacyScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-5 pt-3 pb-4 flex-row items-center gap-3">
        <Pressable onPress={() => router.back()} className="bg-gray-100 rounded-full p-2">
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900 flex-1">Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Animated.View entering={FadeInDown.delay(30).duration(500)}>
          <Text className="text-[13px] text-gray-500 leading-5 mb-1 px-1">
            Your privacy is important. Here's exactly what we do with your data.
          </Text>
        </Animated.View>

        <Section
          icon="download-outline"
          title="What we collect"
          delay={80}
          items={[
            "Phone number (to place reminder calls)",
            "Timezone and country (to schedule accurately)",
            "Reminder messages you create",
            "Payment information (processed by Razorpay)",
          ]}
        />

        <Section
          icon="construct-outline"
          title="How we use it"
          delay={160}
          items={[
            "To place your scheduled reminder calls",
            "To process credit purchases and invoices",
            "To improve reliability and conversation quality",
          ]}
        />

        <Section
          icon="people-outline"
          title="Third parties"
          delay={240}
          items={[
            "Retell AI — powers the voice agent on calls",
            "Razorpay — handles payments and credit purchases",
            "PostgreSQL hosting — stores your reminders securely",
          ]}
        />

        <Section
          icon="key-outline"
          title="Your rights"
          delay={320}
          items={[
            "Access all data we hold about you",
            "Delete your account and associated reminders",
            "Export a copy of your data on request",
          ]}
        />

        <Animated.View
          entering={FadeInDown.delay(400).duration(500).springify()}
          className="mt-5"
        >
          <View className="bg-white rounded-2xl p-5" style={CARD_SHADOW}>
            <View className="flex-row items-center gap-2.5 mb-3">
              <View className="rounded-xl p-2" style={{ backgroundColor: COLORS.brandLight }}>
                <Ionicons name="mail-outline" size={18} color={COLORS.brand} />
              </View>
              <Text className="text-base font-extrabold text-gray-900">Contact</Text>
            </View>
            <Text className="text-[13px] text-gray-600 leading-5 mb-1">
              Privacy questions or data requests:
            </Text>
            <Text className="text-[14px] font-semibold text-brand">privacy@remly.ai</Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(470).duration(500)}
          className="mt-6 items-center"
        >
          <Text className="text-xs text-gray-400">Last updated: March 2026</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
