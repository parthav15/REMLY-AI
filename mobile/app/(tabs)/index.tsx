import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SectionList,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as api from "../../src/api/client";
import ActivitySummary from "../../src/components/ActivitySummary";
import AnimatedPressable from "../../src/components/AnimatedPressable";
import GreetingHeader from "../../src/components/GreetingHeader";
import NextUpcoming from "../../src/components/NextUpcoming";
import PremiumCreditCard from "../../src/components/PremiumCreditCard";
import PremiumReminderCard from "../../src/components/PremiumReminderCard";
import QuickStats from "../../src/components/QuickStats";
import SearchFilterBar from "../../src/components/SearchFilterBar";
import SideDrawer from "../../src/components/SideDrawer";
import SwipeableReminderItem from "../../src/components/SwipeableReminderItem";
import { COLORS } from "../../src/constants";
import { useAuth } from "../../src/context/AuthContext";
import { useNotificationCount } from "../../src/context/NotificationCountContext";
import type { Reminder } from "../../src/types";

const SECTION_META: Record<string, { icon: string; gradient: [string, string] }> = {
  Today: { icon: "sunny-outline", gradient: [COLORS.brand, COLORS.brandDark] },
  Tomorrow: { icon: "arrow-forward-outline", gradient: [COLORS.brand, COLORS.brandDark] },
  "This Week": { icon: "calendar-outline", gradient: [COLORS.brand, COLORS.brandDark] },
  Later: { icon: "time-outline", gradient: [COLORS.brand, COLORS.brandDark] },
  Past: { icon: "archive-outline", gradient: ["#9ca3af", "#6b7280"] },
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
  const insets = useSafeAreaInsets();
  const { user, refreshUser } = useAuth();
  const { setCount: setNotifCount } = useNotificationCount();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);

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

  const renderItem = ({ item, index }: { item: Reminder; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(400).springify()}>
      <SwipeableReminderItem
        enabled={item.status === "pending"}
        onDelete={() => handleDelete(item.id)}
      >
        <PremiumReminderCard
          reminder={item}
          onLongPress={() => item.status === "pending" && handleDelete(item.id)}
        />
      </SwipeableReminderItem>
    </Animated.View>
  );

  const renderSectionHeader = ({ section }: { section: { title: string; data: Reminder[] } }) => {
    const meta = SECTION_META[section.title] ?? SECTION_META.Later;
    const isPast = section.title === "Past";
    return (
      <View className="px-1 pt-5 pb-3 bg-gray-50">
        <View className="flex-row items-center gap-2.5">
          <View
            className="rounded-lg p-1.5"
            style={{
              backgroundColor: isPast ? "#f3f4f6" : COLORS.brandLight,
            }}
          >
            <Ionicons
              name={meta.icon as any}
              size={13}
              color={isPast ? COLORS.textTertiary : COLORS.brand}
            />
          </View>
          <Text className="text-[13px] font-extrabold text-gray-800 uppercase tracking-[1.5px]">
            {section.title}
          </Text>
          <View className="flex-1 h-[1px] bg-gray-200" />
          <View className="bg-white rounded-full px-2.5 py-0.5 border border-gray-200">
            <Text className="text-[11px] font-bold text-gray-500">{section.data.length}</Text>
          </View>
        </View>
      </View>
    );
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
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
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
            <View
              className="flex-row items-center justify-between px-5 pb-3"
              style={{ paddingTop: insets.top + 8 }}
            >
              <View className="flex-1">
                <GreetingHeader />
              </View>
              <AnimatedPressable onPress={() => setDrawerVisible(true)} className="p-2 -mr-2">
                <Ionicons name="menu" size={26} color={COLORS.textPrimary} />
              </AnimatedPressable>
            </View>

            <PremiumCreditCard credits={user?.credits ?? 0} />

            <View className="mt-4">
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
          <Animated.View entering={FadeIn.delay(200).duration(600)} className="items-center px-10 py-16">
            <View
              className="bg-white rounded-full p-8 mb-6"
              style={{
                shadowColor: COLORS.brand,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 20,
                elevation: 6,
              }}
            >
              <View className="bg-indigo-50 rounded-full p-5">
                <Ionicons
                  name={searchQuery || activeFilter ? "search-outline" : "notifications-outline"}
                  size={36}
                  color={COLORS.brand}
                />
              </View>
            </View>
            <Text className="text-xl font-extrabold text-gray-900 mb-2 tracking-tight">
              {searchQuery || activeFilter ? "Nothing matches" : "No reminders yet"}
            </Text>
            <Text className="text-sm text-gray-400 text-center leading-5 max-w-[280px]">
              {searchQuery || activeFilter
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Tap the + button below and we'll call you exactly when it matters."}
            </Text>
          </Animated.View>
        }
      />
      <SideDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </View>
  );
}
