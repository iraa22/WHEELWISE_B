import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useState } from "react";
import { Alert, Platform } from "react-native";
import { useRouter } from "expo-router";

// Web modal styled to match mobile app
const WebConfirmModal = ({ visible, onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#000",              // dark card like mobile
          padding: 30,
          borderRadius: 8,                 // same as mobile links/buttons
          textAlign: "center",
          maxWidth: "350px",
          width: "90%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.6)", // slightly stronger shadow like mobile
        }}
      >
        <p
          style={{
            fontSize: 16,       // match mobile linkText
            fontWeight: "600",  // match mobile linkText
            color: "white",     // match mobile linkText
            marginBottom: 20,
            lineHeight: "24px", // vertical spacing similar to mobile
          }}
        >
          Are you sure you want to sign out?
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Cancel button */}
          <button
            onClick={onCancel}
            style={{
              padding: "14px 20px",
              backgroundColor: "rgba(0,0,0,0.4)", // semi-transparent like mobile
              color: "white",
              fontSize: 16,
              fontWeight: "600",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          {/* Sign Out button */}
          <button
            onClick={onConfirm}
            style={{
              padding: "14px 20px",
              fontSize: 16,
              fontWeight: "600",
              color: "white",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(180deg, #D9C4B0 0%, #D9C4B0 50%, #4facfe 100%)",
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export function useSignOut() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const doSignOut = async () => {
    try {
      await signOut(auth);

      if (Platform.OS === "web") setModalVisible(false);
      else Alert.alert("Signed Out", "You have been signed out successfully.");

      router.push("/authentication/auth");
    } catch (error) {
      if (Platform.OS === "web") alert("Error signing out: " + error.message);
      else Alert.alert("Error", error.message);
    }
  };

  const handleSignOut = () => {
    if (Platform.OS === "web") setModalVisible(true);
    else
      Alert.alert(
        "Confirm Sign Out",
        "Are you sure you want to sign out?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign Out", style: "destructive", onPress: doSignOut },
        ],
        { cancelable: true }
      );
  };

  const WebModal =
    Platform.OS === "web" ? (
      <WebConfirmModal
        visible={modalVisible}
        onConfirm={doSignOut}
        onCancel={() => setModalVisible(false)}
      />
    ) : null;

  return { handleSignOut, WebModal };
}
