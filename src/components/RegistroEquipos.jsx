import React, { useState } from 'react'; 
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from '../utils/firebase';
import { useNavigation } from '@react-navigation/native';  // Importar useNavigation

const db = getFirestore(app);

export default function RegistroEquipos({ route }) {
  const { ligaId } = route.params;
  const [equipo, setEquipo] = useState('');
  const navigation = useNavigation();  // Usar useNavigation para obtener 'navigation'

  const handleRegistroEquipo = async () => {
    if (equipo.trim() === '') {
      Alert.alert("Error", "El nombre del equipo no puede estar vacío.");
      return;
    }

    try {
      await addDoc(collection(db, "ligas", ligaId, "equipos"), { nombre: equipo });
      Alert.alert("Éxito", "Equipo registrado correctamente.");
      setEquipo('');
      
      // Navegar de nuevo a la pantalla DetalleLiga, pasando el ligaId
      navigation.goBack();
    } catch (error) {
      console.error("Error al registrar equipo:", error);
      Alert.alert("Error", "No se pudo registrar el equipo.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Equipo</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del Equipo"
        value={equipo}
        onChangeText={setEquipo}
      />
      <Button title="Registrar" onPress={handleRegistroEquipo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});
