import React from 'react';
import {Text, View,TextInput,TouchableOpacity,Image,FlatList, ScrollView, SafeAreaView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet'
import Header from '../components/Header'
import CreateNote from '../components/CreateNote'
import EditNote from '../components/EditNote'
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'

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
    const {type} = this.props
      this.getData(type)
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
              <TouchableOpacity activeOpacity={1} style={styles.wrapper} onPress={() => this.toggleShowEdit(item)}>
                <View style={styles.headerComponent}>
                  <View style={{width: '65%'}}>
                    <Text numberOfLines={1} style={styles.titleText}>{item.title}</Text>
                  </View>
                  <Text style={styles.dateText}>{item.planDate}</Text>
                </View>
                {item.description ? (
                  <View style={styles.middleComponent}>
                  <Text numberOfLines={2} style={styles.desText}>Description: {item.description}</Text>
                </View>
                ) : null}
                <Text style={styles.categoryText}>Category: {item.category}</Text>
                <View style={styles.bottomComponent}>
                  <Text style={styles.categoryText}>Status: {item.status}</Text>
                  <Text style={styles.categoryText}>Priority: {item.priority}</Text>
                </View>
            </TouchableOpacity>
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
  categoryText:{
    marginTop: '0.5rem',
    fontSize: '1.1rem',
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
  dateText:{
    fontSize: '1.2rem',
    fontWeight: '400'
  },
  headerComponent:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  desScrollView:{
    width: '12rem',
    height: '4rem',
    borderLeftWidth: '0.1rem',
    borderLeftColor: 'gray',
  },
  bottomComponent:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  desText:{
    fontSize: '1.1rem'
  },
  middleComponent:{
    paddingTop: '0.5rem',
  },

  titleText:{
    fontSize: '1.7rem',
    fontWeight: '500'
  },
  wrapper:{
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '2rem',
    padding: '1rem',
    borderLeftWidth: '0.5rem',
    borderLeftColor: '#5FBCE7',
    borderColor: 'grey',
    borderWidth: 0.3,
    marginTop:'0.5rem'
  },
  wrapper2:{
    flex: 4,
    width: '100%',
    padding: '0.5rem',
    // marginTop: '3rem'
  },
});