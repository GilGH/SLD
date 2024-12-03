import React from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, TouchableOpacity,Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LogoutButton from './LogoutButton';


export default function Principal() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>      
      <View style={styles.content}>
        <Text style={styles.contentText}>Bienvenido a la aplicación!</Text>
        <Image style={styles.logo} source={require('../../assets/sld.jpg')} />
        <Text style={styles.titleText}>Comienza con la administración de tu liga</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',  // Color de fondo general
    marginTop:20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal:10,
    backgroundColor: '#007BFF',  // Color de fondo del encabezado
    borderRadius: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuButton: {
    fontSize: 30,
    color: '#fff',
  },
  content: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentText: {
    fontSize: 18,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
});
