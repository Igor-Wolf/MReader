// stacks/HomeStack.tsx
import { createStackNavigator } from "@react-navigation/stack";

import Home from "../views/Home/Home";
import About from "../views/About/About";

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: "black" },
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Sobre"
        component={About}
        options={{ headerShown: false }}
      />
     
    </Stack.Navigator>
  );
}
