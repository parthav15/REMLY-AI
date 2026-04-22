import "../global.css";

import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../src/context/AuthContext";
import { NotificationCountProvider } from "../src/context/NotificationCountContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NotificationCountProvider>
          <StatusBar style="dark" />
          <Slot />
        </NotificationCountProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
