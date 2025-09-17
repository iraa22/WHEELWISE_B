import { useState } from "react";
import { StyleSheet, Text, TextInput, Pressable, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGoals } from "../../hooks/useGoals";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const Create = () => {
  const [goal, setGoal] = useState("");
  const { createGoal, fetchGoals } = useGoals();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!goal.trim()) return;
    await createGoal({
      name: goal,
      progress: 0,
    });
    setGoal("");
    Keyboard.dismiss();
    await fetchGoals(); 
    router.push("/goals");
  };

  return (
    <LinearGradient
      colors={["#6D94C5", "#6D94C5", "#96A78D"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Create a New Booking</Text>

        <TextInput
          style={styles.input}
          placeholder="Where to go?"
          placeholderTextColor="#aaa"
          value={goal}
          onChangeText={setGoal}
        />

        <Pressable onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Add New Booking</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Create;

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
    marginBottom: 40,
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
});
