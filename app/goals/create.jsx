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
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=Traveler&background=0BA6DF&color=fff&size=256";

const Create = () => {
  const [travelerName, setTravelerName] = useState("");
  const [destination, setDestination] = useState("");
  const [car, setCar] = useState("");
  const [showCars, setShowCars] = useState(false);
  const [image, setImage] = useState(DEFAULT_AVATAR);
  const [uploading, setUploading] = useState(false);

  // ✅ Separate date and time
  const [bookingDate, setBookingDate] = useState(new Date());
  const [bookingTime, setBookingTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const router = useRouter();
  const cars = ["Sedan", "SUV", "Van", "Convertible"];

  // ✅ Merge date + time into single Date
  const getFinalDateTime = () => {
    const finalDate = new Date(bookingDate);
    finalDate.setHours(bookingTime.getHours());
    finalDate.setMinutes(bookingTime.getMinutes());
    return finalDate;
  };

  // ✅ Pick image
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

  // ✅ Upload image to Firebase
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
      setImage(url);
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
    if (!travelerName.trim() || !destination.trim() || !car.trim()) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    try {
      const finalDate = getFinalDateTime();

      await addDoc(collection(db, "goals"), {
        travelerName,
        destination,
        car,
        date: finalDate.toISOString(),
        image: image || DEFAULT_AVATAR,
        userId: auth.currentUser?.uid || null,
        createdAt: new Date(),
      });

      // 🚀 Go directly to Your Bookings
      router.replace("/goals");

      // (Optional) reset form if user comes back
      setTravelerName("");
      setDestination("");
      setCar("");
      setImage(DEFAULT_AVATAR);
      setBookingDate(new Date());
      setBookingTime(new Date());
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  // ✅ Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/authentication");
    } catch (err) {
      Alert.alert("Error", "Failed to sign out.");
    }
  };

  return (
    <LinearGradient colors={["#19183B", "#0D0C24"]} style={styles.container}>
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

        {/* ✅ Date Picker */}
        <Pressable
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            📅 {bookingDate.toDateString()}
          </Text>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={bookingDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setBookingDate(selectedDate);
            }}
          />
        )}

        {/* ✅ Time Picker */}
        <Pressable
          style={styles.dateButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            ⏰{" "}
            {bookingTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </Pressable>
        {showTimePicker && (
          <DateTimePicker
            value={bookingTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) setBookingTime(selectedTime);
            }}
          />
        )}

        {/* ✅ Choose a Car */}
        <Pressable
          style={styles.chooseCarButton}
          onPress={() => setShowCars(!showCars)}
        >
          <Text style={styles.chooseCarText}>
            {car ? `Car: ${car}` : "🚘 Choose a Car"}
          </Text>
        </Pressable>

        {showCars &&
          cars.map((c) => (
            <Pressable
              key={c}
              style={[
                styles.carOption,
                car === c && { backgroundColor: "#0BA6DF" },
              ]}
              onPress={() => {
                setCar(c);
                setShowCars(false);
              }}
            >
              <Text style={styles.carText}>{c}</Text>
            </Pressable>
          ))}

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

        {/* Sign Out Button */}
        <Pressable
          style={[styles.button, styles.signOutBtn]}
          onPress={handleSignOut}
        >
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
  dateButton: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  dateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  chooseCarButton: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  chooseCarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  carOption: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  carText: {
    color: "white",
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    backgroundColor: "#0BA6DF",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700" },
  signOutBtn: {
    backgroundColor: "#ef4444",
  },
  signOutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
