import React from 'react';
import { Image, Text, View,TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'
import RenderList from '../components/RenderListAttributes'
import Header from '../components/Header'

export default class PriorityScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isModalVisible: false,
      isShowNoti: false,
      namePriority:'',
      dateAddPriority: '',
      isShowErr: false,
    }
    this.checkName = this.checkName.bind(this)
  }


  toggleModal(){
    this.setState({isModalVisible: !this.state.isModalVisible})
    this.setState({namePriority: ''})
  }
  showErr(){
    this.setState({isShowErr: true})
  }
  hideErr(){
    this.setState({isShowErr: false})
  }
  toggleNoti(){
    this.setState({isShowNoti: !this.state.isShowNoti})
  }
  
  getDateAdd(){
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
    this.setState({dateAddPriority: time})
  }

  addPriority = async() => {
    const userID = await AsyncStorage.getItem('userID')
    await this.getDateAdd()
    await firestore()
    .collection(`Users/${userID}/Priority`)
    .add({
      namePriority: this.state.namePriority,
      dateAddPriority: this.state.dateAddPriority,
      date: new Date(),
      color: Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    })
    .then(() => {
      this.toggleNoti()
      this.toggleModal()
    });
  }

  checkName(){
    if(this.state.namePriority == ''){
      this.showErr()
    }
    else{
      this.toggleNoti()
      this.hideErr()
    }
  }



  render(){
    return (
      <View style={styles.container}>
        <Header name={'PRIORITY'}></Header>
  
        <RenderList type="Priority"></RenderList>
        
        <View style={styles.addButton}>
          <TouchableOpacity
            onPress={()=>{this.toggleModal()}}
          >
            <Image 
              source={require('../images/add.png')}
              style={styles.addButtonImage}
            />
          </TouchableOpacity>
        </View>
        <Modal isVisible={this.state.isModalVisible} onBackdropPress={()=>this.toggleModal()}>
          <View style={styles.modalContainer}>          
              <Text style={styles.titleModal}>Add New</Text>
              <View style={styles.textInputWrapper}>              
                <TextInput 
                placeholder="Name priority..."
                style={styles.textInput}
                value={this.state.namePriority}
                onChangeText={value => this.setState({namePriority: value})}
                />
                <TouchableOpacity onPress={() => this.checkName()}>
                  <Image 
                    source={require('../images/add.png')}
                    style={styles.modalAddButton}
                  />
                </TouchableOpacity>
                {this.state.isShowNoti ? (
                  <Modal isVisible={this.state.isShowNoti} onBackdropPress={()=>this.toggleNoti()} backdropOpacity={0}>
                    <View style={styles.modalContainer}>         
                    <Text style={styles.titleModal}>Name is {this.state.namePriority}?</Text>
                    <View style={styles.confirmContainer}>
                      <TouchableOpacity
                        style={{marginRight: 120, marginTop: 30}}
                        onPress={()=>{this.addPriority()}}
                      >
                        <Image 
                        source={require('../images/add.png')}
                        style={styles.modalAddButton}
                      />
                      </TouchableOpacity>
                      <TouchableOpacity
                      style={{ marginTop: 30}}
                        onPress={()=>{this.toggleNoti()}}
                      >
                        <Image 
                        source={require('../images/cancel.png')}
                        style={styles.modalAddButton}
                      />
                      </TouchableOpacity>
                    </View>
                    </View>
                  </Modal>
                ) : null}
              </View>   
              {this.state.isShowErr ? (
                <Text style={styles.error}>Name priority can't be empty</Text>    
              ) : null}          
          </View>      
        </Modal>
      </View>
    )
  }}
  
  const styles = EStyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F0F2EF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContainer:{
      justifyContent: 'center',
      alignItems: 'center', 
      backgroundColor: '#fff', 
      borderRadius: 20
    },
    titleModal: {
      marginTop: '1.5rem',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    textInputWrapper:{
      flexDirection: 'row',
      padding: '2rem',
    },
    textInput:{
      borderBottomWidth: '0.1rem',
      borderBottomColor: '#F0F2EF',
      width: '15rem',
      fontSize: '1.5rem',
      marginRight: '2rem',
    },
    modalAddButton:{
      width: '3rem',
      height: '3rem',
    },
    addButtonImage:{
      width: '4.5rem',
      height: '4.5rem',
    },
    addButton:{
      position: 'absolute',
      bottom : '1.5rem',
      right: '1.5rem'
    },
    textTitle:{
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    textAmont:{
      fontSize: '1rem',
      color: 'gray'
    },
    header:{
      padding: '0.5rem',
    },
    headerText:{
      fontSize: '2.5rem',
      fontWeight: 'bold',
    },
    listWrapper:{
      flexDirection: 'row',
      padding: '0.5rem'
    },
    icon:{
      width: '3rem',
      height: '3rem',
      marginRight: '1rem'
    },
    nameWrapper:{
      padding: '0.5rem'
    },
    textID:{
      fontSize: '2rem',
      fontWeight: 'bold'
    },
    textName:{
      fontSize: '1.5rem',
      color : 'gray'
    },
    infoWrapper:{
      marginTop: '3rem',
      width: '100%',
      padding: '0.5rem',
      flexDirection : 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    avt:{
      width: '8rem',
      height: '8rem',
      borderRadius: '5rem'
    },
    wrapper2:{
      flex: 2,
      width: '100%',
      padding: '0.5rem',
    },
    error: {
      color: 'red', 
      marginBottom: '1.5rem'
    },
    confirmContainer: {
      flexDirection: 'row', 
      marginBottom: '1.5rem'
    }
  });
