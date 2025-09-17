// 📂 app/goals/index.jsx
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useGoals } from "../../hooks/useGoals";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const Goals = () => {
  const { goals, fetchGoals, deleteGoal } = useGoals();
  const router = useRouter();

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleEdit = (goal) => {
    router.push({
      pathname: "/goals/updategoals",
      params: {
        id: goal.id,
        name: goal.name,
        progress: goal.progress,
      },
    });
  };

  const handleDelete = (id) => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to delete this goal?")) {
        deleteGoal(id);
      }
    } else {
      Alert.alert("Delete Goal", "Are you sure you want to delete this goal?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => await deleteGoal(id) },
      ]);
    }
  };

  return (
    <LinearGradient
      colors={["#E8DFCA", "#E8DFCA", "#4facfe"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Your Bookings</Text>

        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.goalItem}>
              <Text style={styles.goalText}>{item.name || "Untitled Goal"}</Text>
              <Text style={styles.progress}>Progress: {item.progress ?? "N/A"}</Text>

              <View style={styles.actions}>
                <Pressable style={[styles.button, styles.editButton]} onPress={() => handleEdit(item)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </Pressable>
                <Pressable style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No bookings found.</Text>}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Goals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
    padding: 20,
  },
  list: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 30,
  },
  goalItem: {
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignSelf: "center", 
    width: "95%", 
    maxWidth: 420, 
  },
  goalText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  progress: {
    marginTop: 4,
    fontSize: 14,
    color: "#c5bfbfff",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  deleteButton: {
    backgroundColor: "#E8DFCA",
  },
  buttonText: {
    color: "black",
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    color: "black",
    marginTop: 40,
    fontSize: 16,
  },
});
