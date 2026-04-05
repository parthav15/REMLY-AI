import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { COLORS } from "../constants";
import AnimatedPressable from "./AnimatedPressable";

interface TimezonePickerProps {
  timezones: string[];
  selected: string;
  onSelect: (tz: string) => void;
}

export default function TimezonePicker({ timezones, selected, onSelect }: TimezonePickerProps) {
  const [visible, setVisible] = useState(false);

  if (timezones.length <= 1) {
    return (
      <View className="rounded-2xl px-5 py-4 bg-gray-100 border border-gray-200 mb-3">
        <Text className="text-base text-gray-500 font-medium">{selected || "No timezone"}</Text>
      </View>
    );
  }

  return (
    <>
      <AnimatedPressable onPress={() => setVisible(true)}>
        <View
          className="rounded-2xl px-5 py-4 bg-white flex-row items-center justify-between mb-3 border border-gray-100"
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="globe-outline" size={18} color={COLORS.brand} />
            <Text className="text-base text-gray-800 font-semibold">{selected}</Text>
          </View>
          <Ionicons name="chevron-down" size={18} color={COLORS.textTertiary} />
        </View>
      </AnimatedPressable>

      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View className="flex-1 bg-gray-50">
          <View className="bg-white px-5 pt-5 pb-4 border-b border-gray-100 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">Select Timezone</Text>
            <Pressable
              onPress={() => setVisible(false)}
              className="bg-gray-100 rounded-full p-2"
            >
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </Pressable>
          </View>

          <FlatList
            data={timezones}
            keyExtractor={(item) => item}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => (
              <AnimatedPressable
                onPress={() => { onSelect(item); setVisible(false); }}
                scaleValue={0.99}
              >
                <View
                  className={`flex-row items-center mx-4 my-1 px-4 py-4 rounded-xl ${
                    selected === item ? "bg-indigo-50 border border-brand/20" : "bg-white"
                  }`}
                >
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={selected === item ? COLORS.brand : COLORS.textTertiary}
                    style={{ marginRight: 12 }}
                  />
                  <Text className={`text-base flex-1 ${selected === item ? "text-brand font-semibold" : "text-gray-800"}`}>
                    {item}
                  </Text>
                  {selected === item && (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.brand} />
                  )}
                </View>
              </AnimatedPressable>
            )}
          />
        </View>
      </Modal>
    </>
  );
}
