import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { getFirestore, collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import app from '../utils/firebase';

const db = getFirestore(app);

export default function DetalleEquipo({ route, navigation }) {
  const { ligaId, equipoId, nombreEquipo } = route.params;
  const [jugadores, setJugadores] = useState([]);
  const [logo, setLogo] = useState(null); // Estado para el logo del equipo
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener el logo del equipo
    const fetchEquipoData = async () => {
      try {
        const docRef = doc(db, "ligas", ligaId, "equipos", equipoId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLogo(docSnap.data().logo); // Obtener Logo
        } else {
          console.error("No se encontró el documento del equipo:", equipoId);
        }
      } catch (error) {
        console.error("Error al obtener el documento del equipo:", error);
      }
    };

    fetchEquipoData();
  }, [ligaId, equipoId]);

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

    return () => unsubscribe();
  }, [ligaId, equipoId]);

  const renderJugador = ({ item }) => (
    <TouchableOpacity
      style={styles.jugadorItem}
      onPress={() => navigation.navigate('DetalleJugador', { ligaId, equipoId, jugadorId: item.id })}
    >
      <Text style={styles.jugadorNombre}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Imagen del logo del equipo */}
      {logo ? (
        <Image source={{ uri: logo }} style={styles.equipoImage} resizeMode="cover" />
      ) : (
        <Text>Cargando logo...</Text>
      )}

      {/* Información del equipo */}
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
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  equipoImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 40,
  },
  equipoTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  jugadorItem: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginBottom: 8,
  },
  jugadorNombre: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
