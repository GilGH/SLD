import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'

export default function Auth() {
    const [isLogin, setIsLogin] = useState(false)

    const changeForm = () => {
        setIsLogin(!isLogin)
    }

  return (
    <View style={styles.view}>
        <Image style={styles.logo} source={require('../../assets/sld.jpg')}/>
        {isLogin ? <LoginForm changeForm={changeForm}/> : <RegisterForm changeForm={changeForm}/>}
    </View>
  )
}

const styles = StyleSheet.create({
    logo:{
        width:180,
        height:180,
        marginTop:10,
        marginBottom:10,
        borderRadius:100
    },
    view:{
        flex:1,
        alignItems:'center',
        width:'100%',
        marginTop:50,
        marginBottom:50,
    }
})
