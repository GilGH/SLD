import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import app from '../utils/firebase';

const db = getFirestore(app);

export default function EditarJugador({ route, navigation }) {
  const { ligaId, equipoId, jugadorId, jugador } = route.params;
  const [nombre, setNombre] = useState(jugador.nombre);
  const [posicion, setPosicion] = useState(jugador.posicion);
  const [edad, setEdad] = useState(jugador.edad);
  const [imagen, setImagen] = useState(jugador.imagen);

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permiso.status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para cambiar la imagen.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagen(resultado.assets[0].uri);
    }
  };

  const actualizarJugador = async () => {
    try {
      const jugadorRef = doc(db, "ligas", ligaId, "equipos", equipoId, "jugadores", jugadorId);
      await updateDoc(jugadorRef, {
        nombre,
        posicion,
        edad,
        imagen,
      });
      Alert.alert("Jugador actualizado", "El jugador ha sido actualizado exitosamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar el jugador:", error);
      Alert.alert("Error", "No se pudo actualizar el jugador. Inténtalo de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del jugador:</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>Posición:</Text>
      <TextInput style={styles.input} value={posicion} onChangeText={setPosicion} />

      <Text style={styles.label}>Edad:</Text>
      <TextInput style={styles.input} value={edad} onChangeText={setEdad} keyboardType="numeric" />

      <Image source={{ uri: imagen }} style={styles.image} />
      <TouchableOpacity style={styles.imageButton} onPress={seleccionarImagen}>
        <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      <Button title="Guardar Cambios" onPress={actualizarJugador} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 200,
    marginVertical: 20,
    borderRadius: 10,
  },
  imageButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});