// stacks/HomeStack.tsx
import { createStackNavigator } from "@react-navigation/stack";
import Navegar from "../views/Navegar/Navegar";
import ExtentionManga from "../views/ExtentionManga/ExtentionManga";

import { MangaFontProvider } from "../context/FontContext";
import MangaDetails from "../views/MangaDetails/MangaDetails";
import Reader from "../views/Reader/Reader";
import Biblioteca from "../views/Biblioteca/Biblioteca";

const Stack = createStackNavigator();

export default function BibliotecaStack() {
  return (
    <Stack.Navigator
  initialRouteName="Biblioteca"
  screenOptions={{
    headerStyle: { backgroundColor: "black" },
    headerTintColor: "white",
  }}
>
  <Stack.Screen name="Biblioteca" component={Biblioteca} options={{ headerShown: false }} />
  <Stack.Screen name="MangaDetails" component={MangaDetails} options={{ headerShown: false }} />
  <Stack.Screen name="Reader" component={Reader} options={{ headerShown: false }} />
</Stack.Navigator>

  );
}
