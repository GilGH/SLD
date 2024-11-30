import { Button, StyleSheet, Text,TextInput,TouchableOpacity,View } from 'react-native'
import React, { useState } from 'react'
import { validateEmail } from '../utils/validation'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterForm({changeForm}) {

  const[formData,setFormData] = useState({
    email:'',
    password:'',
    repeatPassword:''
  })

  const [formErrors, setFormErrors] = useState({

  })

  const register = () => {
    let errors = {}
    if(!formData.email || !formData.password || !formData.repeatPassword){
      if(!formData.email) errors.email = true
      if(!formData.password) errors.password = true
      if(!formData.repeatPassword) errors.repeatPassword = true
    }else if(!validateEmail(formData.email)){
      errors.email = true
    }else if(formData.password !== formData.repeatPassword){ 
      errors.password = true
      errors.repeatPassword = true
    }else if(formData.password.length < 6){
      errors.password = true
      errors.repeatPassword = true
    }else{
      console.log(formData)
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
  });
    }
    setFormErrors(errors)
    console.log(errors)
  }


  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, formErrors.email && styles.error]}
        placeholder='Correo electrónico'
        placeholderTextColor='#969696'
        onChange={e=>setFormData({...formData,email:e.nativeEvent.text})}
      />
      <TextInput
        style={[styles.input, formErrors.password && styles.error]}
        placeholder='Contraseña'
        placeholderTextColor='#969696'
        secureTextEntry
        onChange={e=>setFormData({...formData,password:e.nativeEvent.text})}
      />
      <TextInput
        style={[styles.input, formErrors.repeatPassword && styles.error]}
        placeholder='Repetir Contraseña'
        placeholderTextColor='#969696'
        secureTextEntry
        onChange={e=>setFormData({...formData,repeatPassword:e.nativeEvent.text})}
      />
      <Button title='Iniciar Sesión' onPress={changeForm}/>
      <View style={styles.register}>
      <TouchableOpacity onPress={register}>
        <Text style={styles.btnText}>Resgistrate</Text>
      </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    btnText:{
        color:'#000',
        fontSize:20,
        marginBottom:20,
        marginTop:30,
        textDecorationLine:'underline'
    },
    input: {
      height: 50,
      color: '#FFFFFF', //letras en blanco
      width: '100%',
      backgroundColor: '#1E3040', //fondo oscuro
      fontSize: 18,
      borderWidth: 1,
      borderRadius: 30,
      paddingHorizontal: 20,
      marginTop: 20,
      marginBottom: 10,
  },
    register:{
      justifyContent:'flex-end',
      marginBottom:10,
      alignItems:'center'

    },
    error:{
      borderColor:'#f00',
      borderWidth:4,
    },
    container:{
      width: '90%',
      padding: '10px',
      }
})
