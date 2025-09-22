import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

const Auth = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setError("");
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Save extra user info
        await addDoc(collection(db, "users"), {
          uid: userCredential.user.uid,
          email,
          firstName,
          lastName,
          gender,
          birthdate,
        });
        Alert.alert("Success", "Sign Up successful!");
        setIsSignUp(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert("Welcome back!", "Sign In successful!");
        router.replace("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <LinearGradient
      colors={["#19183B", "#0D0C24"]}
      start={[0, 0]}
      end={[0, 1]}
      style={styles.container}
    >
      <Text style={styles.title}>{isSignUp ? "Create Account" : "Welcome Back"}</Text>
      <Text style={styles.subtitle}>
        {isSignUp ? "Join WheelWise today 🚗" : "Sign in to continue your journey"}
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {isSignUp && (
        <>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#aaa"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#aaa"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Gender"
            placeholderTextColor="#aaa"
            value={gender}
            onChangeText={setGender}
          />
          <TextInput
            style={styles.input}
            placeholder="Birthdate (YYYY-MM-DD)"
            placeholderTextColor="#aaa"
            value={birthdate}
            onChangeText={setBirthdate}
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, isSignUp ? styles.signUpBtn : styles.signInBtn]}
        onPress={handleAuth}
      >
        <Text style={styles.buttonText}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.switchText}>
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don’t have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 30, fontWeight: "900", color: "#E8DFCA", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#aaa", marginBottom: 24, textAlign: "center" },
  error: {
    color: "#ffcccc",
    backgroundColor: "rgba(255,0,0,0.2)",
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    width: "100%",
    maxWidth: 320,
    marginVertical: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "white",
    fontSize: 16,
  },
  button: {
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    maxWidth: 100,
    alignItems: "center",
  },
  signInBtn: { backgroundColor: "#0BA6DF" },
  signUpBtn: { backgroundColor: "#34D399" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "700" },
  switchText: {
    color: "#E8DFCA",
    marginTop: 12,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default Auth;
