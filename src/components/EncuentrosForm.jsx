import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getFirestore, collection, query, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import app from '../utils/firebase';
import { useNavigation } from '@react-navigation/native';

const db = getFirestore(app);

export default function EncuentrosForm() {
  const [encuentros, setEncuentros] = useState([]);
  const [ligas, setLigas] = useState([]);
  const [ligasOpen, setLigasOpen] = useState(false);
  const [ligaSeleccionada, setLigaSeleccionada] = useState(null);
  const [ligaNombre, setLigaNombre] = useState({});
  const navigation = useNavigation();

  // Fetch all encuentros and ligas
  useEffect(() => {
    const q = query(collection(db, "encuentros"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEncuentros(data);
    });

    const ligaQuery = query(collection(db, "ligas"));
    const unsubscribeLigas = onSnapshot(ligaQuery, (querySnapshot) => {
      const ligasData = querySnapshot.docs.map((doc) => {
        const ligaData = doc.data();
        return {
          label: ligaData.nombre,
          value: doc.id,
        };
      });
      setLigas(ligasData);

      // Crear un objeto con los nombres de las ligas para acceder rápidamente por ID
      const ligaObj = querySnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().nombre;
        return acc;
      }, {});
      setLigaNombre(ligaObj);
    });

    return () => {
      unsubscribe();
      unsubscribeLigas();
    };
  }, []);

  const encuentrosFiltrados = ligaSeleccionada 
    ? encuentros.filter((encuentro) => encuentro.liga === ligaSeleccionada)
    : encuentros;

  const handleEliminarEncuentro = (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que deseas eliminar este encuentro?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            await deleteDoc(doc(db, "encuentros", id));
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Dropdown para seleccionar la liga */}
      <DropDownPicker
        open={ligasOpen}
        value={ligaSeleccionada}
        items={ligas}
        setOpen={setLigasOpen}
        setValue={setLigaSeleccionada}
        setItems={setLigas}
        placeholder="Filtrar por Liga"
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
      />

      {encuentrosFiltrados.length > 0 ? (
        <FlatList
          data={encuentrosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.encuentro}>
              <Text style={styles.encuentroTitle}>
                {item.local} vs {item.visitante}
              </Text>
              <Text>Liga: {ligaNombre[item.liga] || "Desconocida"}</Text> {/* Mostrar el nombre de la liga */}
              <Text>Fecha: {item.fecha}</Text>
              <Text>Hora: {item.hora}</Text>
              <Text>Lugar: {item.lugar}</Text>

              {/* Botón para eliminar el encuentro */}
              <TouchableOpacity 
                style={styles.eliminarButton} 
                onPress={() => handleEliminarEncuentro(item.id)}
              >
                <Text style={styles.eliminarButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noEncuentrosText}>
          {ligaSeleccionada 
            ? `No hay encuentros para la liga seleccionada` 
            : "No hay encuentros generados"}
        </Text>
      )}

      <Button
        title="Generar Encuentro"
        onPress={() => navigation.navigate("GenerarEncuentro")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
  encuentro: {
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  encuentroTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noEncuentrosText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  eliminarButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    alignItems: 'center',
  },
  eliminarButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
