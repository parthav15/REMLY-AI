import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { saveRemlyContact } from "../../src/utils/contacts";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [savingContact, setSavingContact] = useState(false);

  const handleSaveContact = async () => {
    setSavingContact(true);
    try {
      const saved = await saveRemlyContact();
      if (saved) {
        Alert.alert("Done", "Remly AI Assistant has been saved to your contacts. Calls won't be blocked as spam.");
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setSavingContact(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.profileCard}>
        <Text style={styles.phone}>{user?.phone_number}</Text>
        <Text style={styles.tz}>{user?.timezone}</Text>
        <View style={styles.creditBadge}>
          <Text style={styles.creditCount}>{user?.credits ?? 0}</Text>
          <Text style={styles.creditLabel}>credits</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Prevent Spam Blocking</Text>
      <Pressable
        style={styles.actionCard}
        onPress={handleSaveContact}
        disabled={savingContact}
      >
        <View>
          <Text style={styles.actionTitle}>
            {savingContact ? "Saving..." : "Save Remly AI to Contacts"}
          </Text>
          <Text style={styles.actionHint}>
            Ensures your phone won't block or silence our calls.
          </Text>
        </View>
      </Pressable>

      <Text style={styles.sectionTitle}>Account</Text>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  scroll: { padding: 20, paddingBottom: 60 },
  profileCard: {
    backgroundColor: "#4f46e5",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 32,
  },
  phone: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 4 },
  tz: { color: "#c7d2fe", fontSize: 14 },
  creditBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  creditCount: { color: "#fff", fontSize: 24, fontWeight: "800" },
  creditLabel: { color: "#c7d2fe", fontSize: 14, fontWeight: "500" },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 28,
  },
  actionTitle: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  actionHint: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  logoutButton: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  logoutText: { color: "#dc2626", fontSize: 16, fontWeight: "600" },
});
