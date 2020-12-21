import React from 'react'
import {Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-async-storage/async-storage'


export default class Header extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    const name = this.props.name
    return(
    <View style={styles.wrapper1}>
      <Text style={styles.title}>{name}</Text>
    </View>
    )
  }
}

const styles = EStyleSheet.create({  
    nameWrapper:{
      padding: '0.5rem'
    },
    textID:{
      textAlign: 'center',
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#F0F2EF'
    },
    textName:{
      textAlign: 'center',
      fontSize: '1.3rem',
      color: '#F0F2EF'
    },
    infoWrapper:{
      padding: '0.5rem',
      flexDirection : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1.5rem'
    },
    avt:{
      width: '8rem',
      height: '8rem',
      borderRadius: '5rem'
    },
    wrapper1:{
      justifyContent: 'center',
      backgroundColor: '#5FBCE7',
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
      width: '100%',
    },
    title:{
      padding: '0.5rem',
      fontSize: '2.0rem',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#F0F2EF',
      // marginTop: '3rem',
      marginBottom: '0.5rem'
    },
  });
