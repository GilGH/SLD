import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Auth from './src/components/Auth';
import Principal from './src/components/Principal';
import CrearLiga from './src/components/CrearLiga';
import VerLigas from './src/components/VerLigas';
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
      setUser(user ? true : false);
    });
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
        label="Ver Ligas"
        onPress={() => props.navigation.navigate('Ver Ligas')}
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
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Principal" component={Principal} />
      <Drawer.Screen name="Crear Liga" component={CrearLiga} />
      <Drawer.Screen name="Ver Ligas" component={VerLigas} />
    </Drawer.Navigator>
  );

  return (
    <NavigationContainer>
      {user ? (
        <DrawerNavigator />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={Auth} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}


