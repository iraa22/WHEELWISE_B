import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Home() {
  const [user, setUser] = useState(undefined);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/authentication/auth"); // Redirect to auth if not logged in
      }
      setUser(firebaseUser || null);
    });
    return unsubscribe;
  }, []);

  if (user === undefined || !user) {
    return (
      <LinearGradient
        colors={["#19183B", "#0D0C24"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#0BA6DF" />
        <Text style={{ color: "white", marginTop: 10, fontSize: 16 }}>
          Redirecting to Sign In...
        </Text>
      </LinearGradient>
    );
  }

  // Logged-in user view
  return (
    <LinearGradient
      colors={["#19183B", "#0D0C24"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>🚗 WheelWise</Text>
      <Text style={styles.subtitle}>Your Smart Booking Companion</Text>

      <Pressable
        style={({ pressed }) => [
          styles.glassButton,
          pressed && { transform: [{ scale: 0.97 }] },
        ]}
        onPress={() => router.push("/goals")}
      >
        <Text style={styles.linkText}>📖 View Your Bookings</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.glassButton,
          pressed && { transform: [{ scale: 0.97 }] },
        ]}
        onPress={() => router.push("/goals/create")}
      >
        <Text style={styles.linkText}>➕ Add a New Booking</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    marginTop: 20,
    fontSize: 34,
    fontWeight: "900",
    color: "#E8DFCA",
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  glassButton: {
    marginVertical: 20,
    paddingVertical: 22,
    paddingHorizontal: 28,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    alignItems: "center",
    width: "50%",
  },
  linkText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
