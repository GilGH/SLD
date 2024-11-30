import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import app from './src/utils/firebase';
import Auth from './src/components/Auth';

export default function App() {
  const [user, setUser] = useState(undefined);

  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // El usuario está autenticado
        setUser(true);
      } else {
        // El usuario no está autenticado
        setUser(false);
      }
    });
  }, []);



  if (user === undefined) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

          // Si no está autenticado, muestra la pantalla de inicio de sesión
          <Auth />
        
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
