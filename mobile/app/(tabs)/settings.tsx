import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import AnimatedPressable from "../../src/components/AnimatedPressable";
import { COLORS } from "../../src/constants";
import { useAuth } from "../../src/context/AuthContext";
import { saveRemlyContact } from "../../src/utils/contacts";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [savingContact, setSavingContact] = useState(false);

  const handleSaveContact = async () => {
    setSavingContact(true);
    try {
      const saved = await saveRemlyContact();
      if (saved) {
        Alert.alert(
          "Done",
          "Remly AI Assistant has been saved to your contacts. Calls won't be blocked as spam."
        );
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setSavingContact(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
      <Animated.View entering={FadeIn.duration(600)}>
        <LinearGradient
          colors={[COLORS.brand, COLORS.brandDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-3xl p-6 items-center"
          style={{
            shadowColor: COLORS.brand,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <View className="bg-white/20 rounded-full p-4 mb-4">
            <Ionicons name="person-outline" size={32} color={COLORS.white} />
          </View>
          <Text className="text-white text-xl font-bold">{user?.phone_number}</Text>
          <Text className="text-indigo-200 text-sm mt-1">
            {user?.country?.flag} {user?.timezone}
          </Text>
          <View className="bg-white/15 rounded-2xl px-6 py-3 mt-5 flex-row items-baseline gap-2">
            <Text className="text-white text-4xl font-extrabold">{user?.credits ?? 0}</Text>
            <Text className="text-indigo-200 text-sm font-medium">credits</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(500).springify()} className="mt-6">
        <AnimatedPressable onPress={() => router.push("/credits")}>
          <LinearGradient
            colors={["#f0edff", COLORS.brandLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl p-5 flex-row items-center gap-4 border border-brand/10"
          >
            <View className="bg-brand rounded-xl p-3">
              <Ionicons name="add-circle" size={22} color={COLORS.white} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-brand">Buy Credits</Text>
              <Text className="text-xs text-indigo-400 mt-0.5">Top up your call credits</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.brand} />
          </LinearGradient>
        </AnimatedPressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(500).springify()} className="mt-8">
        <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
          Call Setup
        </Text>
        <AnimatedPressable onPress={handleSaveContact} disabled={savingContact}>
          <View
            className="bg-white rounded-2xl p-5 flex-row items-center gap-4"
            style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}
          >
            <LinearGradient
              colors={[COLORS.brandLight, "#f0edff"]}
              className="rounded-xl p-3"
            >
              <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.brand} />
            </LinearGradient>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800">
                {savingContact ? "Saving..." : "Save Remly AI to Contacts"}
              </Text>
              <Text className="text-xs text-gray-400 mt-1">
                Prevents your phone from blocking our calls
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
          </View>
        </AnimatedPressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(350).duration(500).springify()} className="mt-8">
        <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
          Account
        </Text>
        <AnimatedPressable onPress={handleLogout}>
          <View
            className="bg-white rounded-2xl p-5 flex-row items-center gap-4"
            style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}
          >
            <View className="bg-red-50 rounded-xl p-3">
              <Ionicons name="log-out-outline" size={22} color={COLORS.red} />
            </View>
            <Text className="text-base font-semibold text-red-500 flex-1">Sign Out</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
          </View>
        </AnimatedPressable>
      </Animated.View>
    </ScrollView>
  );
}
