import React from 'react';
import { Image, Text, View,TextInput, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'

import Header from '../components/Header'
import Attribute from '../components/Attribute'

export default class CategoryScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isModalVisible: false,
      isShowNoti: false,
      nameCategory:'',
      dateAddCategory: '',
      error: '',
      data: [],
      filterData: [],
      search: '',
    }
    this.checkName = this.checkName.bind(this)
  }


  componentDidMount(){
      this.getData()
  }

  getData = async() => {
    const userID =  await AsyncStorage.getItem('userID')
    firestore()
      .collection(`Users/${userID}/Category`)
      .orderBy(`date`)
      .onSnapshot(snapshot => {
          let data = []
        snapshot.forEach( doc => {
          data.push({...doc.data(), id: doc.id})
        })
        this.setState({data: data})
        this.setState({filterData: data})
      });
  }
  
  _search(text){
    if(text)
    {
      const newData = this.state.data.filter((item)=>{
        const itemData = item.nameCategory
        ?item.nameCategory.toLowerCase()
        :''.toLowerCase();
        const textData = text.toLowerCase();
        return itemData.indexOf(textData) > -1;
      })
      this.setState({
        filterData: newData,
        search: text
      })
    }
    else{
      this.setState({
        filterData: this.state.data,
        search: text
      })
    }
  }

  

  toggleModal(){
    this.setState({isModalVisible: !this.state.isModalVisible})
    this.setState({nameCategory: '', error: ''})
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
    this.setState({dateAddCategory: time})
  }

  addCategory = async() => {
    const userID =  await AsyncStorage.getItem('userID')
    await this.getDateAdd()
    await firestore()
    .collection(`Users/${userID}/Category`)
    .add({
      nameCategory: this.state.nameCategory,
      dateAddCategory: this.state.dateAddCategory,
      date: new Date(),
      color: Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
      count: 0
    })
    .then(() => {
      this.toggleNoti()
      this.toggleModal()
    })
  }


  checkName(){
    this.setState({error : ''})
    if(this.state.nameCategory == ''){
      this.setState({error : 'This field can not be empty'})
    }
    else if (this.state.data.find(ele => ele.nameCategory.toLowerCase() == this.state.nameCategory.toLowerCase() )){
      this.setState({error : 'That name is already in use'})
    }
    else{
      this.toggleNoti()
    }
  }


render(){
  return (
    <View style={styles.containerCustom}>      
      <SafeAreaView/>
      <View style={styles.container}>
      <Header name={'CATEGORY'}></Header>

      <View style={styles.wrapper2}>
          <TextInput
          placeholder="Search by name..."
          placeholderTextColor="#A0ACBB"
          style={styles.searchBar}
          value={this.state.search}
          onChangeText={(text)=>this._search(text)}
          />
          <FlatList
              data={this.state.filterData}
              renderItem={({item})=>{
                return(
                  <Attribute item={item} type={'Category'} data={this.state.data}/>
                )
              }}
          />
        </View>
      
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
              placeholder="Category name..."
              placeholderTextColor="#A0ACBB"
              style={styles.textInput}
              value={this.state.nameCategory}
              onChangeText={value => this.setState({nameCategory: value})}
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
                  <Text style={styles.titleModal}>Name is {this.state.nameCategory}?</Text>
                  <View style={styles.confirmContainer}>
                    <TouchableOpacity
                      style={{marginRight: 120, marginTop: 30}}
                      onPress={()=> this.addCategory()}
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
            {this.state.error !== '' ? (
              <Text style={styles.error}>{this.state.error}</Text>    
            ) : null}          
        </View>      
      </Modal>
    </View>
    </View>
  )
}}

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
  searchBar:{
    marginHorizontal: '0.5rem',
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '5rem',
    shadowOffset:{  width: 1.5,  height: 2,  },
    shadowColor: 'black',
    shadowOpacity: 0.05,
    marginVertical: '0.5rem'
  },
  headerText:{
    padding: '0.5rem',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  wrapper2:{
    flex: 2,
    width: '100%',
    padding: '0.5rem',
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
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  textInputWrapper:{
    flexDirection: 'row',
    padding: '2rem',
  },
  textInput:{
    width: '15rem',
    fontSize: '1.5rem',
    marginRight: '2rem',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: '1rem',
    paddingVertical: '0.7rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
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
  error: {
    color: 'red', 
    marginBottom: '1.5rem'
  },
  confirmContainer: {
    flexDirection: 'row', 
    marginBottom: '1.5rem'
  }
});