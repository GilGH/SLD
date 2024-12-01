import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import app from '../utils/firebase';

const db = getFirestore(app);

export default function RegistroJugador({ route, navigation }) {
    const { ligaId, equipoId } = route.params;  // Obtener ligaId y equipoId
    const [nombreJugador, setNombreJugador] = useState('');

    const handleRegistroJugador = async () => {
        if (nombreJugador.trim() === '') {
            Alert.alert("Error", "El nombre del jugador no puede estar vacío.");
            return;
        }

        try {
            // Registrar el jugador en Firestore
            await addDoc(collection(db, "ligas", ligaId, "equipos", equipoId, "jugadores"), { nombre: nombreJugador });
            Alert.alert("Éxito", "Jugador registrado correctamente.");
            setNombreJugador('');

            // Regresar a la pantalla de detalle del equipo
            navigation.goBack();
        } catch (error) {
            console.error("Error al registrar jugador:", error);
            Alert.alert("Error", "No se pudo registrar el jugador.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrar Jugador</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre del Jugador"
                value={nombreJugador}
                onChangeText={setNombreJugador}
            />
            <Button title="Registrar" onPress={handleRegistroJugador} />
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
