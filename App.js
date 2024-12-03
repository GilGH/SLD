import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
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
import EncuentrosForm from './src/components/EncuentrosForm';
import GenerarEncuentro from './src/components/GenerarEncuentro';
import VistaJugador from './src/components/VistaJugador';

// Creación de navegadores
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // Para el rol del usuario
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Obtener rol del usuario desde Firestore
        const userRef = doc(db, "users", user.uid); // Cambia "users" según tu colección
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setRole(userDoc.data().role); // Suponiendo que el rol está en el campo `role`
        } else {
          console.error("No se encontró el documento del usuario");
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) return null;

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setRole(null);
      })
      .catch((error) => console.error("Error al cerrar sesión", error));
  };

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
        label="Encuentros"
        onPress={() => props.navigation.navigate('Encuentros')}
      />
      <DrawerItem
        label="Cerrar sesión"
        onPress={handleLogout}
        labelStyle={{ color: 'red' }}
      />
    </DrawerContentScrollView>
  );

  const DrawerNavigator = () => (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Principal" component={Principal} />
      <Drawer.Screen name="Ligas" component={VerLigas} />
      <Drawer.Screen name="Crear Liga" component={CrearLiga} />
      <Drawer.Screen name="Encuentros" component={EncuentrosForm} />
    </Drawer.Navigator>
  );

  const PlayerStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="VistaJugador" component={VistaJugador} />
    </Stack.Navigator>
  );

  const getNavigationStack = () => {
    switch (role) {
      case "admin":
        return <DrawerNavigator />;
      case "jugador":
        return <PlayerStack />;
      default:
        return <DrawerNavigator />;
    }
  };

  return (
    <NavigationContainer>
      {user ? (
        getNavigationStack()
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={Auth} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

