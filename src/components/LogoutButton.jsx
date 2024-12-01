import React from 'react';
import { Button, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

export default function LogoutButton({ navigation }) {
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return <Button title="Cerrar Sesión" onPress={handleLogout} />;
}
