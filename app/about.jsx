import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function About() {
  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>WheelWise</Text>
        <Text style={styles.subtitle}>
          "WheelWise is your smart booking companion designed to simplify the way you plan and manage your travels. Whether you’re booking for yourself, family, or friends, WheelWise helps you stay organized by keeping all your traveler details and destinations in one place. With a clean interface and easy-to-use features, it ensures that every booking is quick, reliable, and stress-free. WheelWise keeps you moving forward, one journey at a time."
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#E8DFCA",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
  },
});
