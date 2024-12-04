import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore';
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

    const confirmarEliminacion = () => {
        Alert.alert(
            "Confirmar eliminación",
            `¿Estás seguro de que deseas eliminar al jugador "${nombreJugador}"? Esta acción no se puede deshacer.`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", onPress: eliminarJugador, style: "destructive" },
            ]
        );
    };

    const eliminarJugador = async () => {
        try {
            await deleteDoc(doc(db, "ligas", ligaId, "equipos", equipoId, "jugadores", jugadorId));
            Alert.alert("Jugador eliminado", `El jugador "${nombreJugador}" ha sido eliminado.`);
            navigation.goBack(); // Regresar a la pantalla anterior
        } catch (error) {
            console.error("Error al eliminar el jugador:", error);
            Alert.alert("Error", "No se pudo eliminar el jugador. Inténtalo de nuevo.");
        }
    };

    if (isLoading) {
        return <Text>Cargando detalles del jugador...</Text>;
    }

    if (!jugador) {
        return <Text>No se encontraron detalles del jugador.</Text>;
    }

    return (
        <View style={styles.container}>
            {/* Botón para eliminar */}
            <TouchableOpacity style={styles.deleteButton} onPress={confirmarEliminacion}>
                <MaterialIcons name="delete" size={24} color="white" />
            </TouchableOpacity>

            {/* Botón para editar */}
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate("Editar Jugador", { ligaId, equipoId, jugadorId, jugador })}
            >
                <MaterialIcons name="edit" size={24} color="white" />
            </TouchableOpacity>

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
    deleteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#f44336',
        borderRadius: 50,
        padding: 10,
        zIndex: 10,
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
    editButton: {
        position: "absolute",
        top: 10,
        right: 60,
        backgroundColor: "#4CAF50",
        borderRadius: 50,
        padding: 10,
        zIndex: 10,
      },
});

