import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NotificationBell from "../../src/components/NotificationBell";
import { COLORS, TAB_BAR } from "../../src/constants";
import { useNotificationCount } from "../../src/context/NotificationCountContext";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { count: notifCount } = useNotificationCount();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.brand,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          paddingBottom: Math.max(insets.bottom, Platform.OS === "ios" ? TAB_BAR.PADDING_BOTTOM_IOS : TAB_BAR.PADDING_BOTTOM_ANDROID),
          paddingTop: TAB_BAR.PADDING_TOP + 4,
          height: (Platform.OS === "ios" ? TAB_BAR.HEIGHT_IOS : TAB_BAR.HEIGHT_ANDROID) + insets.bottom,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: COLORS.white,
          elevation: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: { fontWeight: "700", fontSize: 18 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Reminders",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
          ),
          headerRight: () => (
            <View style={{ marginRight: 16 }}>
              <NotificationBell count={notifCount} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "New Reminder",
          tabBarLabel: "Create",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "settings" : "settings-outline"} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
