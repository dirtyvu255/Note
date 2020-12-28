import React from 'react'
import {TouchableOpacity, View, Text} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'
export default class Note extends React.Component{
    constructor(props){
        super(props)
        this.state={
            category: '',
            status: '',
            priority: '',
            note: '',
            id: this.props.id
        }
    }

    componentDidMount(){
        this.getNote()
        console.log(this.state.id)
    }

    getNote = async() => {
      const userID = await AsyncStorage.getItem('userID')
      firestore()
        .collection(`Users/${userID}/Note`)
        .doc(`${this.state.id}`)
        .onSnapshot(snapshot => {
          this.setState({note: snapshot.data()})
          if(this.state.note){
            firestore()
              .collection(`Users/${userID}/Category`)
              .doc(`${this.state.note.idCategory}`)
              .onSnapshot(snapshot => {
                  this.setState({category: snapshot.data().nameCategory})
          });
          firestore()
              .collection(`Users/${userID}/Status`)
              .doc(`${this.state.note.idStatus}`)
              .onSnapshot(snapshot => {
                  this.setState({status: snapshot.data().nameStatus})
          });
          firestore()
              .collection(`Users/${userID}/Priority`)
              .doc(`${this.state.note.idPriority}`)
              .onSnapshot(snapshot => {
                  this.setState({priority: snapshot.data().namePriority})
          });
          }
        })     
    }


    render(){
        const {onPress} = this.props
        const item = this.state.note
        return(
            <TouchableOpacity  style={styles.wrapper} onPress={onPress}>
                {item ? (
                <View>
                  <View style={styles.headerComponent}>
                    <View style={{width: '65%'}}>
                      <Text numberOfLines={1} style={styles.titleText}>{item.title}</Text>
                    </View>
                    <Text style={styles.dateText}>{item.planDate}</Text>
                  </View>
                  {item.description ? (
                    <Text numberOfLines={2} style={styles.desText}>{item.description}</Text>
                  ) : null}
                  <View>
                    <Text style={styles.categoryText}>Category: {this.state.category}</Text>
                    <Text style={styles.categoryText}>Status: {this.state.status}</Text>
                    <Text style={styles.categoryText}>Priority: {this.state.priority}</Text>
                  </View>
                </View>
                ): null}
            </TouchableOpacity>
        )
    }
}

const styles = EStyleSheet.create({
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
      headerComponent:{
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      desText:{
        fontSize: '1.2rem',
        color: 'grey',
        marginTop: '0.5rem'    
      },
      titleText:{
        fontSize: '1.7rem',
        fontWeight: '500'
      },
      dateText:{
        fontSize: '1.2rem',
        fontWeight: '400'
      },
      categoryText:{
        marginTop: '0.5rem',
        fontSize: '1.1rem',
      },
})