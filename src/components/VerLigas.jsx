import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import app from '../utils/firebase';

const db = getFirestore(app);

export default function VerLigas({ navigation }) {
  const [ligas, setLigas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listener en tiempo real para las ligas
    const unsubscribe = onSnapshot(
      collection(db, "ligas"),
      (querySnapshot) => {
        const ligasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLigas(ligasData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error al obtener ligas:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.ligaItem}
      onPress={() => navigation.navigate('Detalle de la Liga', { ligaId: item.id, nombre: item.nombre })}
    >
      {item.logo && <Image source={{ uri: item.logo }} style={styles.logo} />}
      <View style={styles.ligaInfo}>
        <Text style={styles.ligaNombre}>{item.nombre}</Text>
        <Text style={styles.ligaDescripcion}>{item.descripcion}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ligas Disponibles</Text>
      {isLoading ? (
        <Text>Cargando...</Text>
      ) : ligas.length === 0 ? (
        <Text>No hay ligas registradas.</Text>
      ) : (
        <FlatList
          data={ligas}
          renderItem={renderItem}
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  ligaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  ligaInfo: {
    flex: 1,
  },
  ligaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ligaDescripcion: {
    fontSize: 14,
    color: '#777',
  },
});
