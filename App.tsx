import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import RoutesTabs from "./src/routes/RoutesTabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RoutesTabs />
        <StatusBar style="light" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
