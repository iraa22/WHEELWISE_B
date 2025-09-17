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
        // Save extra user info to Firestore
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
        Alert.alert("Success", "Sign In successful!");
        router.replace("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <LinearGradient
      colors={["#E8DFCA", "#E8DFCA", "#19183B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {isSignUp && (
        <>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#ccc"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#ccc"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Gender"
            placeholderTextColor="#ccc"
            value={gender}
            onChangeText={setGender}
          />
          <TextInput
            style={styles.input}
            placeholder="Birthdate (YYYY-MM-DD)"
            placeholderTextColor="#ccc"
            value={birthdate}
            onChangeText={setBirthdate}
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.switchText}>
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    marginBottom: 24,
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  error: {
    color: "#ffdddd",
    backgroundColor: "rgba(167, 130, 130, 0.3)",
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
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    color: "white",
  },
  button: {
    marginVertical: 20,
    paddingVertical: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 8,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  switchText: {
    color: "white",
    marginTop: 12,
    textDecorationLine: "underline",
  },
});

export default Auth;
