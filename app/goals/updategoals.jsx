import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState, useEffect } from "react";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db, auth } from "../../firebaseConfig";
import { doc, updateDoc, addDoc, collection, getDoc } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";

export default function UpdateGoals() {
  const [travelerName, setTravelerName] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [car, setCar] = useState("");
  const [pax, setPax] = useState(1);

  const { id } = useLocalSearchParams(); // booking id passed from Edit
  const router = useRouter();

  // Load booking if editing
  useEffect(() => {
    const fetchBooking = async () => {
      if (id) {
        const ref = doc(db, "goals", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setTravelerName(data.travelerName || "");
          setDestination(data.destination || "");
          setDate(data.date ? new Date(data.date) : new Date());
          setCar(data.car || "");
          setPax(data.passengers || 1);
        }
      }
    };
    fetchBooking();
  }, [id]);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  // Save or Update
  const handleSave = async () => {
    if (!travelerName.trim() || !destination.trim() || !car.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      if (id) {
        // Update booking
        const ref = doc(db, "goals", id);
        await updateDoc(ref, {
          travelerName,
          destination,
          date: date.toISOString(),
          car,
          passengers: pax,
          updatedAt: new Date(),
        });
        Alert.alert("Success", "Booking updated!");
      } else {
        // Create booking
        await addDoc(collection(db, "goals"), {
          travelerName,
          destination,
          date: date.toISOString(),
          car,
          passengers: pax,
          userId: auth.currentUser?.uid || null,
          createdAt: new Date(),
        });
        Alert.alert("Success", "Booking created!");
      }
      // ✅ Go directly to bookings page
      router.replace("/goals");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.container}
    >
      <Text style={styles.title}>{id ? "Edit Booking" : "Create Booking"}</Text>

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

      {/* Date & Time Picker */}
      <Pressable style={styles.input} onPress={() => setShowDatePicker(true)}>
        <View style={styles.row}>
          <Ionicons name="calendar" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.inputText}>
            {date.toLocaleString([], {
              weekday: "short",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {/* Choose Car Dropdown */}
      <View style={styles.pickerContainer}>
        <FontAwesome5 name="car-side" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Picker
          selectedValue={car}
          style={styles.picker}
          dropdownIconColor="#fff"
          onValueChange={(itemValue) => setCar(itemValue)}
        >
          <Picker.Item label="Choose a Car" value="" />
          <Picker.Item label="Sedan" value="Sedan" />
          <Picker.Item label="SUV" value="SUV" />
          <Picker.Item label="Van" value="Van" />
        </Picker>
      </View>

      {/* People / Pax Selector */}
      <View style={[styles.input, styles.row, { justifyContent: "space-between" }]}>
        <View style={styles.row}>
          <Ionicons name="people" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.inputText}>Passengers: {pax}</Text>
        </View>
        <View style={styles.row}>
          <Pressable onPress={() => setPax(Math.max(1, pax - 1))} style={styles.paxButton}>
            <Text style={styles.paxButtonText}>-</Text>
          </Pressable>
          <Pressable onPress={() => setPax(pax + 1)} style={styles.paxButton}>
            <Text style={styles.paxButtonText}>+</Text>
          </Pressable>
        </View>
      </View>

      {/* Save Changes */}
      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>{id ? "Save Changes" : "Add Booking"}</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    width: "80%",
    padding: 12,
    marginBottom: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
  inputText: {
    color: "#fff",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  pickerContainer: {
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  picker: {
    flex: 1,
    color: "#3f3333ff", // ✅ fixed: now white text inside picker
  },
  button: {
    backgroundColor: "#444",
    padding: 14,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  paxButton: {
    backgroundColor: "#555",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 5,
  },
  paxButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
