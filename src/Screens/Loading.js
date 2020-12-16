import React, { Component } from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'




export default class Loading extends Component {
    componentDidMount(){
        this.getUser();
    }
    getUser = async() =>{
        try{
            const userID = await AsyncStorage.getItem('userID')
            if(userID){
                this.props.navigation.navigate('Note App')
            }else{
                this.props.navigation.navigate('Login')
            }
        }catch(e){
        }
    }
  render() {
    return (
        <View>
        </View>
    );
  }
};