import { useState } from "react";
import { StyleSheet, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGoals } from "../../hooks/useGoals";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const UpdateGoals = () => {
  const { id, name: initialName = "", progress: initialProgress = 0 } = useLocalSearchParams();
  const [name, setName] = useState(initialName);
  const [progress, setProgress] = useState(String(initialProgress));
  const { updateGoal } = useGoals();
  const router = useRouter();

  if (!id) {
    return (
      <LinearGradient
        colors={["#6D94C5", "#6D94C5", "#96A78D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safe}>
          <Text style={styles.title}>Update Booking</Text>
          <Text style={styles.warning}>Please click Edit in your inserted booking.</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const handleUpdate = async () => {
    if (!name.trim() || isNaN(progress)) return;
    await updateGoal(id, {
      name,
      progress: Number(progress),
    });
    router.replace("/goals");
  };

  return (
    <LinearGradient
      colors={["#6a5a6eff", "#915077ff", "#4facfe"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Update Bookings</Text>

        <TextInput
          style={styles.input}
          placeholder="Goal Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Progress"
          placeholderTextColor="#aaa"
          value={progress}
          onChangeText={setProgress}
          keyboardType="numeric"
        />

        <Pressable onPress={handleUpdate} style={styles.button}>
          <Text style={styles.buttonText}>Update Bookings</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default UpdateGoals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "95%",
    maxWidth: 400,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    width: "95%",
    maxWidth: 400,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  warning: {
  color: "dark red",             // text white
  fontSize: 16,
  textAlign: "center",
  marginTop: 20,
  padding: 12,
  borderRadius: 8,
},
});
