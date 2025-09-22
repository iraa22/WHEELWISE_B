import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=Traveler&background=0BA6DF&color=fff&size=256";

const Create = () => {
  const [travelerName, setTravelerName] = useState("");
  const [destination, setDestination] = useState("");
  const [image, setImage] = useState(DEFAULT_AVATAR);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // ✅ Pick image (web + mobile)
  const pickImage = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
          await uploadImage(file);
        } else {
          Alert.alert("Error", "Please select a valid image file.");
        }
      };
      input.click();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled) {
        const fileUri = result.assets[0].uri;
        await uploadImage(fileUri, true);
      }
    }
  };

  // ✅ Upload image to Firebase Storage
  const uploadImage = async (file, isMobile = false) => {
    try {
      setUploading(true);
      const storage = getStorage();
      const fileName = `goals/${Date.now()}.jpg`;
      const storageRef = ref(storage, fileName);

      let blob;
      if (isMobile) {
        const response = await fetch(file);
        blob = await response.blob();
      } else {
        blob = file instanceof Blob ? file : null;
      }

      if (!blob) throw new Error("Invalid file type");

      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      setImage(url); // ✅ update avatar
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Upload Failed", err.message);
      setImage(DEFAULT_AVATAR);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Save booking
  const handleCreate = async () => {
    if (!travelerName.trim() || !destination.trim()) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    try {
      await addDoc(collection(db, "goals"), {
        travelerName,
        destination,
        image: image || DEFAULT_AVATAR,
        userId: auth.currentUser?.uid || null,
        createdAt: new Date(),
      });
      Alert.alert("Success", "Booking created!");
      router.push("/goals");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  // ✅ Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/authentication"); // redirect back to login/signup
    } catch (err) {
      Alert.alert("Error", "Failed to sign out.");
    }
  };

  return (
    <LinearGradient
      colors={["#19183B", "#0D0C24"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Create New Booking</Text>

        {/* Profile Picture */}
        <Pressable onPress={pickImage} style={styles.avatarWrapper}>
          {uploading ? (
            <ActivityIndicator size="large" color="#0BA6DF" />
          ) : (
            <Image
              source={{ uri: image || DEFAULT_AVATAR }}
              style={styles.avatar}
              onError={() => setImage(DEFAULT_AVATAR)}
            />
          )}
          <Text style={styles.avatarHint}>Tap to add/change photo</Text>
        </Pressable>

        {/* Traveler Name */}
        <TextInput
          style={styles.input}
          placeholder="Traveler Name"
          placeholderTextColor="#aaa"
          value={travelerName}
          onChangeText={setTravelerName}
        />

        {/* Destination */}
        <TextInput
          style={styles.input}
          placeholder="Destination"
          placeholderTextColor="#aaa"
          value={destination}
          onChangeText={setDestination}
        />

        {/* Create Button */}
        <Pressable
          style={[styles.button, uploading && { opacity: 0.5 }]}
          onPress={handleCreate}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>
            {uploading ? "Uploading..." : "➕ Add Booking"}
          </Text>
        </Pressable>

        {/* 🚪 Sign Out Button */}
        <Pressable style={[styles.button, styles.signOutBtn]} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#E8DFCA",
    marginBottom: 30,
  },
  avatarWrapper: { alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#0BA6DF",
  },
  avatarHint: { color: "#aaa", fontSize: 14, marginTop: 8 },
  input: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    color: "white",
  },
  button: {
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700" },

  // ✅ Sign Out Styling
  signOutBtn: {
    backgroundColor: "#ef4444",
  },
  signOutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
