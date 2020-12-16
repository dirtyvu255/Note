import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Image,ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import DatePicker from '@react-native-community/datetimepicker'; 
import Textarea from 'react-native-textarea';
import firestore from '@react-native-firebase/firestore'
import Modal from 'react-native-modal'
import AsyncStorage from '@react-native-async-storage/async-storage'

import RenderSelection from './RenderSelection'
export default class CreateNote extends React.Component {
  constructor(props){
    super(props)
    this.state={
      date: new Date((new Date()).valueOf() + 1000*3600*24),
      formatedDate: '',
      category: '',
      priority: '',
      status: '',
      isShowPicker: false,
      des: '',
      title: '',
      error: '',
      typeError: '',
      isShowAlert: false
    }
    this.setCategory = this.setCategory.bind(this);
    this.setPriority = this.setPriority.bind(this);
    this.setStatus = this.setStatus.bind(this);
  }
  // attribute
  setCategory = (cate) => {
      this.setState({category: cate})
  }
  setPriority = (pri) => {
    this.setState({priority: pri})
  }
  setStatus = (sta) => {
    this.setState({status: sta})
  }

  //picktime
  onChange = async(event,selectedDate) => {
    const currentDate = selectedDate || this.state.date
    await this.setState({date: currentDate})
    //formatDate
    
  }

  formatDate(){
    let date = this.state.date.getDate(); 
    let month = this.state.date.getMonth() + 1; 
    let year = this.state.date.getFullYear(); 
    let time = date + '/' + month + '/' + year
    this.setState({formatedDate: time})
  }


  //show modal picker
  ShowAlert(){
    this.setState({isShowAlert: !this.state.isShowAlert})
  }
  HideAlert(){
    this.setState({isShowAlert: !this.state.isShowAlert})
    this.props.toggleShowCreate()
  }
  
  addNote = async() => {
    const userID =  await AsyncStorage.getItem('userID')
     firestore()
      .collection(`Users/${userID}/Note`)
      .add({
        title: this.state.title,
        planDate: this.state.formatedDate,
        description: this.state.des,
        category: this.state.category,
        priority: this.state.priority,
        status: this.state.status,
        date: this.state.date
      })
      .then(async() => {
        console.log('Created!')
        await this.ShowAlert()
      });
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
      this.addNote()
    }
  }

  render(){
  return (
    <Modal isVisible={this.props.isShowCreate} onBackdropPress={()=>this.props.toggleShowCreate()}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>      
          <Text style={styles.headerText}>Create</Text>
          <View style={styles.wrapper2}>
            <View>
              <Text style={styles.titleTag}>
                Title
              </Text>
              <TextInput 
                autoCorrect={false}
                maxLength={15}
                placeholder="Type your title..."
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
              <View style={{marginVertical: 5}}>
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
            <RenderSelection type={'Category'} setCategory={this.setCategory} />
            {this.state.typeError == 'cate' ? (
              <Text style={styles.error}>{this.state.error}</Text>
            ): null}
            <RenderSelection type={'Priority'} setPriority={this.setPriority} />
            {this.state.typeError == 'pri' ? (
              <Text style={styles.error}>{this.state.error}</Text>
            ): null}
            <RenderSelection type={'Status'} setStatus={this.setStatus} />
            {this.state.typeError == 'sta' ? (
              <Text style={styles.error}>{this.state.error}</Text>
            ): null}
            <TouchableOpacity style={styles.buttonCreate} onPress={() => this.catchError()}>
              <Text style={styles.buttonName}>Create Note</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
        <Modal isVisible={this.state.isShowAlert} onBackdropPress={() => this.HideAlert()}>
          <View style={styles.containerAlert}>
            <Image 
                source={require('../images/tick.png')}
                style={styles.imageAlert}
            />
            <Text style={styles.nameAlert}>Created!</Text>
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
    padding: '1rem',
    paddingVertical: '0.8rem',
    alignItems: 'center',
    marginHorizontal: '2rem',        
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
    marginTop: '1rem',
    textTransform: 'uppercase'
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
  },
  imageAlert: {
      height: '4.5rem',
      width: '4.5rem',
      alignSelf: 'center',
      marginVertical: '2rem'
  },
  nameAlert: {
      fontWeight: '500',
      fontSize: '2rem',
      textAlign: 'center',
      marginBottom: '1rem'
  }
});

