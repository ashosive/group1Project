import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { WebView } from "react-native-webview";

const GEOAPIFY_API_KEY = "b6e8a49bde644fecb9128841e54cf41e";

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [mapHtml, setMapHtml] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to use the map."
        );
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setLocation({ latitude, longitude });
      loadMapHtml(latitude, longitude);
    })();
  }, []);

  const loadMapHtml = (lat, lon) => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <script>
          const map = L.map('map').setView([${lat}, ${lon}], 14);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
          }).addTo(map);

          const userMarker = L.marker([${lat}, ${lon}]).addTo(map)
            .bindPopup("📍 You are here").openPopup();

          fetch('https://api.geoapify.com/v2/places?categories=healthcare.pharmacy&filter=circle:${lon},${lat},2000&bias=proximity:${lon},${lat}&limit=20&apiKey=${GEOAPIFY_API_KEY}')
            .then(response => response.json())
            .then(data => {
              data.features.forEach(place => {
                const coords = place.geometry.coordinates;
                const name = place.properties.name || "Pharmacy";
                L.marker([coords[1], coords[0]])
                  .addTo(map)
                  .bindPopup(name);
              });
            });
        </script>
      </body>
      </html>
    `;
    setMapHtml(html);
  };

  if (!location || !mapHtml) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html: mapHtml }}
      style={{ flex: 1 }}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MapScreen;
