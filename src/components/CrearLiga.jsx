import { StyleSheet, Text, TextInput, View, Button, Alert, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../utils/firebase";
import * as ImagePicker from 'expo-image-picker'; // Importamos ImagePicker
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

export default function CrearLiga() {
  const [nombreLiga, setNombreLiga] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [logo, setLogo] = useState(null); // Para almacenar la URI de la imagen
  const [cargando, setCargando] = useState(false);

  const navigation = useNavigation();
  const db = getFirestore(app);

  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setLogo(resultado.assets[0].uri); // Guarda la URI seleccionada
    } else {
      Alert.alert("Error", "No se seleccionó ninguna imagen.");
    }
  };

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
        logo, // Guardamos la URI de la imagen seleccionada
        fechaCreacion: new Date().toISOString(),
      });
      Alert.alert("Éxito", "Liga creada correctamente");
      setNombreLiga('');
      setDescripcion('');
      setLogo(null);
      navigation.goBack(); 
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la liga: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Crear Nueva Liga</Text>

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

      {logo && (
        <Image source={{ uri: logo }} style={styles.logoPreview} />
      )}

      <Button style={styles.btnLogo}
        title="Seleccionar Logo"
        onPress={seleccionarImagen}
        color="#1E90FF"
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
    marginTop: 10,
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
  logoPreview: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 10,
  },
  btnLogo:{
    marginBottom:10,
  }
});



