import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import RoutesTabs from "./src/routes/RoutesTabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RealmProvider } from "./src/context/RealmContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RealmProvider>
        <NavigationContainer>
          <RoutesTabs />
          <StatusBar style="light" />
        </NavigationContainer>
      </RealmProvider>
    </GestureHandlerRootView>
  );
}
