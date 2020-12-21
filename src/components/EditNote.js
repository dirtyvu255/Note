import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import DatePicker from '@react-native-community/datetimepicker'; 
import Textarea from 'react-native-textarea';
import firestore from '@react-native-firebase/firestore'
import Modal from 'react-native-modal'
import AsyncStorage from '@react-native-async-storage/async-storage'

import RenderSelection from './RenderSelection'
export default class EditNote extends React.Component {
  constructor(props){
    super(props)
    this.state={
      date: new Date((new Date()).valueOf() + 1000*3600*24),
      formatedDate: this.props.item.planDate,
      category: this.props.item.category,
      priority: this.props.item.priority,
      status: this.props.item.status,
      idCategory: this.props.item.idCategory,
      idPriority: this.props.item.idPriority,
      idStatus: this.props.item.idStatus,
      isShowPicker: false,
      des: this.props.item.description,
      title: this.props.item.title,
      error: '',
      typeError: '',
      id: this.props.item.id,
      isShowAlert: false,
      Alert: ''
    }
    this.setCategory = this.setCategory.bind(this);
    this.setPriority = this.setPriority.bind(this);
    this.setStatus = this.setStatus.bind(this);
  }
  // attribute
  setCategory = (cate, idCate) => {
    this.setState({category: cate, idCategory: idCate})
  }
  setPriority = (pri, idPri) => {
    this.setState({priority: pri, idPriority: idPri})
  }
  setStatus = (sta, idSta) => {
    this.setState({status: sta, idStatus: idSta})
  }


  //picktime
  onChange = async(event,selectedDate) => {
    const currentDate = selectedDate || this.state.date;
    await this.setState({date: currentDate})
  }

  formatDate(){
    let date = this.state.date.getDate(); 
    let month = this.state.date.getMonth() + 1; 
    let year = this.state.date.getFullYear(); 
    let time = date + '/' + month + '/' + year
    this.setState({formatedDate: time})
  }

  ShowAlert(name){
    this.setState({isShowAlert: !this.state.isShowAlert})
    this.setState({Alert: name})
  }
  HideAlert(){
    this.setState({isShowAlert: !this.state.isShowAlert})
    this.props.toggleShowEdit()
  }

  update = async() => {
    const userID =  await AsyncStorage.getItem('userID')
    await this.formatDate()
    await this.updateCountAttribute(userID)
    firestore()
        .collection(`Users/${userID}/Note`)
        .doc(`${this.state.id}`)
        .update({
            title: this.state.title,
            planDate: this.state.formatedDate,
            description: this.state.des,
            category: this.state.category,
            priority: this.state.priority,
            status: this.state.status,
            idCategory: this.state.idCategory,
            idPriority: this.state.idPriority,
            idStatus: this.state.idStatus
        })
        .then( async() => {
          this.ShowAlert('Updated!')
        });
    }
  
    updateCountAttribute(userID){
      const incre = firestore.FieldValue.increment(1)
      const decre = firestore.FieldValue.increment(-1)
      if(this.state.idCategory !== this.props.item.idCategory){
        firestore()
          .collection(`Users/${userID}/Category`)
          .doc(`${this.props.item.idCategory}`)
          .update({
            count: decre
          })

        firestore()
          .collection(`Users/${userID}/Category`)
          .doc(`${this.state.idCategory}`)
          .update({
            count: incre
          })
      }

      if(this.state.idPriority !== this.props.item.idPriority){
        firestore()
          .collection(`Users/${userID}/Priority`)
          .doc(`${this.props.item.idPriority}`)
          .update({
            count: decre
          })

        firestore()
          .collection(`Users/${userID}/Priority`)
          .doc(`${this.state.idPriority}`)
          .update({
            count: incre
          })
      }

      if(this.state.idStatus !== this.props.item.idStatus){
        firestore()
          .collection(`Users/${userID}/Status`)
          .doc(`${this.props.item.idStatus}`)
          .update({
            count: decre
          })

        firestore()
          .collection(`Users/${userID}/Status`)
          .doc(`${this.state.idStatus}`)
          .update({
            count: incre
          })
      }
    

    
    }

    delete = async() => {
    const userID =  await AsyncStorage.getItem('userID')
      firestore()
        .collection(`Users/${userID}/Note`)
        .doc(`${this.state.id}`)
        .delete()
        .then( async () => {
          await this.deleteCountAttribute(userID)
          this.ShowAlert('Deleted!')
        });
    } 
    deleteCountAttribute(userID){
      const decre = firestore.FieldValue.increment(-1)
    firestore()
    .collection(`Users/${userID}/Category`)
    .doc(`${this.props.item.idCategory}`)
    .update({
      count: decre
    })
    firestore()
    .collection(`Users/${userID}/Status`)
    .doc(`${this.props.item.idStatus}`)
    .update({
      count: decre
    })
    firestore()
    .collection(`Users/${userID}/Priority`)
    .doc(`${this.props.item.idPriority}`)
    .update({
      count: decre
    })
    }

  //set error
  catchError = () =>{
    if(this.state.title == ''){
      this.setState({typeError: 'title'})
      this.setState({error: 'Title can not be blank'})
    } else if(this.state.date == ''){
      this.setState({typeError: 'date'})
      this.setState({error: 'Date can not be blank'})
    } else if(this.state.category == ''){
      this.setState({typeError: 'cate'})
      this.setState({error: 'Please choose category'})
    } else if(this.state.priority == ''){
      this.setState({typeError: 'pri'})
      this.setState({error: 'Please choose priority'})
    } else if(this.state.status == ''){
      this.setState({typeError: 'sta'})
      this.setState({error: 'Please choose status'})
    } else {
      this.update()
    }
  }

