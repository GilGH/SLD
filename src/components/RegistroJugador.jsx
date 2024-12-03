import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import app from '../utils/firebase';
import * as ImagePicker from 'expo-image-picker'; // Importar ImagePicker
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

const db = getFirestore(app);

export default function RegistroJugador({ route }) {
  const { ligaId, equipoId } = route.params; // Obtener ligaId y equipoId
  const [nombreJugador, setNombreJugador] = useState('');
  const [imagenJugador, setImagenJugador] = useState(null); // Estado para la imagen
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Función para seleccionar la imagen
  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImagenJugador(result.assets[0].uri); // Guarda la URI seleccionada
    } else {
      Alert.alert("Error", "No se seleccionó ninguna imagen.");
    }
  };

  // Función para registrar al jugador
  const handleRegistroJugador = async () => {
    if (nombreJugador.trim() === '') {
      Alert.alert("Error", "El nombre del jugador no puede estar vacío.");
      return;
    }

    setIsLoading(true);

    try {
      // Registrar el jugador en Firestore
      await addDoc(collection(db, "ligas", ligaId, "equipos", equipoId, "jugadores"), {
        nombre: nombreJugador,
        imagen: imagenJugador, // Guardar la URI de la imagen
        fechaCreacion: new Date().toISOString(), // Guardar la fecha de creación
      });
      Alert.alert("Éxito", "Jugador registrado correctamente.");
      setNombreJugador('');
      setImagenJugador(null);
      navigation.goBack();
    } catch (error) {
      console.error("Error al registrar jugador:", error);
      Alert.alert("Error", "No se pudo registrar el jugador.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Registrar Jugador</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del Jugador"
        value={nombreJugador}
        onChangeText={setNombreJugador}
      />

      {imagenJugador && (
        <Image source={{ uri: imagenJugador }} style={styles.imagePreview} />
      )}

      <Button
        title="Seleccionar Imagen"
        onPress={seleccionarImagen}
        color="#1E90FF"
      />

      <Button
        title={isLoading ? "Registrando..." : "Registrar Jugador"}
        onPress={handleRegistroJugador}
        disabled={isLoading}
        color="#1E90FF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 60,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  imagePreview: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 10,
  },
});

