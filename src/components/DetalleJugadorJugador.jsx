import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../utils/firebase';

const db = getFirestore(app);

export default function DetalleJugador({ route, navigation }) {
    const { ligaId, equipoId, jugadorId, nombreJugador } = route.params; // Obtener ligaId, equipoId y jugadorId
    const [jugador, setJugador] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imagen, setImagen] = useState(null); // Estado para la imagen del jugador

    useEffect(() => {
        // Obtener los detalles del jugador desde Firestore
        const obtenerJugador = async () => {
            try {
                const jugadorRef = doc(db, "ligas", ligaId, "equipos", equipoId, "jugadores", jugadorId);
                const jugadorDoc = await getDoc(jugadorRef);

                if (jugadorDoc.exists()) {
                    setJugador(jugadorDoc.data());
                    setImagen(jugadorDoc.data().imagen); // Obtener la imagen del jugador
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
            {/* Imagen del jugador */}
            {imagen ? (
                <Image source={{ uri: imagen }} style={styles.jugadorImage} resizeMode="cover" />
            ) : (
                <Text>Cargando imagen...</Text>
            )}

            {/* Información del jugador */}
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
    jugadorImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
        marginTop: 40,
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