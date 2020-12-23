import React from 'react'
import {View, Text, FlatList, TouchableOpacity} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'
export default class RenderSelection extends React.Component{
  constructor(props){
      super(props)
      this.state={
          data: [],
          isActiveCate: this.props.isActiveCate,
          isActivePri: this.props.isActivePri,
          isActiveSta: this.props.isActiveSta
      }
  }

  componentDidMount(){
    const {type} = this.props
      this.getData(type)
  }
  
  //get data from firestore
  getData = async(type) => {
    const userID =  await AsyncStorage.getItem('userID')
    firestore()
      .collection(`Users/${userID}/${type}`)
      .orderBy(`name${type}`)
      .onSnapshot(snapshot => {
          let data = []
        snapshot.forEach( doc => {
          data.push({...doc.data(), id: doc.id})
        })
        this.setState({data: data})
      });
  }

  //set color button
  activeCategory = async(item) =>{
    if(item.id == this.state.isActiveCate){
      await this.setState({isActiveCate: ''})
      await this.props.setCategory('', '')
    }
    else{
      await this.setState({isActiveCate: item.id})
      await this.props.setCategory(item.nameCategory, item.id)
    }
  }
  activePriority = async(item) =>{
    if(item.id == this.state.isActivePri){
      await this.setState({isActivePri: ''})
      await this.props.setPriority('', '')
    }
    else{
      await this.setState({isActivePri: item.id})
      await this.props.setPriority(item.namePriority, item.id)
    }
  }
  activeStatus= async(item) =>{
    if(item.id == this.state.isActiveSta){
      await this.setState({isActiveSta: ''})
      await this.props.setStatus('', '')
    }
    else{
      await this.setState({isActiveSta: item.id})
      await this.props.setStatus(item.nameStatus, item.id)
    }
  }

  render(){
    const {type} = this.props
    return(
      <View>
        <Text style={styles.titleTag}>{type}</Text>
        {type == "Category" ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={this.state.data}
            renderItem={({item})=>{
              return(
                <TouchableOpacity 
                  style={[styles.button,{ backgroundColor: this.state.isActiveCate == item.id ? '#5FBCE7' : '#CAD1C7'}]}
                  onPress={() => this.activeCategory(item)} 
                >
                  <Text>{item .nameCategory}</Text>
                </TouchableOpacity>
              )
            }}
          />
        ):
        type == "Priority" ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={this.state.data}
            renderItem={({item})=>{
              return(
                <TouchableOpacity 
                  style={[styles.button,{ backgroundColor: this.state.isActivePri == item.id ? '#5FBCE7' : '#CAD1C7'}]}
                  onPress={() => this.activePriority(item)} 
                >
                  <Text>{item.namePriority}</Text>
                </TouchableOpacity>
              )
            }}
          />
          ):
          type == "Status" ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={this.state.data}
              renderItem={({item})=>{
                return(
                  <TouchableOpacity 
                    style={[styles.button,{ backgroundColor: this.state.isActiveSta == item.id ? '#5FBCE7' : '#CAD1C7'}]}
                    onPress={() => this.activeStatus(item)} 
                  >
                    <Text>{item.nameStatus}</Text>
                  </TouchableOpacity>
                )
              }}
            />
          ): null}
        </View>
    )
  }
}

const styles = EStyleSheet.create({
    titleTag:{
        color:'gray',
        fontSize: '1.2rem',
        marginBottom: '0.5rem'
      },
    button:{
        backgroundColor:'#CAD1C7',
        padding:'1rem',
        borderRadius: '5rem',
        marginLeft: '0.5rem',
        marginBottom: '1rem'
    },
    actButton:{
      backgroundColor:'red',
      padding:'1rem',
      borderRadius: '5rem',
      marginLeft: '0.5rem',
      marginBottom: '1rem'
  },
})