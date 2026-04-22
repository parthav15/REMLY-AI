import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import * as api from "../../src/api/client";
import PremiumInput from "../../src/components/PremiumInput";
import PremiumReminderCard from "../../src/components/PremiumReminderCard";
import { COLORS } from "../../src/constants";
import type { Reminder } from "../../src/types";

export default function SearchScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [query, setQuery] = useState("");

  const fetchReminders = useCallback(async () => {
    try {
      const data = await api.getReminders();
      setReminders(data);
    } catch {}
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReminders();
    }, [fetchReminders])
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return reminders.filter((r) => r.message.toLowerCase().includes(q));
  }, [reminders, query]);

  const renderItem = ({ item, index }: { item: Reminder; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(350).springify()}>
      <PremiumReminderCard reminder={item} />
    </Animated.View>
  );

  const hasQuery = query.trim().length > 0;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-5 pt-4 pb-2">
        <View className="relative">
          <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
            <Ionicons name="search" size={18} color={COLORS.textTertiary} />
          </View>
          <PremiumInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search your reminders..."
            autoCorrect={false}
            autoCapitalize="none"
            style={{ paddingLeft: 44 }}
          />
        </View>
      </View>

      {hasQuery && filtered.length > 0 && (
        <View className="px-6 pt-2 pb-1">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
          </Text>
        </View>
      )}

      {!hasQuery ? (
        <Animated.View entering={FadeIn.delay(150).duration(500)} className="flex-1 items-center px-10 pt-16">
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
              <Ionicons name="search-outline" size={36} color={COLORS.brand} />
            </View>
          </View>
          <Text className="text-xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Search your reminders
          </Text>
          <Text className="text-sm text-gray-400 text-center leading-5 max-w-[280px]">
            Find any reminder by its content
          </Text>
        </Animated.View>
      ) : filtered.length === 0 ? (
        <Animated.View entering={FadeIn.duration(300)} className="flex-1 items-center px-10 pt-16">
          <View
            className="bg-white rounded-full p-8 mb-6"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 16,
              elevation: 3,
            }}
          >
            <View className="bg-gray-100 rounded-full p-5">
              <Ionicons name="search-outline" size={36} color={COLORS.textTertiary} />
            </View>
          </View>
          <Text className="text-xl font-extrabold text-gray-900 mb-2 tracking-tight">
            No matches found
          </Text>
          <Text className="text-sm text-gray-400 text-center leading-5 max-w-[280px]">
            Try different keywords
          </Text>
        </Animated.View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}
