import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as api from "../../src/api/client";
import AnimatedPressable from "../../src/components/AnimatedPressable";
import CountryPicker from "../../src/components/CountryPicker";
import TimezonePicker from "../../src/components/TimezonePicker";
import { COLORS } from "../../src/constants";
import { useAuth } from "../../src/context/AuthContext";
import type { Country } from "../../src/types";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(user?.country ?? null);
  const [timezone, setTimezone] = useState(user?.timezone ?? "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getCountries();
        setCountries(data);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    const deviceTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const match = country.timezones.find((t) => t.timezone === deviceTz);
    setTimezone(match ? match.timezone : country.timezones[0]?.timezone ?? "");
  };

  const handleSave = async () => {
    Alert.alert("Profile Update", "Profile editing will be available soon.", [{ text: "OK" }]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color={COLORS.brand} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View
        className="bg-white px-5 pb-4 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <Pressable
            onPress={() => router.back()}
            className="bg-gray-100"
            style={{ borderRadius: 100, padding: 8 }}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
          </Pressable>
          <Text className="text-xl font-extrabold text-gray-900">Edit Profile</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(500)}>
          <LinearGradient
            colors={[COLORS.brand, COLORS.brandDark]}
            className="p-6 items-center"
            style={{
              borderRadius: 28,
              shadowColor: COLORS.brand,
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 12,
            }}
          >
            <View
              className="bg-white/25 items-center justify-center mb-3"
              style={{ width: 84, height: 84, borderRadius: 42 }}
            >
              <Ionicons name="person" size={38} color={COLORS.white} />
            </View>
            <Text className="text-white text-base font-extrabold">{user?.phone_number}</Text>
            <Text className="text-indigo-100 text-xs font-medium mt-1">Phone cannot be changed</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500).springify()} className="mt-6">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
            Location
          </Text>
          <View
            className="bg-white p-5"
            style={{
              borderRadius: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Country
            </Text>
            <CountryPicker
              countries={countries}
              selected={selectedCountry}
              onSelect={handleCountrySelect}
            />

            {selectedCountry && selectedCountry.timezones.length > 1 && (
              <View className="mt-3">
                <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Timezone
                </Text>
                <TimezonePicker
                  timezones={selectedCountry.timezones.map((t) => t.timezone)}
                  selected={timezone}
                  onSelect={setTimezone}
                />
              </View>
            )}

            {selectedCountry && selectedCountry.timezones.length === 1 && (
              <View className="mt-3">
                <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Timezone
                </Text>
                <View
                  className="bg-gray-50 px-4 py-3.5 flex-row items-center gap-2"
                  style={{ borderRadius: 16 }}
                >
                  <Ionicons name="time-outline" size={16} color={COLORS.textTertiary} />
                  <Text className="text-base text-gray-600 font-semibold">{timezone}</Text>
                </View>
              </View>
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(180).duration(500).springify()} className="mt-8">
          <AnimatedPressable onPress={handleSave} disabled={saving}>
            <LinearGradient
              colors={[COLORS.brand, COLORS.brandDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className={`py-4 items-center flex-row justify-center gap-2 ${
                saving ? "opacity-70" : ""
              }`}
              style={{
                borderRadius: 20,
                shadowColor: COLORS.brand,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              {saving && <ActivityIndicator size="small" color={COLORS.white} />}
              <Text className="text-white text-base font-bold tracking-wide">
                {saving ? "Saving..." : "Save Changes"}
              </Text>
            </LinearGradient>
          </AnimatedPressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
