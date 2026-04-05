import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as api from "../../src/api/client";
import { useAuth } from "../../src/context/AuthContext";
import type { Reminder } from "../../src/types";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "#e0e7ff", text: "#4f46e5" },
  triggered: { bg: "#fef3c7", text: "#d97706" },
  answered: { bg: "#d1fae5", text: "#059669" },
  missed: { bg: "#fee2e2", text: "#dc2626" },
};

export default function HomeScreen() {
  const { user, refreshUser } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReminders = useCallback(async () => {
    try {
      const data = await api.getReminders();
      setReminders(data);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReminders();
      refreshUser();
    }, [fetchReminders, refreshUser])
  );

  const handleDelete = (id: string) => {
    Alert.alert("Cancel Reminder", "This will refund 1 credit.", [
      { text: "Keep", style: "cancel" },
      {
        text: "Cancel It",
        style: "destructive",
        onPress: async () => {
          await api.deleteReminder(id);
          fetchReminders();
          refreshUser();
        },
      },
    ]);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const renderItem = ({ item }: { item: Reminder }) => {
    const colors = STATUS_COLORS[item.status] || STATUS_COLORS.pending;
    return (
      <Pressable
        style={styles.card}
        onLongPress={() => item.status === "pending" && handleDelete(item.id)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>{formatDate(item.scheduled_at)}</Text>
          <View style={[styles.badge, { backgroundColor: colors.bg }]}>
            <Text style={[styles.badgeText, { color: colors.text }]}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.cardMessage}>{item.message}</Text>
        {item.is_recurring && <Text style={styles.recurring}>Recurring daily</Text>}
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.creditBar}>
        <Text style={styles.creditText}>Credits remaining</Text>
        <Text style={styles.creditCount}>{user?.credits ?? 0}</Text>
      </View>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={reminders.length === 0 ? styles.center : styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchReminders();
            }}
            tintColor="#4f46e5"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No reminders yet</Text>
            <Text style={styles.emptySubtitle}>
              Create one and we'll call you when it's time.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  creditBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4f46e5",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  creditText: { color: "#c7d2fe", fontSize: 14, fontWeight: "500" },
  creditCount: { color: "#fff", fontSize: 20, fontWeight: "800" },
  list: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardDate: { fontSize: 13, color: "#6b7280", fontWeight: "500" },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 100 },
  badgeText: { fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  cardMessage: { fontSize: 16, fontWeight: "600", color: "#1f2937", lineHeight: 22 },
  recurring: { fontSize: 12, color: "#4f46e5", fontWeight: "600", marginTop: 8 },
  empty: { alignItems: "center", paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#1f2937", marginBottom: 4 },
  emptySubtitle: { fontSize: 14, color: "#6b7280", textAlign: "center", maxWidth: 240 },
});
