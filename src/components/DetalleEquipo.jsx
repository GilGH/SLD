import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getFirestore, collection, onSnapshot, doc, deleteDoc, getDoc } from 'firebase/firestore';
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
 
  const confirmarEliminacion = () => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar el equipo "${nombreEquipo}"? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: eliminarEquipo, style: "destructive" },
      ]
    );
  };
 
  const eliminarEquipo = async () => {
    try {
      await deleteDoc(doc(db, "ligas", ligaId, "equipos", equipoId));
      Alert.alert("Equipo eliminado", `El equipo "${nombreEquipo}" ha sido eliminado.`);
      navigation.goBack(); // Regresar a la pantalla anterior
    } catch (error) {
      console.error("Error al eliminar el equipo:", error);
      Alert.alert("Error", "No se pudo eliminar el equipo. Inténtalo de nuevo.");
    }
  };
 
  return (
    <View style={styles.container}>
      {/* Botón para eliminar */}
      <TouchableOpacity style={styles.deleteButton} onPress={confirmarEliminacion}>
        <MaterialIcons name="delete" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("Editar Equipo", { ligaId, equipoId, nombreEquipo, logo })}
      >
        <MaterialIcons name="edit" size={24} color="white" />
      </TouchableOpacity>
 
 
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
 
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("RegistroJugador", { ligaId, equipoId })}
      >
        <Text style={styles.addButtonText}>Agregar Jugador</Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#f44336",
    borderRadius: 50,
    padding: 10,
    zIndex: 10,
  },
  equipoImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 40,
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
  addButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});