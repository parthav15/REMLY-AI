import React from "react";
import { Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import AnimatedPressable from "./AnimatedPressable";

interface SwipeableReminderItemProps {
  children: React.ReactNode;
  onDelete: () => void;
  enabled: boolean;
}

export default function SwipeableReminderItem({
  children,
  onDelete,
  enabled,
}: SwipeableReminderItemProps) {
  if (!enabled) {
    return <>{children}</>;
  }

  const renderRightActions = () => (
    <AnimatedPressable
      onPress={onDelete}
      style={{
        width: 80,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        backgroundColor: "#ef4444",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name="trash-outline" size={22} color="white" />
      <Text className="text-xs font-semibold text-white mt-1">Delete</Text>
    </AnimatedPressable>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      {children}
    </Swipeable>
  );
}
