import { StyleSheet, Text, TextInput, View, Button, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../utils/firebase";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Puedes instalarlo: `expo install @expo/vector-icons`

export default function CrearLiga() {
  const [nombreLiga, setNombreLiga] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigation = useNavigation();
  const db = getFirestore(app);

  const handleCrearLiga = async () => {
    if (!nombreLiga || !descripcion) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    setCargando(true);
    try {
      await addDoc(collection(db, "ligas"), {
        nombre: nombreLiga,
        descripcion,
        fechaCreacion: new Date().toISOString(),
      });
      Alert.alert("Éxito", "Liga creada correctamente");
      setNombreLiga('');
      setDescripcion('');
      navigation.goBack(); // Vuelve automáticamente tras crear la liga
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la liga: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la Liga"
        value={nombreLiga}
        onChangeText={setNombreLiga}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <Button
        title={cargando ? "Creando..." : "Crear Liga"}
        onPress={handleCrearLiga}
        disabled={cargando}
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
    marginTop:10,
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
  textArea: {
    height: 80,
  },
});

