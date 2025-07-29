import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import PharmacyListScreen from "./screens/PharmacyListScreen";
import DrugDetailScreen from "./screens/DrugDetailScreen";
import SavedScreen from "./screens/SavedScreen";
import MapScreen from "./screens/MapScreen";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PharmaNearby">
        <Stack.Screen name="PharmaNearby" component={HomeScreen} />
        <Stack.Screen name="Pharmacies" component={PharmacyListScreen} />
        <Stack.Screen name="Drug Details" component={DrugDetailScreen} />
        <Stack.Screen name="Saved" component={SavedScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
