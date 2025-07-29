import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigation, useRoute } from "@react-navigation/native";

const DrugDetailScreen = () => {
  const [drug, setDrug] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const route = useRoute();
const { brandName, genericName, name } = route.params;
const searchName = name || brandName || genericName;
useEffect(() => {
  const fetchDrugDetails = async () => {
    try {
      const queryBrand = brandName || name;
      const queryGeneric = genericName || name;

      if (queryBrand) {
        const brandRes = await fetch(
          `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${queryBrand}"&limit=1`
        );
        const brandData = await brandRes.json();
        if (brandData.results?.length > 0) {
          setDrug(brandData.results[0]);
          return;
        }
      }

      if (queryGeneric) {
        const genericRes = await fetch(
          `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${queryGeneric}"&limit=1`
        );
        const genericData = await genericRes.json();
        if (genericData.results?.length > 0) {
          setDrug(genericData.results[0]);
          return;
        }
      }

      Alert.alert("Drug Not Found", "Try a different brand or generic name.");
    } catch (err) {
      Alert.alert("Error", "Failed to fetch drug details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchDrugDetails();
}, [brandName, genericName, name]);


  const getField = (field) => drug?.[field]?.[0] || "N/A";
  const getOpenFDA = (field) => drug?.openfda?.[field]?.[0] || "N/A";

  const handleSave = async () => {
    try {
      await addDoc(collection(db, "savedDrugs"), {
        brand: getOpenFDA("brand_name")?.toUpperCase(),
        generic: getOpenFDA("generic_name")?.toLowerCase(),
        manufacturer: getOpenFDA("manufacturer_name"),
        purpose: getField("purpose"),
        savedAt: Date.now(),
      });
      Alert.alert("Saved", "Drug saved to favorites.");
    } catch (err) {
      Alert.alert("Error", "Failed to save drug.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  if (!drug) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No data found for "{name}".</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{getOpenFDA("brand_name")}</Text>
      <Text style={styles.label}>Generic Name:</Text>
      <Text style={styles.value}>{getOpenFDA("generic_name")}</Text>

      <Text style={styles.label}>Manufacturer:</Text>
      <Text style={styles.value}>{getOpenFDA("manufacturer_name")}</Text>

      <Text style={styles.label}>Purpose:</Text>
      <Text style={styles.value}>{getField("purpose")}</Text>

      <Text style={styles.label}>Warnings:</Text>
      <ScrollView style={styles.warningBox}>
        <Text style={styles.warningText}>{getField("warnings")}</Text>
      </ScrollView>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>💾 Save This Drug</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: "#28a745", marginTop: 12 },
          ]}
          onPress={() =>
            navigation.navigate("Map", {
              drugName: getOpenFDA("brand_name"),
            })
          }
        >
          <Text style={styles.saveButtonText}>📍 Find Nearby Pharmacies</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f7f9fc",
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#007aff",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    color: "#333",
  },
  value: {
    fontSize: 15,
    color: "#555",
    marginBottom: 8,
  },
  warningBox: {
    maxHeight: 200,
    backgroundColor: "#fff3cd",
    borderColor: "#ffeeba",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  warningText: {
    color: "#856404",
    fontSize: 14,
  },
  buttonGroup: {
    marginTop: 30,
    paddingBottom: 50,
  },
  saveButton: {
    backgroundColor: "#007aff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
  },
});

export default DrugDetailScreen;
