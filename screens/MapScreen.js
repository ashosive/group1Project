import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

const GEOAPIFY_API_KEY = "b6e8a49bde644fecb9128841e54cf41e";

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to show the map."
        );
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      try {
        const { latitude, longitude } = loc.coords;
        const url = `https://api.geoapify.com/v2/places?categories=healthcare.pharmacy&filter=circle:${longitude},${latitude},3000&bias=proximity:${longitude},${latitude}&limit=20&apiKey=${GEOAPIFY_API_KEY}`;
        const res = await axios.get(url);
        setPharmacies(res.data.features);
      } catch (err) {
        Alert.alert("Error", "Could not fetch nearby pharmacies.");
        console.error(err);
      }
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }}
      showsUserLocation={true}
    >
      {pharmacies.map((pharmacy) => (
        <Marker
          key={pharmacy.properties.place_id}
          coordinate={{
            latitude: pharmacy.geometry.coordinates[1],
            longitude: pharmacy.geometry.coordinates[0],
          }}
          title={pharmacy.properties.name || "Pharmacy"}
          description={pharmacy.properties.address_line1}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MapScreen;
