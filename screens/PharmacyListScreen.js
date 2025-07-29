import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";

const GEOAPIFY_API_KEY = "b6e8a49bde644fecb9128841e54cf41e";

const PharmacyListScreen = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to find nearby pharmacies."
        );
        setLoading(false);
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });

        const url = `https://api.geoapify.com/v2/places?categories=healthcare.pharmacy&filter=circle:${longitude},${latitude},3000&bias=proximity:${longitude},${latitude}&limit=20&apiKey=${GEOAPIFY_API_KEY}`;
        const res = await axios.get(url);
        setPharmacies(res.data.features);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to fetch pharmacy data.");
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={{ marginTop: 10 }}>Loading nearby pharmacies...</Text>
      </View>
    );
  }

  if (pharmacies.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No pharmacies found nearby.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const { name, address_line1, city, country } = item.properties;
    const lat = item.geometry.coordinates[1];
    const lon = item.geometry.coordinates[0];

    const distance =
      userLocation &&
      getDistanceInKm(userLocation.latitude, userLocation.longitude, lat, lon);

    return (
      <View style={styles.card}>
        <Text style={styles.name}>{name || "Unnamed Pharmacy"}</Text>
        <Text style={styles.address}>{address_line1}</Text>
        <Text style={styles.address}>
          {city}, {country}
        </Text>
        <Text style={styles.distance}>
          📍 {distance ? `${distance} km away` : "Distance unknown"}
        </Text>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
            )
          }
        >
          <Text style={styles.mapButtonText}>🗺️ Open in Maps</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={pharmacies}
      keyExtractor={(item) => item.properties.place_id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    marginTop: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  empty: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
    marginTop: 50,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  address: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  distance: {
    fontSize: 14,
    color: "#007aff",
    marginTop: 6,
  },
  mapButton: {
    marginTop: 12,
    backgroundColor: "#007aff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default PharmacyListScreen;
