import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import * as api from "../../src/api/client";
import { useAuth } from "../../src/context/AuthContext";

export default function CreateScreen() {
  const { user, refreshUser } = useAuth();
  const [message, setMessage] = useState("");
  const [date, setDate] = useState(new Date(Date.now() + 60 * 60 * 1000)); // 1 hour from now
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a reminder message.");
      return;
    }
    if (date <= new Date()) {
      Alert.alert("Error", "Scheduled time must be in the future.");
      return;
    }
    if ((user?.credits ?? 0) < 1) {
      Alert.alert("No Credits", "You need at least 1 credit to create a reminder.");
      return;
    }

    setLoading(true);
    try {
      await api.createReminder(message.trim(), date.toISOString(), recurring);
      await refreshUser();
      Alert.alert("Reminder Set", "We'll call you when it's time.", [
        { text: "OK", onPress: () => router.navigate("/(tabs)") },
      ]);
      setMessage("");
      setDate(new Date(Date.now() + 60 * 60 * 1000));
      setRecurring(false);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>What should we remind you?</Text>
        <TextInput
          style={styles.messageInput}
          placeholder="e.g. Take your meds, Join the Zoom call, Stop gaming..."
          placeholderTextColor="#a0a0a0"
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />

        <Text style={styles.label}>When should we call?</Text>
        <View style={styles.dateRow}>
          <Pressable style={styles.datePicker} onPress={() => setShowDate(true)}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </Pressable>
          <Pressable style={styles.datePicker} onPress={() => setShowTime(true)}>
            <Text style={styles.dateText}>{formatTime(date)}</Text>
          </Pressable>
        </View>

        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            minimumDate={new Date()}
            onChange={(_, selected) => {
              setShowDate(false);
              if (selected) {
                const updated = new Date(date);
                updated.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
                setDate(updated);
              }
            }}
          />
        )}
        {showTime && (
          <DateTimePicker
            value={date}
            mode="time"
            onChange={(_, selected) => {
              setShowTime(false);
              if (selected) {
                const updated = new Date(date);
                updated.setHours(selected.getHours(), selected.getMinutes());
                setDate(updated);
              }
            }}
          />
        )}

        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Repeat daily</Text>
            <Text style={styles.switchHint}>We'll call you at the same time every day</Text>
          </View>
          <Switch
            value={recurring}
            onValueChange={setRecurring}
            trackColor={{ true: "#4f46e5", false: "#e5e7eb" }}
            thumbColor="#fff"
          />
        </View>

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Setting reminder..." : "Set Reminder (1 credit)"}
          </Text>
        </Pressable>

        <Text style={styles.creditsHint}>
          You have {user?.credits ?? 0} credits remaining.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 24, paddingBottom: 60 },
  label: { fontSize: 14, fontWeight: "700", color: "#374151", marginBottom: 8, marginTop: 24 },
  messageInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: "#f9fafb",
    lineHeight: 22,
  },
  dateRow: { flexDirection: "row", gap: 12 },
  datePicker: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#f9fafb",
  },
  dateText: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  switchLabel: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  switchHint: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  button: {
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 32,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  creditsHint: { fontSize: 13, color: "#9ca3af", textAlign: "center", marginTop: 12 },
});
