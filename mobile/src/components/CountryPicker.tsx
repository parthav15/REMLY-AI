import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { COLORS } from "../constants";
import type { Country } from "../types";
import AnimatedPressable from "./AnimatedPressable";

interface CountryPickerProps {
  countries: Country[];
  selected: Country | null;
  onSelect: (country: Country) => void;
}

export default function CountryPicker({ countries, selected, onSelect }: CountryPickerProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return countries;
    const q = search.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.iso_code.toLowerCase().includes(q) ||
        c.calling_code.includes(q)
    );
  }, [countries, search]);

  const handleSelect = (country: Country) => {
    onSelect(country);
    setVisible(false);
    setSearch("");
  };

  return (
    <>
      <AnimatedPressable onPress={() => setVisible(true)}>
        <View
          className="rounded-2xl px-5 py-4 bg-white flex-row items-center justify-between mb-3 border border-gray-100"
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
        >
          {selected ? (
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">{selected.flag}</Text>
              <Text className="text-base text-gray-800 font-semibold">{selected.name}</Text>
              <Text className="text-sm text-gray-400 font-medium">{selected.calling_code}</Text>
            </View>
          ) : (
            <Text className="text-base text-gray-300 font-medium">Select your country</Text>
          )}
          <Ionicons name="chevron-down" size={18} color={COLORS.textTertiary} />
        </View>
      </AnimatedPressable>

      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View className="flex-1 bg-gray-50">
          <View className="bg-white px-5 pt-5 pb-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900">Select Country</Text>
              <Pressable
                onPress={() => { setVisible(false); setSearch(""); }}
                className="bg-gray-100 rounded-full p-2"
              >
                <Ionicons name="close" size={20} color={COLORS.textSecondary} />
              </Pressable>
            </View>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 gap-2">
              <Ionicons name="search" size={18} color={COLORS.textTertiary} />
              <TextInput
                className="flex-1 text-base text-gray-800"
                placeholder="Search countries..."
                placeholderTextColor={COLORS.placeholder}
                value={search}
                onChangeText={setSearch}
                autoFocus
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch("")}>
                  <Ionicons name="close-circle" size={18} color={COLORS.textTertiary} />
                </Pressable>
              )}
            </View>
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.iso_code}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => (
              <AnimatedPressable onPress={() => handleSelect(item)} scaleValue={0.99}>
                <View
                  className={`flex-row items-center mx-4 my-1 px-4 py-3.5 rounded-xl ${
                    selected?.id === item.id ? "bg-indigo-50 border border-brand/20" : "bg-white"
                  }`}
                >
                  <Text className="text-2xl mr-3">{item.flag}</Text>
                  <Text className="text-base text-gray-800 font-medium flex-1">{item.name}</Text>
                  <Text className="text-sm text-gray-400 font-semibold">{item.calling_code}</Text>
                  {selected?.id === item.id && (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.brand} style={{ marginLeft: 8 }} />
                  )}
                </View>
              </AnimatedPressable>
            )}
            ListEmptyComponent={
              <Animated.View entering={FadeIn.duration(300)} className="items-center py-16">
                <Ionicons name="globe-outline" size={40} color={COLORS.textTertiary} />
                <Text className="text-gray-400 text-base mt-3">No countries found</Text>
              </Animated.View>
            }
          />
        </View>
      </Modal>
    </>
  );
}
