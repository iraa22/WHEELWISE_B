import { View, Text, StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";

export default function Profile() {
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Welcome, {user.displayName || "User"} 👋</Text>
          <Text style={styles.info}>Email: {user.email}</Text>
        </>
      ) : (
        <Text style={styles.info}>No user is signed in</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d0b33",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: "#fff",
  },
});
