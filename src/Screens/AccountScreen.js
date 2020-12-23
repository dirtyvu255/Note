import React from 'react';
import {Text, View, TextInput, TouchableOpacity, Image, SafeAreaView  } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import auth from '@react-native-firebase/auth';
import Header from '../components/Header'
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class AccountScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name : '',
      email: "",
      currentPassword: "",
      newPassword: "",
      newPPassword: "",
      isPassConfirm: false,
      isNameConfirm: false,
      errorCurrent: "",
      errorNew: '',
      errorNewP: '',
      error: '',
      isShowAlert: false,
    }
  }
  componentDidMount(){
    this.getUser()
  }

  getUser(){
    const user = auth().currentUser
    if (user.displayName){
      this.setState({name: user.displayName, email: user.email})
    }else{
      this.setState({name: 'New User', email: user.email})
    }
  }

  reAuth = (currentPassword) => {
    let cred = auth.EmailAuthProvider.credential(auth().currentUser.email, currentPassword)
    auth().currentUser.reauthenticateWithCredential(cred).catch(error => {
      if(error.code == 'auth/wrong-password'){
        this.setState({errorCurrent: 'Wrong password', errorNew: ''})
      }
    })
    return  auth().currentUser.reauthenticateWithCredential(cred)
  }
  
  updateProfile(){
      auth().currentUser
      .updateProfile({
        displayName: `${this.state.name}`
      })
      .then(
        async() => {
        await this.getUser()
        await AsyncStorage.setItem('username', this.state.name)
        }
      )
      .catch(error => {
        if(error.code == 'auth/weak-password'){
          this.setState({errorNew: 'Password is too weak', errorCurrent: ''})
        }
      })
  }

  updatePassword(){
    auth().currentUser.updatePassword(this.state.newPassword)
    .then(() => {
      this.setState({errorCurrent: '', errorNew: '', newPassword: '', currentPassword: '', newPPassword: '', errorNewP: ''}),
      this.ShowAlert()
    }).catch(error => {
    })
  }

  showConfirm(type){
    if(type == 'name')
    this.setState({isNameConfirm: true})
    if(type == 'pass')
    this.setState({isPassConfirm: true})
  }
  hideConfirm(){
    this.setState({isNameConfirm: false})    
    this.setState({isPassConfirm: false})
    this.getUser()
    this.setState({errorNew: '', errorNewP: '',errorCurrent: ''})
  }

  ShowAlert(){
    this.setState({isShowAlert: !this.state.isShowAlert})
  }
  HideAlert(){
    this.setState({isShowAlert: !this.state.isShowAlert})
    this.hideConfirm()
  }

  editName() {
    if(this.state.name == ''){
      this.setState({error: 'Name can not be blank'})
    }
    else{
      this.ShowAlert()
      this.updateProfile()
    }
  }
  
  editPass = async(currentPassword) => {
    this.setState({errorNew: '', errorNewP: '',errorCurrent: ''})
    if( this.state.currentPassword == ''){
      this.setState({errorCurrent: 'This field can not be blank'})
    }
    if( this.state.newPassword == ''){
      this.setState({errorNew: 'This field can not be blank'})
    }
    if( this.state.newPPassword == ''){
      this.setState({errorNewP: 'This field can not be blank'})
    } else {
      if(this.state.newPassword.length < 6){
        this.setState({errorNew: 'Password is too weak'})
      } 
      if(this.state.newPassword !== this.state.newPPassword) {
        this.setState({errorNewP: 'Confirm password does not match'})
      } 
      else{
        await this.reAuth(currentPassword)
        this.updatePassword()
      }
    }
  }
  render(){
  return (
    <View style={styles.containerCustom}>      
      <SafeAreaView/>
        <View style={styles.container}>      
          <Header name={'PROFILE'}></Header>
          <View style={styles.wrapper2}>
          <Image style={styles.avatar} source={require('../images/wear_mask.png')} />
            <View>
              <View style={styles.textInputWrapper}>
                <Text style={styles.nameTag}>Name:</Text>
                <Text style={styles.nameTag} numberOfLines={1}>{this.state.name}</Text> 
                <TouchableOpacity onPress={() => this.showConfirm('name')}>
                  <Image style={styles.editName} source={require('../images/edit.png')} />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <View style={styles.textInputWrapper}>
                <Text style={styles.emailTag}>Email:</Text>
                <Text style={styles.emailTag} numberOfLines={1}>{this.state.email}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => this.showConfirm('pass')}>
                <Text style={[styles.buttonName]}>Edit Password</Text>
            </TouchableOpacity>
          </View>
          {this.state.isPassConfirm ? (
            <Modal isVisible={this.state.isPassConfirm} onBackdropPress={()=>this.hideConfirm()}>
                <View style={styles.notiContainer}>
                    <Text style={styles.notiTitle}>Change password</Text>
                    <Text style={styles.notiText}>Current Password</Text>
                    <TextInput
                      secureTextEntry
                      style={styles.textInput}
                      onChangeText={(text) => this.setState({currentPassword: text})} 
                      value={this.state.currentPassword}
                    />
                    {this.state.errorCurrent != '' ? (
                      <Text style={styles.error}>{this.state.errorCurrent}</Text>
                    ): null}
                    <Text style={[styles.notiText, {marginTop: 25}]}>New Password</Text>
                    <TextInput
                      secureTextEntry
                      style={styles.textInput}
                      onChangeText={(text) => this.setState({newPassword: text})} 
                      value={this.state.newPassword}
                    />
                    {this.state.errorNew != '' ? (
                      <Text style={styles.error}>{this.state.errorNew}</Text>
                    ): null}
                    <Text style={[styles.notiText, {marginTop: 25}]}>Confirm New Password</Text>
                    <TextInput
                      secureTextEntry
                      style={styles.textInput}
                      onChangeText={(text) => this.setState({newPPassword: text})} 
                      value={this.state.newPPassword}
                    />
                    {this.state.errorNewP != '' ? (
                      <Text style={styles.error}>{this.state.errorNewP}</Text>
                    ): null}
                  <TouchableOpacity style={styles.buttonModal} onPress={() => this.editPass(this.state.currentPassword)}>
                      <Text style={styles.buttonName}>Confirm</Text>
                  </TouchableOpacity>
                </View>
            <Modal isVisible={this.state.isShowAlert} onBackdropPress={() => this.HideAlert()}>
              <View style={styles.containerAlert}>
                <Image 
                    source={require('../images/tick.png')}
                    style={styles.imageAlert}
                />
                <Text style={styles.nameAlert}>Updated!</Text>
              </View>
            </Modal>
          </Modal> 
            ) : null}

          {this.state.isNameConfirm ? (
            <Modal isVisible={this.state.isNameConfirm} onBackdropPress={()=>this.hideConfirm()}>
              <View style={styles.notiContainer}>
                <Text style={styles.notiTitle}>Edit name</Text>
                <TextInput              
                  style={styles.textInputEditName}
                  placeholder="New Name"
                  onChangeText={(text) => this.setState({name: text})} 
                  value={this.state.name}
                /> 
                {this.state.error != '' ? (
                  <Text style={styles.error}>{this.state.error}</Text>
                ) : null}
                <TouchableOpacity style={styles.buttonModal} onPress={() => this.editName()}>
                    <Text style={styles.buttonName}>Confirm</Text>
                </TouchableOpacity>
              </View>
              <Modal isVisible={this.state.isShowAlert} onBackdropPress={() => this.HideAlert()}>
                <View style={styles.containerAlert}>
                  <Image 
                      source={require('../images/tick.png')}
                      style={styles.imageAlert}
                  />
                  <Text style={styles.nameAlert}>Updated!</Text>
                </View>
              </Modal>  
            </Modal> 
            ) : null}
          </View>
    </View>
  );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerCustom:{
    flex:1 ,
    backgroundColor: '#5FBCE7',
  },
  avatar: {
    height: '10rem',
    width: '10rem',
    alignSelf: 'center',
    marginVertical: '1.5rem'
  },
  textInput:{
    fontSize: '1.1rem',
    borderBottomWidth: '0.1rem',
    borderBottomColor: 'gray',
    width: '16rem',
    paddingVertical: '0.5rem',
    marginLeft: '0.1rem',
  },
  textInputEditName:{
    fontSize: '1.1rem',
    borderBottomWidth: '0.1rem',
    borderBottomColor: 'gray',
    width: '16rem',
    paddingVertical: '0.5rem',
    marginLeft: '0.1rem',
    color: 'grey'
  },
  textInputWrapper:{
    flexDirection: 'row',
    padding: '0.5rem',
    alignItems: 'center',
    marginBottom: '0.3rem',
    width: '65%'
  },
  nameTag:{
    fontSize: '1.2rem',
    marginRight: '3.1rem',
    marginLeft: '0.5rem'
  },
  passwordTag:{
    fontSize: '1.2rem',
    marginRight: '1.1rem',
    marginLeft: '0.5rem'
  },
  emailTag:{
    fontSize: '1.2rem',
    marginRight: '3.4rem',
    marginLeft: '0.5rem'
  },
  headerText:{
    padding: '1rem',
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  userName:{
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  avt:{
    width: '10rem',
    height: '10rem',
    borderRadius: '5rem',
    marginBottom: '1rem'
  },
  wrapper2:{
    flex: 2,
    width: '100%',
    marginTop: '1rem'
  },
  buttonName:{
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase'
  },
  button:{
    marginTop: '1rem',
    backgroundColor: '#5FBCE7',
    borderRadius: '5rem',
    padding: '1rem',
    alignItems: 'center',
    marginHorizontal: '2.5rem',    
  },
  buttonModal:{
    marginTop: '1rem',
    backgroundColor: '#5FBCE7',
    borderRadius: '5rem',
    padding: '1rem',
    alignItems: 'center',
    marginHorizontal: '2rem',    
  },
  notiContainer: {
    marginTop: '-3.8rem',
    backgroundColor: '#fff', 
    position: 'absolute',
    padding : "1rem",
    width: '20rem',
    marginLeft: '2rem',
    justifyContent: 'center',
    borderRadius: 20
  },
  notiTitle:{
    fontSize: '1.7rem',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: "0.5rem",
    marginBottom: '0.5rem',
    textTransform: 'uppercase'
  },
  notiText:{
    fontSize: '1.3rem',
    fontWeight: '500',
    marginTop: "0.5rem",
    marginBottom: '0.5rem'
  },
  editName:{
    height: '1.1rem',
    width: '1.1rem'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    paddingTop: '1rem'
  },
  containerAlert: {
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    height: '14rem',
    width: '16rem',
    alignSelf: 'center'
  },
  imageAlert: {
      height: '4.5rem',
      width: '4.5rem',
      alignSelf: 'center',
      marginBottom: '2rem',
  },
  nameAlert: {
      fontWeight: '500',
      fontSize: '1.7rem',
      textAlign: 'center',
  },
});
