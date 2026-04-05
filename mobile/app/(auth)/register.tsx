import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import * as api from "../../src/api/client";
import AnimatedPressable from "../../src/components/AnimatedPressable";
import CountryPicker from "../../src/components/CountryPicker";
import GradientButton from "../../src/components/GradientButton";
import PremiumInput from "../../src/components/PremiumInput";
import TimezonePicker from "../../src/components/TimezonePicker";
import { COLORS } from "../../src/constants";
import { useAuth } from "../../src/context/AuthContext";
import type { Country } from "../../src/types";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [localPhone, setLocalPhone] = useState("");
  const [timezone, setTimezone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getCountries();
        setCountries(data);
        autoDetectCountry(data);
      } catch {
        Alert.alert("Error", "Failed to load countries.");
      } finally {
        setLoadingCountries(false);
      }
    })();
  }, []);

  const autoDetectCountry = (data: Country[]) => {
    const deviceTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    for (const country of data) {
      const match = country.timezones.find((t) => t.timezone === deviceTz);
      if (match) {
        setSelectedCountry(country);
        setTimezone(match.timezone);
        return;
      }
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    if (country.timezones.length === 1) {
      setTimezone(country.timezones[0].timezone);
    } else {
      const deviceTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const match = country.timezones.find((t) => t.timezone === deviceTz);
      setTimezone(match ? match.timezone : country.timezones[0].timezone);
    }
  };

  const handleRegister = async () => {
    if (!selectedCountry) {
      Alert.alert("Error", "Please select your country.");
      return;
    }
    if (!localPhone) {
      Alert.alert("Error", "Please enter your phone number.");
      return;
    }
    if (!password) {
      Alert.alert("Error", "Please enter a password.");
      return;
    }

    const fullPhone = selectedCountry.calling_code + localPhone;
    setLoading(true);
    try {
      await register(fullPhone, timezone, password, selectedCountry.id);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Registration Failed", e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingCountries) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={COLORS.brand} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 28 }}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInUp.duration(600).springify()} className="items-center mb-6">
          <View
            style={{
              shadowColor: COLORS.brand,
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <Image
              source={require("../../assets/icon.png")}
              className="w-24 h-24 rounded-3xl"
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(200).duration(500)} className="items-center mb-8">
          <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</Text>
          <Text className="text-base text-gray-400 mt-2">Get AI-powered call reminders</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500).springify()}>
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Country</Text>
          <CountryPicker
            countries={countries}
            selected={selectedCountry}
            onSelect={handleCountrySelect}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(380).duration(500).springify()}>
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</Text>
          <View className="flex-row mb-3 gap-2">
            <LinearGradient
              colors={[COLORS.brandLight, "#f0edff"]}
              className="rounded-2xl px-4 py-4 justify-center"
            >
              <Text className="text-base font-bold text-brand">
                {selectedCountry?.calling_code ?? "—"}
              </Text>
            </LinearGradient>
            <View className="flex-1">
              <PremiumInput
                placeholder="Phone number"
                value={localPhone}
                onChangeText={setLocalPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </Animated.View>

        {selectedCountry && selectedCountry.timezones.length > 1 && (
          <Animated.View entering={FadeInDown.delay(420).duration(500).springify()}>
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Timezone</Text>
            <TimezonePicker
              timezones={selectedCountry.timezones.map((t) => t.timezone)}
              selected={timezone}
              onSelect={setTimezone}
            />
          </Animated.View>
        )}

        {selectedCountry && selectedCountry.timezones.length === 1 && (
          <Animated.View entering={FadeInDown.delay(420).duration(500).springify()} className="mb-3">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Timezone</Text>
            <View className="rounded-2xl px-5 py-4 bg-gray-100 border border-gray-200">
              <Text className="text-base text-gray-500 font-medium">{timezone}</Text>
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(500).duration(500).springify()} className="relative mb-6">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</Text>
          <PremiumInput
            placeholder="Minimum 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable
            className="absolute right-4 bottom-4"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={COLORS.textTertiary}
            />
          </Pressable>
        </Animated.View>

        <GradientButton
          label="Create Account"
          loadingLabel="Creating..."
          loading={loading}
          onPress={handleRegister}
        />

        <Animated.View entering={FadeIn.delay(700).duration(400)} className="mt-8 items-center mb-10">
          <Link href="/(auth)/login" asChild>
            <AnimatedPressable>
              <Text className="text-gray-400 text-sm">
                Already have an account?{" "}
                <Text className="text-brand font-bold">Sign In</Text>
              </Text>
            </AnimatedPressable>
          </Link>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
