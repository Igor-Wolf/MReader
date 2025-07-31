import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from '@expo/vector-icons/Ionicons';

import Atualizar from "../views/Atualizar/Atualizar";
import NavigationStack from "./NavigationStack";
import BibliotecaStack from "./BibliotecaStack";
import HistoricoStack from "./HistoricoStack";
import HomeStack from "./HomeStack";


const Tab = createBottomTabNavigator();

export default function RoutesTabs() {
  // Mapeamento dos ícones para cada aba
  const icons: Record<string, { focused: string; unfocused: string }> = {
    Biblioteca: { focused: "library", unfocused: "library-outline" },
    Atualizar: { focused: "sync-circle", unfocused: "sync-circle-outline" },
    Historico: { focused: "time", unfocused: "time-outline" },
    Navegar: { focused: "compass", unfocused: "compass-outline" },
    Inicio: { focused: "home", unfocused: "home-outline" },
  };

  return (
    <Tab.Navigator
      initialRouteName="Inicio" // A rota inicial será 'Home'
      screenOptions={({ route }) => ({
       
        unmountOnBlur: true,

        tabBarIcon: ({ focused, color, size }) => {
          const icon = icons[route.name];
          
          const iconName = icon ? (focused ? icon.focused : icon.unfocused) : "help-circle-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: "black",
          borderTopColor: "black",
          height: 100,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "tomato", 
        tabBarInactiveTintColor: "gray",  

        
        headerStyle: {
          borderBottomColor: "gray",
          borderWidth: 1, 
          backgroundColor: "black",
        },
        headerTintColor: "tomato",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      
      

      <Tab.Screen
        name="Inicio"
        component={HomeStack}
        options={{ headerShown: false }} 
        
      />
      <Tab.Screen
        name="Biblioteca"
        component={BibliotecaStack}
        options={{ headerShown: false }} 
        
      />

      <Tab.Screen name="Atualizar" component={Atualizar} />

      <Tab.Screen
        name="Historico"
        component={HistoricoStack}
        options={{ headerShown: false }}
        
      />

      <Tab.Screen
        name="Navegar"
        component={NavigationStack}
        options={{ headerShown: false }}
        
      />
    </Tab.Navigator>
  );
}