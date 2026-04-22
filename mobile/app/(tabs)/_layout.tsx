import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, TAB_BAR } from "../../src/constants";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

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
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarLabel: "Search",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "New Reminder",
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <View
              style={{
                marginTop: -36,
                shadowColor: "#10b981",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.45,
                shadowRadius: 16,
                elevation: 14,
              }}
            >
              <LinearGradient
                colors={["#10b981", "#059669"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 4,
                  borderColor: COLORS.white,
                }}
              >
                <Ionicons name="add" size={40} color={COLORS.white} />
              </LinearGradient>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: "Plan",
          tabBarLabel: "Plan",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "card" : "card-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
