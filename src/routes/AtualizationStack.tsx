// stacks/HomeStack.tsx
import { createStackNavigator } from "@react-navigation/stack";
import Navegar from "../views/Navegar/Navegar";

import MangaDetails from "../views/MangaDetails/MangaDetails";
import Reader from "../views/Reader/Reader";
import Atualizar from "../views/Atualizar/Atualizar";

const Stack = createStackNavigator();

export default function AtualizationStack() {
  return (
    <Stack.Navigator
      initialRouteName="Atualization"
      screenOptions={{
        headerStyle: { backgroundColor: "black" },
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="Atualization"
        component={Atualizar}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MangaDetails"
        component={MangaDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reader"
        component={Reader}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