  render(){
    console.log(this.props.item)
  return (
    <Modal isVisible={this.props.isShowEdit} onBackdropPress={()=>this.props.toggleShowEdit()}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} > 
        <View style={{alignItems: 'center',justifyContent: 'center'}}>
        <Text style={styles.headerText}>EDIT</Text>
        <View style={styles.wrapper2}>
          <View>
            <Text style={styles.titleTag}>Title</Text>
            <TextInput 
              autoCorrect={false}
              placeholder="Type your title..."
              placeholderTextColor="#A0ACBB"
              style={styles.textInput}
              value = {this.state.title}
              onChangeText={(text) => this.setState({title: text})}
            />
            {this.state.typeError == 'title' ? (
              <Text style={styles.error}>{this.state.error}</Text>
            ): null}
          </View>
          <View>
            <Text style={styles.titleTag}>
              Date
            </Text>
            <DatePicker
              minimumDate={new Date((new Date()).valueOf() + 1000*3600*24)}
              testID="dateTimePicker"
              value={this.state.date}
              mode='date'
              display="default"
              onChange={this.onChange}
            />
            {this.state.typeError == 'date' ? (
              <Text style={styles.error}>{this.state.error}</Text>
            ): null} 
          </View>
          <View style={styles.desWrapper}>
            <Text style={styles.titleTag}>Description</Text>
            <Textarea
              containerStyle={styles.textareaContainer}
              style={styles.textarea}
              maxLength={200}
              placeholder={'Type here'}
              placeholderTextColor={'#c7c7c7'}
              underlineColorAndroid={'transparent'}
              value = {this.state.des}
              onChangeText={(text) => this.setState({des: text})}
            />
          </View>
          <RenderSelection type={'Category'} setCategory={this.setCategory} isActiveCate={this.state.category}/>
          {this.state.typeError == 'cate' ? (
            <Text style={styles.error}>{this.state.error}</Text>
          ): null}
          <RenderSelection type={'Priority'} setPriority={this.setPriority} isActivePri={this.state.priority}/>
          {this.state.typeError == 'pri' ? (
            <Text style={styles.error}>{this.state.error}</Text>
          ): null}
          <RenderSelection type={'Status'} setStatus={this.setStatus} isActiveSta={this.state.status}/>
          {this.state.typeError == 'sta' ? (
            <Text style={styles.error}>{this.state.error}</Text>
          ): null}
          <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 50}}>
            <TouchableOpacity style={styles.buttonCreate} onPress={() => this.catchError()}>
              <Text style={styles.buttonName}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonCreate, {backgroundColor: '#f00'}]} onPress={() => this.delete()}>
              <Text style={styles.buttonName}>Delete</Text>
            </TouchableOpacity>
          </View>         
        </View>
        </View>     
      </ScrollView>
      <Modal isVisible={this.state.isShowAlert} onBackdropPress={() => this.HideAlert()}>
        <View style={styles.containerAlert}>
          <Image 
              source={require('../images/tick.png')}
              style={styles.imageAlert}
          />
          <Text style={styles.nameAlert}>{this.state.Alert}</Text>
        </View>
      </Modal>
    </Modal>
  );
}}

const styles = EStyleSheet.create({
  container: {    
    backgroundColor: '#F0F2EF',
    marginHorizontal: '-1.2rem',
    borderRadius: 20,
    marginTop: '4rem',
    marginBottom: '-4rem'
  },
  buttonName:{
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase'
  },
  buttonCreate:{
    backgroundColor: '#5FBCE7',
    borderRadius: '5rem',
    paddingHorizontal: '3rem',
    paddingVertical: '1rem',
    alignItems: 'center',
    marginHorizontal: '2rem',        
  },
  titleTag:{
    color:'gray',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    marginBottom: '0.5rem'
  },
  textareaContainer: {
    height: '10rem',
    width: '100%',
    padding: '0.5rem',
    backgroundColor: '#F0F2EF',
    borderWidth: '0.1rem',
    borderColor: '#CAD1C7',
    marginBottom: '1rem'
  },
  textarea: {
    textAlignVertical: 'top',  
    height: '9.5rem',
    width:'20rem',
    fontSize: '1rem',
    color: '#333',
  },
  headerText:{
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginTop: '1rem'
  },
  date:{
    fontSize: '1.3rem',
    fontWeight: '500',
    marginLeft: '0.3rem',
    marginTop: '0.5rem'
  },
  buttonPickerName:{
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'white',
  },
  buttonPicker:{
    backgroundColor: '#5FBCE7',
    borderRadius: '5rem',
    alignItems: 'center',    
    padding: '1rem',
    paddingVertical: '0.8rem',
  },
  datePickerStyle: {
    width: '20rem',
    marginBottom: '1rem',
  },
  wrapper2:{
    flex: 4,
    width: '100%',
    padding: '0.7rem',
  },
  textInput:{
    color: 'black',
    backgroundColor: '#F0F2EF',
    padding: '0.7rem',
    marginBottom: '1rem',
    borderWidth: '0.1rem',
    borderColor: '#CAD1C7',
    fontSize: '1.2rem',
},
  error: {
    color: '#f00',
    marginLeft: '0.5rem',
    marginBottom: '0.5rem'
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

