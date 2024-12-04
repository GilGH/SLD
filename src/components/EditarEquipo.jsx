import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import app from '../utils/firebase';

const db = getFirestore(app);

export default function EditarEquipo({ route, navigation }) {
  const { ligaId, equipoId, nombreEquipo, logo } = route.params;

  const [nombre, setNombre] = useState(nombreEquipo);
  const [logoUrl, setLogoUrl] = useState(logo);
  const [isLoading, setIsLoading] = useState(false);

  // Función para seleccionar una imagen
  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permiso.status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para cambiar el logo.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setLogoUrl(resultado.assets[0].uri); // Actualiza la URL local con la imagen seleccionada
    }
  };

  // Función para actualizar datos en Firestore
  const actualizarEquipo = async () => {
    setIsLoading(true);
    try {
      const equipoRef = doc(db, 'ligas', ligaId, 'equipos', equipoId);
      await updateDoc(equipoRef, {
        nombre: nombre,
        logo: logoUrl,
      });
      Alert.alert('Equipo actualizado', 'El equipo ha sido actualizado exitosamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar el equipo:', error);
      Alert.alert('Error', 'No se pudo actualizar el equipo. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del equipo:</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre del equipo"
      />
      <Text style={styles.label}>Logo del equipo:</Text>
      <Image
        source={{ uri: logoUrl }}
        style={styles.logo}
      />
      <Button
        title="Seleccionar Nuevo Logo"
        onPress={seleccionarImagen}
        color="#1E90FF"
      />
      <Button
        title={isLoading ? 'Guardando...' : 'Guardar Cambios'}
        onPress={actualizarEquipo}
        disabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    alignSelf: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
