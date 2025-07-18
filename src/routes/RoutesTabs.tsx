import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../views/Home/Home";
import Historico from "../views/Historico/Historico";
import Atualizar from "../views/Atualizar/Atualizar";

import Ionicons from "react-native-vector-icons/Ionicons";
import NavigationStack from "./NavigationStack";
import { CommonActions } from "@react-navigation/native";
import BibliotecaStack from "./BibliotecaStack";
import HistoricoStack from "./HistoricoStack";

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
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
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
      <Tab.Screen
        name="Biblioteca"
        options={{ headerShown: false }}
        component={BibliotecaStack}
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
                routes: [{ name: "Biblioteca" }],
              })
            );
          },
        })}
      />
      <Tab.Screen name="Atualizar" component={Atualizar} />
      <Tab.Screen
        name="Historico"
        component={HistoricoStack}
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
                routes: [{ name: "Historico" }],
              })
            );
          },
        })}
      />

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
