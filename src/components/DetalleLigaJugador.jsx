import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { getFirestore, collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import app from '../utils/firebase';

const db = getFirestore(app);

export default function DetalleLiga({ route, navigation }) {
  const { ligaId, nombre, fechaCreacion } = route.params;
  const [logo, setLogo] = useState(null); // Estado para el logo
  const [desc, setDesc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [equipos, setEquipos] = useState([]);

  if (!ligaId) {
    console.error("No se recibió ligaId");
    return null;
  }

  useEffect(() => {
    // Obtener el logo de la liga
    const fetchLigaData = async () => {
      try {
        const docRef = doc(db, "ligas", ligaId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLogo(docSnap.data().logo); // Obtener Logo
          setDesc(docSnap.data().descripcion); // Obtener Detalle
        } else {
          console.error("No se encontró el documento de la liga:", ligaId);
        }
      } catch (error) {
        console.error("Error al obtener el documento de la liga:", error);
      }
    };

    fetchLigaData();
  }, [ligaId]);

  useEffect(() => {
    // Listener para los equipos de la liga
    const unsubscribe = onSnapshot(
      collection(db, "ligas", ligaId, "equipos"),
      (querySnapshot) => {
        const equiposData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEquipos(equiposData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error al obtener equipos:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ligaId]);

  const renderEquipo = ({ item }) => (
    <TouchableOpacity
      style={styles.equipoItem}
      onPress={() => navegarADetalleEquipo(item.id, item.nombre)}
    >
      <Text style={styles.equipoNombre}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  const navegarADetalleEquipo = (equipoId, nombreEquipo) => {
    navigation.navigate("DetalleEquipo", { ligaId, equipoId, nombreEquipo });
  };

  return (
    <View style={styles.container}>
      {/* Imagen del logo */}
      {logo ? (
        <Image source={{ uri: logo }} style={styles.ligaImage} resizeMode="cover" />
      ) : (
        <Text>Cargando logo...</Text>
      )}

      {/* Información de la liga */}
      <Text style={styles.ligaTitle}>{nombre}</Text>
      <Text style={styles.description}>{desc}</Text>
      {fechaCreacion && (
        <Text style={styles.creationDate}>
          Fecha de creación: {new Date(fechaCreacion).toLocaleDateString()}
        </Text>
      )}

      <Text style={styles.subtitle}>Equipos:</Text>

      {isLoading ? (
        <Text>Cargando equipos...</Text>
      ) : equipos.length === 0 ? (
        <Text>No hay equipos registrados en esta liga.</Text>
      ) : (
        <FlatList
          data={equipos}
          keyExtractor={(item) => item.id}
          renderItem={renderEquipo}
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
  ligaImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 40,
  },
  ligaTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginVertical: 10,
  },
  creationDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  equipoItem: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginBottom: 8,
  },
  equipoNombre: {
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
