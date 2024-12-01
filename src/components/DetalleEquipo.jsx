// DetalleEquipo.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity } from 'react-native';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import app from '../utils/firebase';

const db = getFirestore(app);

export default function DetalleEquipo({ route, navigation }) {
    const { ligaId, equipoId, nombreEquipo } = route.params; // Obtener el equipoId y nombreEquipo
    const [jugadores, setJugadores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Listener en tiempo real para obtener los jugadores del equipo
        const unsubscribe = onSnapshot(collection(db, "ligas", ligaId, "equipos", equipoId, "jugadores"), (querySnapshot) => {
            const jugadoresData = querySnapshot.docs.map(doc => ({
                id: doc.id, // Obtener el ID del jugador
                ...doc.data(),
            }));
            setJugadores(jugadoresData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error al obtener jugadores:", error);
            setIsLoading(false);
        });

        // Limpiar el listener cuando el componente se desmonte
        return () => unsubscribe();
    }, [ligaId, equipoId]);

    const renderJugador = ({ item }) => (
        <TouchableOpacity
            style={styles.jugadorItem}
            onPress={() => navigation.navigate('DetalleJugador', { ligaId, equipoId, jugadorId: item.id })} // Navegar al detalle del jugador
        >
            <Text style={styles.jugadorNombre}>{item.nombre}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.equipoTitle}>Equipo: {nombreEquipo}</Text>
            <Text style={styles.subtitle}>Jugadores:</Text>
            {isLoading ? (
                <Text>Cargando jugadores...</Text>
            ) : jugadores.length === 0 ? (
                <Text>No hay jugadores en este equipo.</Text>
            ) : (
                <FlatList
                    data={jugadores}
                    renderItem={renderJugador}
                    keyExtractor={(item) => item.id} // Utiliza el ID del jugador como key
                />
            )}
  
            <Button
                title="Agregar Jugador"
                onPress={() => navigation.navigate('RegistroJugador', { ligaId, equipoId })}
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
  equipoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  jugadorItem: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 8,
  },
  jugadorNombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

