import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { db } from "../services/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const SavedScreen = () => {
  const [entries, setEntries] = useState([]);
  const navigation = useNavigation();

  const fetchEntries = async () => {
    const snapshot = await getDocs(collection(db, "savedDrugs"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEntries(data);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Drug",
      "Are you sure you want to remove this from your saved list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "savedDrugs", id));
            fetchEntries();
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("Drug Details", {
          brandName: item.brand?.toUpperCase(),
          genericName: item.generic?.toLowerCase(),
        })
      }
    >
      <Text style={styles.title}>{item.brand || "Unknown Drug"}</Text>
      <Text style={styles.text}>Generic: {item.generic || "N/A"}</Text>
      <Text style={styles.text}>
        Manufacturer: {item.manufacturer || "N/A"}
      </Text>
      <Text style={styles.text}>Purpose: {item.purpose || "N/A"}</Text>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteText}>🗑️ Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {entries.length === 0 ? (
        <Text style={styles.empty}>No saved drugs yet.</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f7f9fc",
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    color: "#333",
  },
  text: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 16,
    color: "#888",
  },
});

export default SavedScreen;
