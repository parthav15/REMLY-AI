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
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import * as api from "../../src/api/client";
import AnimatedPressable from "../../src/components/AnimatedPressable";
import CountryPicker from "../../src/components/CountryPicker";
import GradientButton from "../../src/components/GradientButton";
import PremiumInput from "../../src/components/PremiumInput";
import { COLORS } from "../../src/constants";
import { useAuth } from "../../src/context/AuthContext";
import type { Country } from "../../src/types";

export default function LoginScreen() {
  const { login } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [localPhone, setLocalPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getCountries();
        setCountries(data);
        const deviceTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const match = data.find((c) => c.timezones.some((t) => t.timezone === deviceTz));
        if (match) setSelectedCountry(match);
      } catch {
        Alert.alert("Error", "Failed to load countries.");
      } finally {
        setLoadingCountries(false);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (!selectedCountry) {
      Alert.alert("Error", "Please select your country.");
      return;
    }
    if (!localPhone || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    const fullPhone = selectedCountry.calling_code + localPhone;
    setLoading(true);
    try {
      await login(fullPhone, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Login Failed", e.message);
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
        <Animated.View entering={FadeInUp.duration(600).springify()} className="items-center mb-8">
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

        <Animated.View entering={FadeIn.delay(200).duration(500)} className="items-center mb-10">
          <Text className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome back</Text>
          <Text className="text-base text-gray-400 mt-2">Sign in to your Remly AI account</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500).springify()}>
          <CountryPicker
            countries={countries}
            selected={selectedCountry}
            onSelect={setSelectedCountry}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(380).duration(500).springify()} className="flex-row mb-3 gap-2">
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
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(460).duration(500).springify()} className="relative mb-6">
          <PremiumInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable
            className="absolute right-4 top-4"
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
          label="Sign In"
          loadingLabel="Signing in..."
          loading={loading}
          onPress={handleLogin}
        />

        <Animated.View entering={FadeIn.delay(600).duration(400)} className="mt-8 items-center mb-10">
          <Link href="/(auth)/register" asChild>
            <AnimatedPressable>
              <Text className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <Text className="text-brand font-bold">Create one</Text>
              </Text>
            </AnimatedPressable>
          </Link>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
