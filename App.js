import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Auth from './src/components/Auth';
import Principal from './src/components/Principal';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect } from 'react';
import app from './src/utils/firebase';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [user, setUser] = useState(undefined);
  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(true);
      } else {
        setUser(false);
      }
    });
  }, []);

  if (user === undefined) return null;

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Sesión cerrada");
        setUser(false); // Actualizar el estado global
      })
      .catch((error) => {
        console.error("Error al cerrar sesión", error);
      });
  };

  // Componente personalizado para el contenido del Drawer
  const CustomDrawerContent = (props) => (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Principal"
        onPress={() => props.navigation.navigate('Principal')}
      />
      <DrawerItem
        label="Cerrar sesión"
        onPress={handleLogout} // Llamar directamente al logout
        labelStyle={{ color: 'red' }} // Opcional: estilizar el botón
      />
    </DrawerContentScrollView>
  );

  // Configuración del Drawer con contenido personalizado
  const DrawerNavigator = () => (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Principal" component={Principal} />
    </Drawer.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={Auth} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
