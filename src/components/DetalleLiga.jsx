import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { getFirestore, collection, getDocs, onSnapshot } from 'firebase/firestore';
import app from '../utils/firebase';

const db = getFirestore(app);

export default function DetalleLiga({ route, navigation }) {
    const { ligaId, nombre } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [equipos, setEquipos] = useState([]);
    
    if (!ligaId) {
        console.error("No se recibió ligaId");
        return null;  
    }

    useEffect(() => {
        // Listener en tiempo real para obtener equipos
        const unsubscribe = onSnapshot(collection(db, "ligas", ligaId, "equipos"), (querySnapshot) => {
            const equiposData = querySnapshot.docs.map(doc => doc.data());
            setEquipos(equiposData);
            setIsLoading(false); // Detener el loading después de cargar los datos
        }, (error) => {
            console.error("Error al obtener equipos:", error);
            setIsLoading(false); // Detener el loading en caso de error
        });

        // Limpiar el listener cuando el componente se desmonte
        return () => unsubscribe();
    }, [ligaId]);

    const renderEquipo = ({ item }) => (
        <View style={styles.equipoItem}>
            <Text style={styles.equipoNombre}>{item.nombre}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.ligaTitle}>Liga: {nombre}</Text>
            <Text style={styles.subtitle}>Equipos:</Text>
            {isLoading ? (
                <Text>Cargando equipos...</Text>
            ) : equipos.length === 0 ? (
                <Text>No hay equipos registrados en esta liga.</Text>
            ) : (
                <FlatList
                    data={equipos}
                    renderItem={renderEquipo}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
  
            <Button 
                title="Agregar Equipo"
                onPress={() => navigation.navigate('RegistroEquipos', { ligaId })} // Asegúrate de que la pantalla 'RegistroEquipos' esté configurada
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
  ligaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  equipoItem: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 8,
  },
  equipoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});