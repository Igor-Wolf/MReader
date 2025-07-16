// stacks/HomeStack.tsx
import { createStackNavigator } from "@react-navigation/stack";
import Navegar from "../views/Navegar/Navegar";
import ExtentionManga from "../views/ExtentionManga/ExtentionManga";

import { MangaFontProvider } from "../context/FontContext";
import MangaDetails from "../views/MangaDetails/MangaDetails";
import Reader from "../views/Reader/Reader";

const Stack = createStackNavigator();

export default function NavigationStack() {
  return (
    <MangaFontProvider>
      <Stack.Navigator
        initialRouteName="Fonts"
        screenOptions={{
          headerStyle: { backgroundColor: "black" },
          headerTitleStyle: {
            fontWeight: 'bold'
          },
          headerTintColor: "tomato",
        }}
      >
        <Stack.Screen name="Fonts" component={Navegar} />
        <Stack.Screen
          name="ExtentionManga"
          component={ExtentionManga}
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
    </MangaFontProvider>
  );
}
