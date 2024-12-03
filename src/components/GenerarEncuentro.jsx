import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert, Text, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getFirestore, collection, onSnapshot, addDoc } from 'firebase/firestore';
import app from '../utils/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';

const db = getFirestore(app);

export default function GenerarEncuentro({ navigation }) {
  // Liga Dropdown State
  const [ligasOpen, setLigasOpen] = useState(false);
  const [ligas, setLigas] = useState([]);
  const [ligaSeleccionada, setLigaSeleccionada] = useState(null);

  // Equipo Local Dropdown State
  const [localOpen, setLocalOpen] = useState(false);
  const [equiposLocal, setEquiposLocal] = useState([]);
  const [local, setLocal] = useState(null);

  // Equipo Visitante Dropdown State
  const [visitanteOpen, setVisitanteOpen] = useState(false);
  const [equiposVisitante, setEquiposVisitante] = useState([]);
  const [visitante, setVisitante] = useState(null);

  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState('');
  const [lugar, setLugar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarFechaPicker, setMostrarFechaPicker] = useState(false);
  const [mostrarHoraPicker, setMostrarHoraPicker] = useState(false);

  // Obtener ligas al cargar el componente
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "ligas"), (querySnapshot) => {
      const ligasData = querySnapshot.docs.map((doc) => ({
        label: doc.data().nombre,
        value: doc.id,
      }));
      setLigas(ligasData);
    });

    return () => unsubscribe(); // Limpiar listener al desmontar el componente
  }, []);

  // Obtener equipos de la liga seleccionada
  useEffect(() => {
    if (!ligaSeleccionada) {
      setEquiposLocal([]);
      setEquiposVisitante([]);
      return;
    }

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      collection(db, "ligas", ligaSeleccionada, "equipos"),
      (querySnapshot) => {
        const equiposData = querySnapshot.docs.map((doc) => ({
          label: doc.data().nombre,
          value: doc.data().nombre,
        }));
        setEquiposLocal(equiposData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error al obtener equipos:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ligaSeleccionada]);

  // Actualizar equipos visitante excluyendo el equipo local
  useEffect(() => {
    if (!ligaSeleccionada) {
      setEquiposVisitante([]);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "ligas", ligaSeleccionada, "equipos"),
      (querySnapshot) => {
        const equiposData = querySnapshot.docs
          .filter(doc => doc.data().nombre !== local)
          .map((doc) => ({
            label: doc.data().nombre,
            value: doc.data().nombre,
          }));
        setEquiposVisitante(equiposData);
      },
      (error) => {
        console.error("Error al obtener equipos visitantes:", error);
      }
    );

    return () => unsubscribe();
  }, [ligaSeleccionada, local]);

  const handleGenerarEncuentro = async () => {
    if (!ligaSeleccionada || !local || !visitante || !fecha || !hora || !lugar) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      await addDoc(collection(db, "encuentros"), {
        liga: ligaSeleccionada,
        local,
        visitante,
        fecha: fecha.toLocaleDateString(),
        hora,
        lugar,
      });

      Alert.alert("Éxito", "Encuentro generado correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al generar el encuentro:", error);
      Alert.alert("Error", "No se pudo generar el encuentro.");
    }
  };

  // Reset visitante when local team changes
  useEffect(() => {
    setVisitante(null);
  }, [local]);

  const onFechaSeleccionada = (event, selectedDate) => {
    setMostrarFechaPicker(false);
    if (selectedDate) setFecha(selectedDate);
  };

  const onHoraSeleccionada = (event, selectedTime) => {
    setMostrarHoraPicker(false);
    if (selectedTime) setHora(selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generar Encuentro</Text>

      {/* Liga Dropdown */}
      <DropDownPicker
        open={ligasOpen}
        value={ligaSeleccionada}
        items={ligas}
        setOpen={setLigasOpen}
        setValue={setLigaSeleccionada}
        setItems={setLigas}
        placeholder="Seleccionar Liga"
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
      />

      {isLoading ? (
        <Text>Cargando equipos...</Text>
      ) : (
        <>
          <View style={styles.equiposContainer}>
            {/* Equipo Local Dropdown */}
            <View style={styles.dropdownWrapper}>
              <Text style={styles.pickerLabel}>Local</Text>
              <DropDownPicker
                open={localOpen}
                value={local}
                items={equiposLocal}
                setOpen={setLocalOpen}
                setValue={setLocal}
                setItems={setEquiposLocal}
                placeholder="Seleccionar Local"
                disabled={!ligaSeleccionada}
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
              />
            </View>

            {/* Equipo Visitante Dropdown */}
            <View style={styles.dropdownWrapper}>
              <Text style={styles.pickerLabel}>Visitante</Text>
              <DropDownPicker
                open={visitanteOpen}
                value={visitante}
                items={equiposVisitante}
                setOpen={setVisitanteOpen}
                setValue={setVisitante}
                setItems={setEquiposVisitante}
                placeholder="Seleccionar Visitante"
                disabled={!local}
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
              />
            </View>
          </View>
        </>
      )}

      <TouchableOpacity onPress={() => setMostrarFechaPicker(true)}>
        <Text style={styles.datePicker}>
          Fecha: {fecha.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {mostrarFechaPicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display="default"
          onChange={onFechaSeleccionada}
        />
      )}

      <TouchableOpacity onPress={() => setMostrarHoraPicker(true)}>
        <Text style={styles.datePicker}>
          Hora: {hora || "Seleccionar hora"}
        </Text>
      </TouchableOpacity>

      {mostrarHoraPicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={onHoraSeleccionada}
        />
      )}

      <TextInput
        placeholder="Lugar del encuentro"
        value={lugar}
        onChangeText={setLugar}
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <Button title="Generar Encuentro" onPress={handleGenerarEncuentro} />
      </View>
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
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 30,
      textAlign: 'center',
    },
    pickerLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
    },
    dropdownWrapper: {
      flex: 1,
      marginHorizontal: 10,
    },
    dropdownContainer: {
      height: 50,
      marginBottom: 15,
    },
    dropdown: {
      backgroundColor: '#f2f2f2',
      borderRadius: 5,
    },
    equiposContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 20,
      zIndex: 1000, // Ensures dropdowns appear above each other
    },
    datePicker: {
      fontSize: 18,
      color: '#007BFF',
      marginVertical: 15,
      textAlign: 'center',
      padding: 10,
      backgroundColor: '#f2f2f2',
      borderRadius: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      marginVertical: 15,
      fontSize: 16,
    },
    buttonContainer: {
      marginTop: 20,
      paddingHorizontal: 20,
    }
  });