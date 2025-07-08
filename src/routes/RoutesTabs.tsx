import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../views/Home/Home";
import Biblioteca from "../views/Biblioteca/Biblioteca";
import Historico from "../views/Historico/Historico";
import Atualizar from "../views/Atualizar/Atualizar";

import Ionicons from "react-native-vector-icons/Ionicons";
import Navegar from "../views/Navegar/Navegar";
import NavigationStack from "./NavigationStack";
import { CommonActions } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export default function RoutesTabs() {
  const icons: Record<string, { focused: string; unfocused: string }> = {
    Biblioteca: { focused: "library", unfocused: "library-outline" },
    Atualizar: { focused: "sync-circle", unfocused: "sync-circle-outline" },
    Historico: { focused: "time", unfocused: "time-outline" },
    Navegar: { focused: "compass", unfocused: "compass-outline" },
    Home: { focused: "home", unfocused: "home-outline" },
  };
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        unmountOnBlur: true,
        tabBarIcon: ({ focused, color, size }) => {
          const icon = icons[route.name];
          const iconName = focused ? icon?.focused : icon?.unfocused;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: "black", // cor de fundo da barra inferior
          borderTopColor: "black", // remover borda superior, se quiser
          height: 100, // opcional: altura da barra
        },

        headerStyle: {
          borderBottomColor: "gray",
          borderWidth: 1,
          backgroundColor: "black", // muda a cor de fundo do header
        },
        headerTintColor: "tomato", // muda a cor do texto e ícones (como "voltar")
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Biblioteca" component={Biblioteca} />
      <Tab.Screen name="Atualizar" component={Atualizar} />
      <Tab.Screen name="Historico" component={Historico} />
      <Tab.Screen
        name="Navegar"
        component={NavigationStack}
        options={{ headerShown: false }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
              })
            );
          },
          transitionStart: (e) => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Navegar" }],
              })
            );
          },
        })}
      />
      <Tab.Screen name="Home" component={Home} />
    </Tab.Navigator>
  );
}
