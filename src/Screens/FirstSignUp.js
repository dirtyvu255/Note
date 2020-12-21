import React from 'react'
import {View, Image, Text, TouchableOpacity, ActivityIndicator} from 'react-native'
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'
import EStyleSheet from 'react-native-extended-stylesheet'

export default class FirstSignUp extends React.Component{
    constructor(props){
        super(props);
        this.state={
            status: [] ,
            priority: [],
            category: [],
            date: '',
            confirm: 0
        }
    }
    componentDidMount(){
      this.firstTimeSetup()
    }

    firstTimeSetup = async() => {
        const id =  await AsyncStorage.getItem('userID')
        await this.getDate()

        firestore()
      .collection(`Status`)
      .onSnapshot(snapshot => {
          let data = []
        snapshot.forEach( doc => {
          data.push({...doc.data(), id: doc.id})
        })
        this.setState({confirm: this.state.confirm + 1})  
        data.forEach( ele => {
            firestore()
        .collection(`Users/${id}/Status`)
        .add({
            nameStatus: ele.nameStatus,
            dateAddStatus: this.state.date,
            date: new Date(),
            color: Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
            count: 0
          })
        })
      })
        

      
      firestore()
      .collection(`Priority`)
      .onSnapshot(snapshot => {
          let data = []
        snapshot.forEach( doc => {
          data.push({...doc.data(), id: doc.id})
        })
        this.setState({confirm: this.state.confirm + 1})  
        data.forEach( ele => {
            firestore()
        .collection(`Users/${id}/Priority`)
        .add({
            namePriority: ele.namePriority,
            dateAddPriority: this.state.date,
            date: new Date(),
            color: Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
            count: 0
          })
        })
      })
        

      firestore()
      .collection(`Category`)
      .onSnapshot(snapshot => {
          let data = []
        snapshot.forEach( doc => {
          data.push({...doc.data(), id: doc.id})
        })
        this.setState({confirm: this.state.confirm + 1})  
        data.forEach( ele => {
            firestore()
        .collection(`Users/${id}/Category`)
        .add({
            nameCategory: ele.nameCategory,
            dateAddCategory: this.state.date,
            date: new Date(),
            color: Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
            count: 0
          })
        })
      })
        

    }
    getDate(){
        let date = new Date().getDate(); 
        if(date < 10){
            date = `0${date}`
        }
        let month = new Date().getMonth() + 1; 
        if(month < 10){
            month = `0${month}`
        }
        let year = new Date().getFullYear(); 
        let time = date + '/' + month + '/' + year
        this.setState({date: time})
    }
    render()  {
      return (
        <View style={styles.container}>   
            <Image
                style={styles.logo}
                source={require('../images/logo.png')}
            />
            <Text style={styles.title}>Welcome to NoteApp!</Text>
            <Text style={styles. des}>Created by WhatAreYou Team!</Text>

            {this.state.confirm == 3 ? (
              <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Note App')}>
              <Text style={styles.buttonName}>Continue</Text>
            </TouchableOpacity>
            ) : <ActivityIndicator></ActivityIndicator>}
        </View>
    );
  }
  }

  const styles = EStyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#EEEEEE',
      alignItems: 'center',
    },
    containerCustom:{
      flex:1 ,
      backgroundColor: '#5FBCE7',
    },
    logo: {
      alignSelf: 'center',
      height: '20rem',
      width: '20rem',
      marginTop: '5rem',
      marginBottom: '4rem'
    },
    title: {
      textAlign: 'center',
      fontSize: '2rem',
      color: "#5FBCE7"
    },
    des: {
      textAlign: 'center',
      marginTop: '1rem',
      marginBottom: '4rem'
    },
    buttonName:{
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: 'white',
      textTransform: 'uppercase'
    },
    button:{
      backgroundColor: '#5FBCE7',
      borderRadius: '5rem',
      padding: '1rem',
      paddingVertical: '0.8rem',
      alignItems: 'center',
      marginHorizontal: '4rem',        
    },
    
  });