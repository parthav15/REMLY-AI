import "../global.css";

import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { AuthProvider } from "../src/context/AuthContext";
import { NotificationCountProvider } from "../src/context/NotificationCountContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <NotificationCountProvider>
        <StatusBar style="dark" />
        <Slot />
      </NotificationCountProvider>
    </AuthProvider>
  );
}
