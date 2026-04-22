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

export default function LegalScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-5 pt-3 pb-4 flex-row items-center gap-3">
        <Pressable onPress={() => router.back()} className="bg-gray-100 rounded-full p-2">
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900 flex-1">Legal & Trademarks</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Animated.View entering={FadeInDown.delay(50).duration(500).springify()}>
          <View className="bg-white rounded-2xl p-5" style={CARD_SHADOW}>
            <View className="flex-row items-center gap-2.5 mb-3">
              <View
                className="rounded-xl p-2"
                style={{ backgroundColor: COLORS.brandLight }}
              >
                <Ionicons name="document-text-outline" size={18} color={COLORS.brand} />
              </View>
              <Text className="text-base font-extrabold text-gray-900">Terms of Service</Text>
            </View>
            <Text className="text-[13px] text-gray-600 leading-5 mb-3">
              By using Remly AI you agree to use the service for lawful, personal reminders. You
              are responsible for keeping your account credentials secure and for all activity
              performed under your account.
            </Text>
            <Text className="text-[13px] text-gray-600 leading-5 mb-3">
              You agree not to use Remly AI to harass, spam, or place calls to numbers you do not
              own or have permission to call. Credits purchased are non-refundable except where
              required by law.
            </Text>
            <Text className="text-[13px] text-gray-600 leading-5">
              We may suspend accounts that violate these terms. Remly AI is provided on an "as is"
              basis and we make no guarantees about uptime or message delivery beyond a reasonable
              best effort.
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(150).duration(500).springify()}
          className="mt-5"
        >
          <View className="bg-white rounded-2xl p-5" style={CARD_SHADOW}>
            <View className="flex-row items-center gap-2.5 mb-3">
              <View
                className="rounded-xl p-2"
                style={{ backgroundColor: COLORS.brandLight }}
              >
                <Ionicons name="ribbon-outline" size={18} color={COLORS.brand} />
              </View>
              <Text className="text-base font-extrabold text-gray-900">Trademarks</Text>
            </View>
            <View className="gap-2.5">
              <View className="flex-row items-start gap-2">
                <Text className="text-brand font-bold">•</Text>
                <Text className="text-[13px] text-gray-600 leading-5 flex-1">
                  Remly AI{"\u2122"} and the Remly logo are trademarks of Remly AI.
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-brand font-bold">•</Text>
                <Text className="text-[13px] text-gray-600 leading-5 flex-1">
                  Retell AI is a trademark of its respective owner and is used here under license.
                  All other marks belong to their holders.
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(250).duration(500).springify()}
          className="mt-5"
        >
          <View className="bg-white rounded-2xl p-5" style={CARD_SHADOW}>
            <View className="flex-row items-center gap-2.5 mb-3">
              <View
                className="rounded-xl p-2"
                style={{ backgroundColor: COLORS.brandLight }}
              >
                <Ionicons name="mail-outline" size={18} color={COLORS.brand} />
              </View>
              <Text className="text-base font-extrabold text-gray-900">Contact</Text>
            </View>
            <Text className="text-[13px] text-gray-600 leading-5 mb-1">
              Questions about these terms?
            </Text>
            <Text className="text-[14px] font-semibold text-brand">support@remly.ai</Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(320).duration(500)}
          className="mt-6 items-center"
        >
          <Text className="text-xs text-gray-400">Last updated: March 2026</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
