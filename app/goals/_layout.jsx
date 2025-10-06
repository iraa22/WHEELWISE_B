// 📂 app/goals/_layout.jsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { GoalsProvider } from "../../context/GoalsContext";

export default function GoalsLayout() {
  return (
    <GoalsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#E8DFCA", 
          tabBarInactiveTintColor: "white", 
          tabBarStyle: {
            position: "absolute",
            backgroundColor: "transparent", 
            borderTopWidth: 0,
            elevation: 0, 
            shadowOpacity: 0, 
            height: 60,
          },
          tabBarItemStyle: {
            borderRadius: 12,
            margin: 6,
          },
          tabBarActiveBackgroundColor:
            Platform.OS === "web"
              ? "rgba(153, 172, 102, 0.25)" 
              : "rgba(173, 202, 105, 0.4)", 
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        {/* ✅ Goals Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Your Bookings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />

        {/* ✅ Create Goal */}
        <Tabs.Screen
          name="create"
          options={{
            title: "Create Booking",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" size={size} color={color} />
            ),
          }}
        />

        {/* ✅ Update Goal */}
        <Tabs.Screen
          name="updategoals"
          options={{
            title: "Update Bookings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="create" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </GoalsProvider>
  );
}
