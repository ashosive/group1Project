import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

const HomeScreen = ({ navigation }) => {
  const [drugName, setDrugName] = useState("");

  const handleSearch = () => {
    if (drugName.trim()) {
      navigation.navigate("Drug Details", { name: drugName.trim() });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>💊 PharmaNearby</Text>

        <TextInput
          placeholder="Enter drug name"
          value={drugName}
          onChangeText={setDrugName}
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleSearch}>
          <Text style={styles.buttonText}>🔍 Check Drug Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate("Pharmacies")}
        >
          <Text style={styles.buttonText}>📍 Find Nearby Pharmacies</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate("Saved")}
        >
          <Text style={styles.buttonText}>💾 View Saved Drugs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate("Map")}
        >
          <Text style={styles.buttonText}>🗺️ Open Map</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f7f9fc",
    justifyContent: "center",
    alignItems: "stretch",
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginBottom: 30,
    alignSelf: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: "#007aff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  buttonSecondary: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HomeScreen;
