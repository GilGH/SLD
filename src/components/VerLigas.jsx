import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from '../utils/firebase';

const db = getFirestore(app);

export default function VerLigas({ navigation }) {
  const [ligas, setLigas] = useState([]);

  useEffect(() => {
    const fetchLigas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ligas"));
        const ligasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLigas(ligasData);
      } catch (error) {
        console.error("Error al obtener ligas:", error);
      }
    };

    fetchLigas();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.ligaItem} 
      onPress={() => navigation.navigate('RegistroEquipos', { ligaId: item.id })}
    >
      <Text style={styles.ligaNombre}>{item.nombre}</Text>
      <Text style={styles.ligaDescripcion}>{item.descripcion}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ligas Disponibles</Text>
      {ligas.length === 0 ? (
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
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 10,
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
