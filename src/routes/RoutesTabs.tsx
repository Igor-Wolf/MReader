import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native"; // Ainda pode ser útil para outras lógicas, mas não para o reset das abas
import Ionicons from '@expo/vector-icons/Ionicons';

// Importe suas telas e Stacks
import Home from "../views/Home/Home";
import Atualizar from "../views/Atualizar/Atualizar";
import NavigationStack from "./NavigationStack";
import BibliotecaStack from "./BibliotecaStack";
import HistoricoStack from "./HistoricoStack";


const Tab = createBottomTabNavigator();

export default function RoutesTabs() {
  // Mapeamento dos ícones para cada aba
  const icons: Record<string, { focused: string; unfocused: string }> = {
    Biblioteca: { focused: "library", unfocused: "library-outline" },
    Atualizar: { focused: "sync-circle", unfocused: "sync-circle-outline" },
    Historico: { focused: "time", unfocused: "time-outline" },
    Navegar: { focused: "compass", unfocused: "compass-outline" },
    Home: { focused: "home", unfocused: "home-outline" },
  };

  return (
    <Tab.Navigator
      initialRouteName="Home" // A rota inicial será 'Home'
      screenOptions={({ route }) => ({
        // Esta prop é essencial: ela desmonta a tela quando a aba não está focada
        // e a remonta (resetando seu estado, incluindo o stack) quando focada novamente.
        unmountOnBlur: true,

        tabBarIcon: ({ focused, color, size }) => {
          const icon = icons[route.name];
          // Adicionado um fallback para garantir que o iconName nunca seja undefined.
          // 'help-circle-outline' é um bom ícone padrão para casos não mapeados.
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
        tabBarActiveTintColor: "tomato", // Cor do ícone e label da aba ativa
        tabBarInactiveTintColor: "gray",  // Cor do ícone e label da aba inativa

        // Estilos do cabeçalho (header) para as telas dentro das abas
        headerStyle: {
          borderBottomColor: "gray",
          borderWidth: 1, // Nota: borderWidth pode causar problemas se não for só no bottom. Considere borderBottomWidth
          backgroundColor: "black",
        },
        headerTintColor: "tomato",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      {/*
        Organizei a ordem para que 'Home' seja a primeira Screen declarada
        para melhor legibilidade, já que é a initialRouteName.
      */}
      <Tab.Screen name="Home" component={Home} />

      <Tab.Screen
        name="Biblioteca"
        component={BibliotecaStack}
        options={{ headerShown: false }} // O Stack Navigator (BibliotecaStack) vai gerenciar seu próprio header
        // REMOVIDOS OS LISTENERS COM CommonActions.reset para evitar crashes e comportamento inesperado.
        // O `unmountOnBlur: true` já cuida de resetar o estado do stack ao sair e voltar.
      />

      <Tab.Screen name="Atualizar" component={Atualizar} />

      <Tab.Screen
        name="Historico"
        component={HistoricoStack}
        options={{ headerShown: false }}
        // REMOVIDOS OS LISTENERS COM CommonActions.reset
      />

      <Tab.Screen
        name="Navegar"
        component={NavigationStack}
        options={{ headerShown: false }}
        // REMOVIDOS OS LISTENERS COM CommonActions.reset
      />
    </Tab.Navigator>
  );
}