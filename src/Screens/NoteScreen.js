import React from 'react';
import {View,TextInput,TouchableOpacity,Image,FlatList, SafeAreaView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet'
import Header from '../components/Header'
import CreateNote from '../components/CreateNote'
import EditNote from '../components/EditNote'
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Note from '../components/Note'

export default class NoteScreen extends React.Component {
  constructor(props){
      super(props)
      this.state={
        data:[],
        filterData: [],
        isShowCreate: false,
        isShowEdit: false,
        item: ''
      }
      this.toggleShowCreate = this.toggleShowCreate.bind(this)
      this.toggleShowEdit = this.toggleShowEdit.bind(this)
  }
  toggleShowCreate = () =>{
    this.setState({isShowCreate: !this.state.isShowCreate})
  }
  toggleShowEdit = async(item) =>{
    await this.setState({item: item})
    await this.setState({isShowEdit: !this.state.isShowEdit})
  }
  componentDidMount(){
    this.getData() 
  }
  getData = async() => {
    const userID = await AsyncStorage.getItem('userID')
    firestore()
      .collection(`Users/${userID}/Note`)
      .orderBy('date')
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
        const itemData = item.title
        ?item.title.toLowerCase()
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

  
  render(){
    return (
      <View style={styles.containerCustom}>
        <SafeAreaView/>
        <View style={styles.container}>
        <Header name={'NOTE'}></Header>
        <View style={styles.wrapper2}>
          <TextInput
            placeholder="Search by name..."
            placeholderTextColor="#A0ACBB"
            style={styles.searchBar}
            value={this.state.search}
            onChangeText={(text)=>this._search(text)}
          />
          <FlatList 
          showsVerticalScrollIndicator={false}
          data={this.state.filterData}
          renderItem={({item})=>{
            return(
              <Note id={item.id} onPress={() => this.toggleShowEdit(item)}></Note>
            )
          }}
          />
        </View>
        <View style={styles.addButton}>
          <TouchableOpacity
            onPress={()=> this.toggleShowCreate()}
          >
            <Image 
              source={require('../images/add.png')}
              style={styles.addButtonImage}
            />
          </TouchableOpacity>
        </View>
        {this.state.isShowCreate? (
          <CreateNote 
          isShowCreate={this.state.isShowCreate} 
          toggleShowCreate={this.toggleShowCreate}
          /> 
        ): null}
        {this.state.isShowEdit ? (
          <EditNote 
          isShowEdit={this.state.isShowEdit} 
          toggleShowEdit={this.toggleShowEdit}
          item={this.state.item}
          />  
        ): null}   
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
    backgroundColor: '#5FBCE7'
  },
  addButton:{
    position: 'absolute',
    bottom : '1.5rem',
    right: '1.5rem'
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
  addButtonImage:{
    width: '4.5rem',
    height: '4.5rem',
  },
  wrapper2:{
    flex: 4,
    width: '100%',
    padding: '0.5rem',
    // marginTop: '3rem'
  },
});