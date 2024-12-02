import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from './src/utils/firebase';

// Componentes
import Auth from './src/components/Auth';
import Principal from './src/components/Principal';
import CrearLiga from './src/components/CrearLiga';
import VerLigas from './src/components/VerLigas';
import DetalleLiga from './src/components/DetalleLiga';
import RegistroEquipos from './src/components/RegistroEquipos';
import DetalleEquipo from './src/components/DetalleEquipo';
import RegistroJugador from './src/components/RegistroJugador';
import DetalleJugador from './src/components/DetalleJugador';

// Creación de navegadores
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) return null;

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    signOut(auth)
      .then(() => setUser(false))
      .catch((error) => console.error("Error al cerrar sesión", error));
  };

  // Componente personalizado del Drawer
  const CustomDrawerContent = (props) => (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Principal"
        onPress={() => props.navigation.navigate('Principal')}
      />
      <DrawerItem
        label="Ligas"
        onPress={() => props.navigation.navigate('Ligas')}
      />
      <DrawerItem
        label="Crear Liga"
        onPress={() => props.navigation.navigate('Crear Liga')}
      />
      <DrawerItem
        label="Cerrar sesión"
        onPress={handleLogout}
        labelStyle={{ color: 'red' }}
      />
    </DrawerContentScrollView>
  );

  // Drawer Navigator
  const DrawerNavigator = () => (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Principal" component={Principal} />
      <Drawer.Screen name="Ligas" component={VerLigas} />
      <Drawer.Screen name="Crear Liga" component={CrearLiga} />
    </Drawer.Navigator>
  );

  // Stack Navigator con integración del Drawer
  const AppStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detalle de la Liga"
        component={DetalleLiga}
        options={{
          title: "Detalle de la Liga",
          headerStyle: { backgroundColor: "#1E90FF" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="DetalleEquipo"
        component={DetalleEquipo}
        options={{
          title: "Detalle del Equipo",
          headerStyle: { backgroundColor: "#1E90FF" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="RegistroJugador"
        component={RegistroJugador}
        options={{
          title: "Registrar Jugador",
          headerStyle: { backgroundColor: "#1E90FF" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="DetalleJugador"
        component={DetalleJugador}
        options={{
          title: "Detalle del Jugador",
          headerStyle: { backgroundColor: "#1E90FF" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="RegistroEquipos"
        component={RegistroEquipos}
        options={{
          title: "Registrar Equipos",
          headerStyle: { backgroundColor: "#1E90FF" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer>
      {user ? (
        <AppStack />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={Auth} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
