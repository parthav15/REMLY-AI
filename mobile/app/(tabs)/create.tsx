import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import * as api from "../../src/api/client";
import AnimatedPressable from "../../src/components/AnimatedPressable";
import GradientButton from "../../src/components/GradientButton";
import PremiumInput from "../../src/components/PremiumInput";
import { COLORS, CONFIG } from "../../src/constants";
import { useAuth } from "../../src/context/AuthContext";

export default function CreateScreen() {
  const { user, refreshUser } = useAuth();
  const [message, setMessage] = useState("");
  const [date, setDate] = useState(new Date(Date.now() + CONFIG.DEFAULT_REMINDER_OFFSET_MS));
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a reminder message.");
      return;
    }
    if (date <= new Date()) {
      Alert.alert("Error", "Scheduled time must be in the future.");
      return;
    }
    if ((user?.credits ?? 0) < CONFIG.REMINDER_CREDIT_COST) {
      Alert.alert("No Credits", "You need at least 1 credit to create a reminder.");
      return;
    }

    setLoading(true);
    try {
      await api.createReminder(message.trim(), date.toISOString(), recurring);
      await refreshUser();
      Alert.alert("Reminder Set", "We'll call you when it's time.", [
        { text: "OK", onPress: () => router.navigate("/(tabs)") },
      ]);
      setMessage("");
      setDate(new Date(Date.now() + CONFIG.DEFAULT_REMINDER_OFFSET_MS));
      setRecurring(false);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Animated.View entering={FadeIn.duration(500)} className="mb-6">
          <LinearGradient
            colors={[COLORS.brandLight, "#f0edff"]}
            className="rounded-2xl p-4 flex-row items-center gap-3"
          >
            <Ionicons name="sparkles" size={20} color={COLORS.brand} />
            <Text className="text-sm text-brand font-semibold flex-1">
              Our AI assistant will call and read your reminder aloud.
            </Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500).springify()}>
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Reminder Message
          </Text>
          <PremiumInput
            placeholder="e.g. Take your meds, Join the Zoom call..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={CONFIG.MAX_MESSAGE_LENGTH}
            style={{ minHeight: 110, textAlignVertical: "top" }}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500).springify()} className="mt-5">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Schedule
          </Text>
          <View className="flex-row gap-3">
            <AnimatedPressable
              className="flex-1"
              onPress={() => setShowDate(true)}
            >
              <View
                className="bg-white rounded-2xl px-4 py-4 flex-row items-center gap-3 border border-gray-100"
                style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
              >
                <Ionicons name="calendar-outline" size={20} color={COLORS.brand} />
                <Text className="text-base font-semibold text-gray-800">{formatDate(date)}</Text>
              </View>
            </AnimatedPressable>
            <AnimatedPressable
              className="flex-1"
              onPress={() => setShowTime(true)}
            >
              <View
                className="bg-white rounded-2xl px-4 py-4 flex-row items-center gap-3 border border-gray-100"
                style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
              >
                <Ionicons name="time-outline" size={20} color={COLORS.brand} />
                <Text className="text-base font-semibold text-gray-800">{formatTime(date)}</Text>
              </View>
            </AnimatedPressable>
          </View>
        </Animated.View>

        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            minimumDate={new Date()}
            onChange={(_, selected) => {
              setShowDate(false);
              if (selected) {
                const updated = new Date(date);
                updated.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
                setDate(updated);
              }
            }}
          />
        )}
        {showTime && (
          <DateTimePicker
            value={date}
            mode="time"
            onChange={(_, selected) => {
              setShowTime(false);
              if (selected) {
                const updated = new Date(date);
                updated.setHours(selected.getHours(), selected.getMinutes());
                setDate(updated);
              }
            }}
          />
        )}

        <Animated.View entering={FadeInDown.delay(300).duration(500).springify()} className="mt-5">
          <AnimatedPressable onPress={() => setRecurring(!recurring)}>
            <View
              className="bg-white rounded-2xl px-5 py-4 flex-row justify-between items-center border border-gray-100"
              style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
            >
              <View className="flex-row items-center gap-3 flex-1">
                <View className={`rounded-xl p-2 ${recurring ? "bg-indigo-50" : "bg-gray-100"}`}>
                  <Ionicons name="repeat-outline" size={20} color={recurring ? COLORS.brand : COLORS.textTertiary} />
                </View>
                <View>
                  <Text className="text-base font-semibold text-gray-800">Repeat daily</Text>
                  <Text className="text-xs text-gray-400 mt-0.5">Same time every day</Text>
                </View>
              </View>
              <Switch
                value={recurring}
                onValueChange={setRecurring}
                trackColor={{ true: COLORS.brand, false: COLORS.switchTrackOff }}
                thumbColor={COLORS.white}
              />
            </View>
          </AnimatedPressable>
        </Animated.View>

        <View className="mt-8">
          <GradientButton
            label={`Set Reminder (${CONFIG.REMINDER_CREDIT_COST} credit)`}
            loadingLabel="Setting reminder..."
            loading={loading}
            onPress={handleCreate}
          />
        </View>

        <Animated.View entering={FadeIn.delay(500).duration(400)} className="mt-4 items-center">
          <Text className="text-sm text-gray-300">
            {user?.credits ?? 0} credits remaining
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
