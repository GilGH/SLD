import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../utils/firebase';

const db = getFirestore(app);

export default function DetalleJugador({ route }) {
    const { ligaId, equipoId, jugadorId } = route.params; // Obtener ligaId, equipoId y jugadorId
    const [jugador, setJugador] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Obtener los detalles del jugador desde Firestore
        const obtenerJugador = async () => {
            try {
                const jugadorRef = doc(db, "ligas", ligaId, "equipos", equipoId, "jugadores", jugadorId);
                const jugadorDoc = await getDoc(jugadorRef);

                if (jugadorDoc.exists()) {
                    setJugador(jugadorDoc.data());
                } else {
                    console.log("No se encontró el jugador");
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener jugador:", error);
                setIsLoading(false);
            }
        };

        obtenerJugador();
    }, [ligaId, equipoId, jugadorId]);

    if (isLoading) {
        return <Text>Cargando detalles del jugador...</Text>;
    }

    if (!jugador) {
        return <Text>No se encontraron detalles del jugador.</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.jugadorTitle}>{jugador.nombre}</Text>
            <Text style={styles.jugadorInfo}>Posición: {jugador.posicion}</Text>
            <Text style={styles.jugadorInfo}>Edad: {jugador.edad}</Text>
            {/* Agregar más detalles del jugador según sea necesario */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    jugadorTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    jugadorInfo: {
        fontSize: 18,
        marginVertical: 5,
    },
});