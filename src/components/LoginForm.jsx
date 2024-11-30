import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginForm({ changeForm }) {
  const [formData, setFormData] = useState({ 
    email: '',
    password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (!formData.email || !formData.password) {
      setErrorMessage('Todos los campos son obligatorios');
      return;
    }

    const auth = getAuth();
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // Sesión iniciada correctamente
        setErrorMessage('');
        console.log('Usuario autenticado:', userCredential.user);
      })
      .catch((error) => {
        // Manejo de errores de inicio de sesión
        setErrorMessage('Error al iniciar sesión: ' + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor="#969696"
        onChange={e => setFormData({ ...formData, email: e.nativeEvent.text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#969696"
        secureTextEntry
        onChange={e => setFormData({ ...formData, password: e.nativeEvent.text })}
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <TouchableOpacity onPress={handleLogin} style={styles.btn}>
        <Text style={styles.btnText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <Button title="Registrarte" onPress={changeForm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 50,
    color: '#FFFFFF', // Texto en blanco
    width: '80%',
    backgroundColor: '#1E3040', // Fondo oscuro
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: '#1E3040',
    padding: 10,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    margin:10
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});