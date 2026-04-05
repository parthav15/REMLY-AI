import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SectionList,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import * as api from "../../src/api/client";
import ActivitySummary from "../../src/components/ActivitySummary";
import AnimatedPressable from "../../src/components/AnimatedPressable";
import GreetingHeader from "../../src/components/GreetingHeader";
import NextUpcoming from "../../src/components/NextUpcoming";
import QuickCreateFAB from "../../src/components/QuickCreateFAB";
import QuickStats from "../../src/components/QuickStats";
import SearchFilterBar from "../../src/components/SearchFilterBar";
import SwipeableReminderItem from "../../src/components/SwipeableReminderItem";
import { COLORS } from "../../src/constants";
import { useAuth } from "../../src/context/AuthContext";
import { useNotificationCount } from "../../src/context/NotificationCountContext";
import type { Reminder } from "../../src/types";

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: string }> = {
  pending: { bg: "bg-indigo-50", text: "text-brand", icon: "time-outline" },
  triggered: { bg: "bg-amber-50", text: "text-amber-600", icon: "call-outline" },
  answered: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "checkmark-circle-outline" },
  missed: { bg: "bg-red-50", text: "text-red-500", icon: "close-circle-outline" },
};

const STATUS_ICON_COLOR: Record<string, string> = {
  pending: COLORS.brand,
  triggered: "#d97706",
  answered: "#059669",
  missed: "#ef4444",
};

function getSectionTitle(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + (7 - today.getDay()));

  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (target.getTime() === today.getTime()) return "Today";
  if (target.getTime() === tomorrow.getTime()) return "Tomorrow";
  if (target >= today && target < endOfWeek) return "This Week";
  if (target < today) return "Past";
  return "Later";
}

const SECTION_ORDER = ["Today", "Tomorrow", "This Week", "Later", "Past"];

export default function HomeScreen() {
  const { user, refreshUser } = useAuth();
  const { setCount: setNotifCount } = useNotificationCount();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReminders = useCallback(async () => {
    try {
      const data = await api.getReminders();
      setReminders(data);
      setNotifCount(data.filter((r) => r.status === "triggered" || r.status === "missed").length);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReminders();
      refreshUser();
    }, [fetchReminders, refreshUser])
  );

  const filteredReminders = useMemo(() => {
    let result = reminders;
    if (activeFilter) {
      result = result.filter((r) => r.status === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((r) => r.message.toLowerCase().includes(q));
    }
    return result;
  }, [reminders, activeFilter, searchQuery]);

  const sections = useMemo(() => {
    const groups: Record<string, Reminder[]> = {};
    for (const r of filteredReminders) {
      const title = getSectionTitle(r.scheduled_at);
      if (!groups[title]) groups[title] = [];
      groups[title].push(r);
    }
    return SECTION_ORDER.filter((t) => groups[t]?.length).map((title) => ({
      title,
      data: groups[title],
    }));
  }, [filteredReminders]);

  const handleDelete = (id: string) => {
    Alert.alert("Cancel Reminder", "This will refund 1 credit.", [
      { text: "Keep", style: "cancel" },
      {
        text: "Cancel It",
        style: "destructive",
        onPress: async () => {
          await api.deleteReminder(id);
          fetchReminders();
          refreshUser();
        },
      },
    ]);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const renderItem = ({ item, index }: { item: Reminder; index: number }) => {
    const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.pending;
    const iconColor = STATUS_ICON_COLOR[item.status] ?? COLORS.brand;
    return (
      <Animated.View entering={FadeInDown.delay(index * 80).duration(400).springify()}>
        <SwipeableReminderItem
          enabled={item.status === "pending"}
          onDelete={() => handleDelete(item.id)}
        >
          <AnimatedPressable
            onLongPress={() => item.status === "pending" && handleDelete(item.id)}
            scaleValue={0.98}
          >
            <View
              className="bg-white rounded-3xl p-5 mb-3"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
                elevation: 3,
              }}
            >
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="calendar-outline" size={14} color={COLORS.textTertiary} />
                  <Text className="text-sm text-gray-400 font-medium">{formatDate(item.scheduled_at)}</Text>
                </View>
                <View className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full ${cfg.bg}`}>
                  <Ionicons name={cfg.icon as any} size={12} color={iconColor} />
                  <Text className={`text-xs font-bold uppercase ${cfg.text}`}>{item.status}</Text>
                </View>
              </View>
              <Text className="text-base font-semibold text-gray-800 leading-6">{item.message}</Text>
              {item.is_recurring && (
                <View className="flex-row items-center gap-1.5 mt-3">
                  <Ionicons name="repeat-outline" size={14} color={COLORS.brand} />
                  <Text className="text-xs text-brand font-semibold">Repeats daily</Text>
                </View>
              )}
            </View>
          </AnimatedPressable>
        </SwipeableReminderItem>
      </Animated.View>
    );
  };

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View className="px-4 pt-4 pb-2 bg-gray-50">
      <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider">{section.title}</Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color={COLORS.brand} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={
          sections.length === 0
            ? { flexGrow: 1, justifyContent: "center", alignItems: "center" }
            : { paddingHorizontal: 16, paddingBottom: 80 }
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchReminders();
            }}
            tintColor={COLORS.brand}
          />
        }
        ListHeaderComponent={
          <View>
            <GreetingHeader />

            <Animated.View entering={FadeIn.duration(500)}>
              <Pressable onPress={() => router.push("/credits")}>
                <LinearGradient
                  colors={[COLORS.brand, COLORS.brandDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="mx-4 mt-1 rounded-2xl px-5 py-4 flex-row justify-between items-center"
                  style={{
                    shadowColor: COLORS.brand,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 6,
                  }}
                >
                  <View>
                    <Text className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">
                      Credits remaining
                    </Text>
                    <Text className="text-white text-3xl font-extrabold mt-0.5">
                      {user?.credits ?? 0}
                    </Text>
                  </View>
                  <View className="bg-white/20 rounded-full p-3">
                    <Ionicons name="add-circle" size={24} color={COLORS.white} />
                  </View>
                </LinearGradient>
              </Pressable>
            </Animated.View>

            <View className="mt-3">
              <ActivitySummary reminders={reminders} />
            </View>

            <NextUpcoming reminders={reminders} />

            <View className="mt-2">
              <SearchFilterBar value={searchQuery} onChangeText={setSearchQuery} />
            </View>

            <QuickStats
              reminders={reminders}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </View>
        }
        ListEmptyComponent={
          <Animated.View entering={FadeIn.delay(200).duration(600)} className="items-center px-8">
            <View className="bg-indigo-50 rounded-full p-6 mb-5">
              <Ionicons name="notifications-off-outline" size={40} color={COLORS.brand} />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              {searchQuery || activeFilter ? "No matching reminders" : "No reminders yet"}
            </Text>
            <Text className="text-sm text-gray-400 text-center leading-5">
              {searchQuery || activeFilter
                ? "Try adjusting your search or filters."
                : "Create your first reminder and we'll call you when it's time."}
            </Text>
          </Animated.View>
        }
      />

      <QuickCreateFAB />
    </View>
  );
}
