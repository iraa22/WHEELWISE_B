import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback } from "react";
import { useGoals } from "../../hooks/useGoals";
import { useRouter, useFocusEffect } from "expo-router"; // ✅ useFocusEffect from expo-router
import { LinearGradient } from "expo-linear-gradient";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=Traveler&background=0BA6DF&color=fff&size=256";

const Goals = () => {
  const { goals, fetchGoals, deleteGoal } = useGoals();
  const router = useRouter();

  // ✅ Fetch whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [])
  );

  const handleEdit = (goal) => {
    router.push({
      pathname: "/goals/updategoals",
      params: { id: goal.id },
    });
  };

  const handleDelete = (id) => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to delete this booking?")) {
        deleteGoal(id);
      }
    } else {
      Alert.alert(
        "Delete Booking",
        "Are you sure you want to delete this booking?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => await deleteGoal(id),
          },
        ]
      );
    }
  };

  return (
    <LinearGradient colors={["#19183B", "#0D0C24"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Your Bookings</Text>

        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Avatar */}
              <Image
                source={{ uri: item.image || DEFAULT_AVATAR }}
                style={styles.avatar}
              />

              {/* Info */}
              <View style={styles.info}>
                <Text style={styles.name}>
                  {item.travelerName || "Unnamed Traveler"}
                </Text>
                <Text style={styles.destination}>
                  Destination: {item.destination || "Unknown"}
                </Text>
                <Text style={styles.meta}>
                  Date: {item.date || "N/A"}
                </Text>
                <Text style={styles.meta}>
                  Time: {item.time || "N/A"}
                </Text>
                <Text style={styles.meta}>
                  Car: {item.car || "Not selected"}
                </Text>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <Pressable
                  style={[styles.actionBtn, styles.editBtn]}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No bookings found.</Text>
          }
        />

        {/* 🚀 Floating Action Button */}
        <Pressable
          style={styles.fab}
          onPress={() => router.push("/goals/create")}
        >
          <Text style={styles.fabText}>＋</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Goals;

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#E8DFCA",
    textAlign: "center",
    marginBottom: 24,
  },
  list: { paddingBottom: 80 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#0BA6DF",
    marginRight: 14,
  },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: "700", color: "white" },
  destination: { fontSize: 14, color: "#aaa", marginTop: 4 },
  meta: { fontSize: 13, color: "#bbb", marginTop: 2 },
  actions: { flexDirection: "row", gap: 8 },
  actionBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  editBtn: { backgroundColor: "rgba(59,130,246,0.2)" },
  deleteBtn: { backgroundColor: "rgba(239,68,68,0.2)" },
  editText: { color: "#3b82f6", fontWeight: "600" },
  deleteText: { color: "#ef4444", fontWeight: "600" },
  empty: { textAlign: "center", color: "#aaa", marginTop: 50, fontSize: 16 },

  // 🚀 Floating Action Button
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#0BA6DF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
    marginBottom: 2,
  },
});
