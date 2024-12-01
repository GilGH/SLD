import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getAuth, signOut } from "firebase/auth";
import app from '../utils/firebase';

const auth = getAuth(app);

const LogoutButton = ({ setUser }) => {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Sesión cerrada");
        setUser(false);  // Actualizar el estado de `user` en App.js
      })
      .catch((error) => {
        console.error("Error al cerrar sesión", error);
      });
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <Text style={styles.logoutText}>Cerrar sesión</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    padding: 10,
    backgroundColor: '#FF6347',  // Color rojo de ejemplo
    borderRadius: 5,
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LogoutButton;


