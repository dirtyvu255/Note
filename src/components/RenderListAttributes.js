import React from 'react'
import {View,TextInput,FlatList } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Attribute from './Attribute'


export default class RenderList extends React.Component{
  constructor(props){
    super(props);
    this.state={
      data: [],
      filterData: [],
      isVisible: false,
      search: '',
      
    }
  }  
  componentDidMount(){
    const {type} = this.props
    const {typeName} = this.props
      this.getData(type)
  }
  getData = async(type) => {
    const userID =  await AsyncStorage.getItem('userID')
    firestore()
      .collection(`Users/${userID}/${type}`)
      .orderBy(`date`)
      .onSnapshot(snapshot => {
          let data = []
        snapshot.forEach( doc => {
          data.push({...doc.data(), id: doc.id})
        })
        this.setState({data: data})
        this.setState({filterData: data})
        console.log(data)
      });
  }
  
  _search(text){
    const {type} = this.props
    if(text && type=='Category')
    {
      const newData = this.state.filterData.filter((item)=>{
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
    else if(text && type=='Priority')
    {
      const newData = this.state.filterData.filter((item)=>{
        const itemData = item.namePriority
        ?item.namePriority.toLowerCase()
        :''.toLowerCase();
        const textData = text.toLowerCase();
        return itemData.indexOf(textData) > -1;
      })
      this.setState({
        filterData: newData,
        search: text
      })
    }
    else if(text && type=='Status')
    {
      const newData = this.state.filterData.filter((item)=>{
        const itemData = item.nameStatus
        ?item.nameStatus.toLowerCase()
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
        const {type} = this.props
        return(
        <View style={styles.wrapper2}>
            <TextInput
            placeholder="Search by name..."
            style={styles.searchBar}
            value={this.state.search}
            onChangeText={(text)=>this._search(text)}
            />
              <FlatList
                  data={this.state.filterData}
                  renderItem={({item, index})=>{
                    return(
                      <Attribute item={item} type={type} index={index}/>
                    )
                  }}
              />
        </View>
        )
    }
}

const styles = EStyleSheet.create({
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
  });
