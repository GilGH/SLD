import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { doc, updateDoc } from "firebase/firestore";
import app from "../utils/firebase";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getFirestore } from "firebase/firestore";


export default function EditarLiga({ route }) {
  const { ligaId, nombre, desc, logo } = route.params;
  const [nombreLiga, setNombreLiga] = useState(nombre || '');
  const [descripcion, setDescripcion] = useState(desc || '');
  const [logoUri, setLogoUri] = useState(logo || null);
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
      setLogoUri(resultado.assets[0].uri);
    } else {
      Alert.alert("Error", "No se seleccionó ninguna imagen.");
    }
  };

  const handleEditarLiga = async () => {
    if (!nombreLiga || !descripcion) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    setCargando(true);
    try {
      const docRef = doc(db, "ligas", ligaId);
      await updateDoc(docRef, {
        nombre: nombreLiga,
        descripcion,
        logo: logoUri,
      });
      Alert.alert("Éxito", "Liga modificada correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo modificar la liga: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Editar Liga</Text>

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

      {logoUri && (
        <Image source={{ uri: logoUri }} style={styles.logoPreview} />
      )}

      <Button style={styles.btnLogo}
        title="Seleccionar Nuevo Logo"
        onPress={seleccionarImagen}
        color="#1E90FF"
      />

      <Button
        title={cargando ? "Guardando..." : "Guardar Cambios"}
        onPress={handleEditarLiga}
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
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    fontSize: 16,
    padding: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  logoPreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  btnLogo: {
    marginBottom: 20,
  },
});

