import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import app from '../utils/firebase';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

const db = getFirestore(app);

export default function RegistroJugador({ route }) {
  const { ligaId, equipoId } = route.params; // Obtener ligaId y equipoId
  const [nombreJugador, setNombreJugador] = useState('');
  const [posicionJugador, setPosicionJugador] = useState(''); // Nuevo estado para posición
  const [edadJugador, setEdadJugador] = useState(''); // Nuevo estado para edad
  const [imagenJugador, setImagenJugador] = useState(null);
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
      setImagenJugador(result.assets[0].uri);
    } else {
      Alert.alert("Error", "No se seleccionó ninguna imagen.");
    }
  };

  // Función para registrar al jugador
  const handleRegistroJugador = async () => {
    if (nombreJugador.trim() === '' || posicionJugador.trim() === '' || edadJugador.trim() === '') {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    if (isNaN(edadJugador) || Number(edadJugador) <= 0) {
      Alert.alert("Error", "La edad debe ser un número positivo.");
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, "ligas", ligaId, "equipos", equipoId, "jugadores"), {
        nombre: nombreJugador,
        posicion: posicionJugador,
        edad: Number(edadJugador), // Guardar edad como número
        imagen: imagenJugador,
        fechaCreacion: new Date().toISOString(),
      });
      Alert.alert("Éxito", "Jugador registrado correctamente.");
      setNombreJugador('');
      setPosicionJugador('');
      setEdadJugador('');
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
      <TextInput
        style={styles.input}
        placeholder="Posición del Jugador"
        value={posicionJugador}
        onChangeText={setPosicionJugador}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad del Jugador"
        value={edadJugador}
        onChangeText={setEdadJugador}
        keyboardType="numeric"
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
