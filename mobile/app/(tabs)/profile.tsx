import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import * as api from "../../src/api/client";
import AnimatedPressable from "../../src/components/AnimatedPressable";
import ReliabilityRing from "../../src/components/ReliabilityRing";
import { COLORS } from "../../src/constants";
import { useAuth } from "../../src/context/AuthContext";
import type { PaymentRecord, Reminder } from "../../src/types";
import {
  computeProfileStats,
  formatMemberSince,
  getInitials,
  getUserTier,
} from "../../src/utils/profileStats";

interface SettingsRowItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sublabel?: string;
  iconColor: string;
  iconBg: string;
  destructive?: boolean;
  onPress: () => void;
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [rem, pay] = await Promise.all([
        api.getReminders(),
        api.getPaymentHistory().catch(() => [] as PaymentRecord[]),
      ]);
      setReminders(rem);
      setPayments(pay);
    } catch {}
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const stats = useMemo(() => computeProfileStats(reminders), [reminders]);
  const tier = useMemo(() => getUserTier(user?.credits ?? 0), [user?.credits]);
  const initials = useMemo(() => getInitials(user?.phone_number), [user?.phone_number]);

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;
  const formatPaymentDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
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

  const showComingSoon = (feature: string) => {
    Alert.alert(feature, "Coming soon.");
  };

  const settingsItems: SettingsRowItem[] = [
    {
      id: "edit",
      icon: "person-outline",
      label: "Edit Profile",
      sublabel: "Update your info",
      iconColor: COLORS.brand,
      iconBg: COLORS.brandLight,
      onPress: () => router.push("/profile/edit"),
    },
    {
      id: "language",
      icon: "language-outline",
      label: "Language",
      sublabel: "English",
      iconColor: "#0891b2",
      iconBg: "#cffafe",
      onPress: () => showComingSoon("Language"),
    },
    {
      id: "theme",
      icon: "color-palette-outline",
      label: "Theme",
      sublabel: "Light",
      iconColor: "#7c3aed",
      iconBg: "#ede9fe",
      onPress: () => showComingSoon("Theme"),
    },
    {
      id: "about",
      icon: "information-circle-outline",
      label: "About Us",
      iconColor: "#64748b",
      iconBg: "#f1f5f9",
      onPress: () => router.push("/about"),
    },
    {
      id: "logout",
      icon: "log-out-outline",
      label: "Sign Out",
      iconColor: "#ef4444",
      iconBg: "#fee2e2",
      destructive: true,
      onPress: handleLogout,
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.duration(600)}>
        <LinearGradient
          colors={[COLORS.brand, COLORS.brandDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-6"
          style={{
            borderRadius: 32,
            shadowColor: COLORS.brand,
            shadowOffset: { width: 0, height: 16 },
            shadowOpacity: 0.35,
            shadowRadius: 24,
            elevation: 14,
            overflow: "hidden",
          }}
        >
          <View
            className="absolute"
            style={{
              right: -50,
              top: -50,
              width: 180,
              height: 180,
              borderRadius: 90,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />
          <View
            className="absolute"
            style={{
              left: -70,
              bottom: -70,
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />

          <View className="flex-row items-start justify-between">
            <View className="flex-row items-center gap-4 flex-1">
              <View
                className="bg-white/25 items-center justify-center"
                style={{ width: 76, height: 76, borderRadius: 38 }}
              >
                <Text className="text-white text-3xl font-extrabold">{initials}</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text
                    className="text-white text-lg font-extrabold flex-1"
                    numberOfLines={1}
                  >
                    {user?.phone_number}
                  </Text>
                  <Ionicons name="checkmark-circle" size={18} color="#86efac" />
                </View>
                {user?.country && (
                  <Text className="text-indigo-100 text-xs mt-1" numberOfLines={1}>
                    {user.country.flag} {user.country.name}
                  </Text>
                )}
                <View
                  className="self-start mt-2 px-3 py-1 flex-row items-center gap-1.5"
                  style={{ backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 100 }}
                >
                  <Ionicons name="star" size={10} color={COLORS.white} />
                  <Text className="text-white text-[10px] font-extrabold tracking-wider uppercase">
                    {tier.label}
                  </Text>
                </View>
              </View>
            </View>

            <AnimatedPressable onPress={() => router.push("/profile/edit")}>
              <View
                className="bg-white/20 items-center justify-center"
                style={{ width: 36, height: 36, borderRadius: 18 }}
              >
                <Ionicons name="pencil" size={16} color={COLORS.white} />
              </View>
            </AnimatedPressable>
          </View>

          <View className="flex-row items-center gap-2 mt-5 pt-5 border-t border-white/15">
            <Ionicons name="calendar-outline" size={13} color="#c7d2fe" />
            <Text className="text-indigo-100 text-xs font-medium">
              {formatMemberSince(user?.date_joined)}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(500).springify()} className="mt-4">
        <AnimatedPressable onPress={() => router.push("/(tabs)/plan")}>
          <View
            className="bg-white p-5 flex-row items-center gap-4"
            style={{
              borderRadius: 28,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 5,
            }}
          >
            <LinearGradient
              colors={[COLORS.brand, COLORS.brandDark]}
              className="p-3.5"
              style={{ borderRadius: 20 }}
            >
              <Ionicons name="wallet" size={22} color={COLORS.white} />
            </LinearGradient>
            <View className="flex-1">
              <Text className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                Credits Balance
              </Text>
              <View className="flex-row items-baseline gap-1.5 mt-0.5">
                <Text className="text-3xl font-extrabold text-gray-900">{user?.credits ?? 0}</Text>
                <Text className="text-sm text-gray-400 font-semibold">available</Text>
              </View>
            </View>
            <View
              className="bg-brand flex-row items-center gap-1 px-4 py-2"
              style={{ borderRadius: 100 }}
            >
              <Ionicons name="add" size={14} color={COLORS.white} />
              <Text className="text-white text-xs font-bold">Top up</Text>
            </View>
          </View>
        </AnimatedPressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(160).duration(500).springify()} className="mt-4">
        <View
          className="bg-white p-6 items-center"
          style={{
            borderRadius: 28,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 5,
          }}
        >
          <ReliabilityRing
            percentage={stats.reliability.percentage}
            label={stats.reliability.label}
            size={130}
            strokeWidth={12}
          />
          <View className="flex-row items-center gap-6 mt-5">
            <View className="items-center">
              <Text className="text-base font-extrabold text-emerald-600">
                {stats.reliability.answered}
              </Text>
              <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                Answered
              </Text>
            </View>
            <View className="w-px h-8 bg-gray-200" />
            <View className="items-center">
              <Text className="text-base font-extrabold text-red-500">
                {stats.reliability.missed}
              </Text>
              <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                Missed
              </Text>
            </View>
            <View className="w-px h-8 bg-gray-200" />
            <View className="items-center">
              <Text className="text-base font-extrabold text-brand">
                {stats.reliability.pending}
              </Text>
              <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                Pending
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(240).duration(500).springify()} className="mt-4 flex-row gap-3">
        <StatTile
          icon="layers-outline"
          label="Total"
          value={reminders.length}
          color={COLORS.brand}
          bgColor={COLORS.brandLight}
        />
        <StatTile
          icon="flame"
          label="Streak"
          value={stats.currentStreak}
          color="#d97706"
          bgColor="#fef3c7"
        />
        <StatTile
          icon="calendar-outline"
          label="This Month"
          value={stats.thisMonth}
          color="#059669"
          bgColor="#d1fae5"
        />
      </Animated.View>

      {payments.length > 0 && (
        <Animated.View entering={FadeInDown.delay(320).duration(500).springify()} className="mt-6">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
            Recent Purchases
          </Text>
          <View
            className="bg-white overflow-hidden"
            style={{
              borderRadius: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            {payments.slice(0, 3).map((p, i) => (
              <View
                key={p.id}
                className={`flex-row items-center gap-3 px-4 py-3.5 ${
                  i < Math.min(payments.length, 3) - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <View
                  className="bg-emerald-50 p-2"
                  style={{ borderRadius: 14 }}
                >
                  <Ionicons name="checkmark-circle" size={18} color="#059669" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-gray-800 capitalize">
                    {p.plan_id} · {p.credits} credits
                  </Text>
                  <Text className="text-[11px] text-gray-400 mt-0.5">
                    {formatPaymentDate(p.created_at)}
                  </Text>
                </View>
                <Text className="text-sm font-extrabold text-gray-900">
                  {formatPrice(p.amount_paise)}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      <Animated.View entering={FadeInDown.delay(400).duration(500).springify()} className="mt-6">
        <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
          Settings
        </Text>
        <View
          className="bg-white overflow-hidden"
          style={{
            borderRadius: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          {settingsItems.map((item, i) => (
            <SettingsRow
              key={item.id}
              item={item}
              isLast={i === settingsItems.length - 1}
            />
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

interface StatTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number | string;
  color: string;
  bgColor: string;
}

function StatTile({ icon, label, value, color, bgColor }: StatTileProps) {
  return (
    <View
      className="flex-1 bg-white p-4"
      style={{
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <View
        className="p-2 self-start mb-2"
        style={{ backgroundColor: bgColor, borderRadius: 14 }}
      >
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text className="text-2xl font-extrabold text-gray-900">{value}</Text>
      <Text className="text-[10px] text-gray-400 font-semibold mt-0.5">{label}</Text>
    </View>
  );
}

function SettingsRow({ item, isLast }: { item: SettingsRowItem; isLast: boolean }) {
  return (
    <AnimatedPressable onPress={item.onPress} scaleValue={0.98}>
      <View
        className={`flex-row items-center gap-3 px-4 py-3.5 ${
          isLast ? "" : "border-b border-gray-100"
        }`}
      >
        <View
          className="p-2.5"
          style={{ backgroundColor: item.iconBg, borderRadius: 14 }}
        >
          <Ionicons name={item.icon} size={18} color={item.iconColor} />
        </View>
        <View className="flex-1">
          <Text
            className={`text-[15px] font-bold ${
              item.destructive ? "text-red-500" : "text-gray-800"
            }`}
          >
            {item.label}
          </Text>
          {item.sublabel && (
            <Text className="text-[11px] text-gray-400 font-medium mt-0.5">{item.sublabel}</Text>
          )}
        </View>
        {!item.destructive && (
          <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
        )}
      </View>
    </AnimatedPressable>
  );
}
