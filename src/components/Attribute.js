import React from 'react'
import {View, TouchableOpacity, Text, Image, TextInput} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet';
import firestore from '@react-native-firebase/firestore';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage'


export default class Attribute extends React.Component{
    state={
        isVisible: false,
        isModalVisible: false,
        nameCategory: ''
    }

    update = async(id,type) => {
        const userID =  await AsyncStorage.getItem('userID')
        if(type == "Category"){
        firestore()
            .collection(`Users/${userID}/Category`)
            .doc(`${id}`)
            .update({
                nameCategory: this.state.nameCategory,
            })
            .then( () => {
                 this.toggleModal();
                 this.hideButton();
            });
        }
        if(type == "Status"){
            firestore()
                .collection(`Users/${userID}/Status`)
                .doc(`${id}`)
                .update({
                    nameStatus: this.state.nameStatus,
                })
                .then(() => {
                    this.toggleModal();
                    this.hideButton();
                });
        }
        if(type == "Priority"){
            firestore()
                .collection(`Users/${userID}/Priority`)
                .doc(`${id}`)
                .update({
                    namePriority: this.state.namePriority,
                })
                .then(() => {
                    this.toggleModal();
                    this.hideButton();
                });
        }
    }
    delete = async(id,type) => {
        const userID =  await AsyncStorage.getItem('userID')
        if(type == "Category"){
            firestore()
                .collection(`Users/${userID}/Category`)
                .doc(`${id}`)
                .delete()
                .then(() => {
                    console.log('User deleted!');
                });
        }
        if(type == "Status"){
            firestore()
                .collection(`Users/${userID}/Status`)
                .doc(`${id}`)
                .delete()
                .then(() => {
                    console.log('User deleted!');
                });
        }
        if(type == "Priority"){
            firestore()
                .collection(`Users/${userID}/Priority`)
                .doc(`${id}`)
                .delete()
                .then(() => {
                    console.log('User deleted!');
                });
        }
    }
    toggleModal(){
        this.setState({isModalVisible: !this.state.isModalVisible})
    }
    showButton(){
        this.setState({isVisible: true})
      }
    hideButton(){
        this.setState({isVisible: false})
    }
    render(){
        const {item, type, index} = this.props
        return(
            <TouchableOpacity style={styles.listWrapper} onLongPress={() => this.showButton()} onPress={() => this.hideButton()}>
                {type=="Category" ?(
                    <View style={styles.attributeContainer}>
                        <View>
                            <Text style={styles.textTitle}>{item.nameCategory}</Text>
                            <Text style={styles.textAmont}>{item.dateAddCategory}</Text>
                        </View>
                        {this.state.isVisible ? (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => this.toggleModal()}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            { index > 0 ? 
                            <TouchableOpacity style={styles.button} onPress={() => this.delete(item.id, type)}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity> : null
                            }
                        </View>
                        ) : null}
                    </View>
                    
                ) : 
                type=="Status" ?(
                    <View style={styles.attributeContainer}>
                        <View>
                            <Text style={styles.textTitle}>{item.nameStatus}</Text>
                            <Text style={styles.textAmont}>{item.dateAddStatus}</Text>
                        </View>
                        {this.state.isVisible ? (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => this.toggleModal()}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            { index > 2 ? 
                            <TouchableOpacity style={styles.button} onPress={() => this.delete(item.id, type)}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity> : null
                            }
                        </View>
                        ) : null}
                    </View>
                ):
                type=="Priority" ?(
                    <View style={styles.attributeContainer}>
                        <View>
                            <Text style={styles.textTitle}>{item.namePriority}</Text>
                            <Text style={styles.textAmont}>{item.dateAddPriority}</Text>
                        </View>
                        {this.state.isVisible ? (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => this.toggleModal()}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            { index > 2 ? 
                            <TouchableOpacity style={styles.button} onPress={() => this.delete(item.id, type)}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity> : null
                            }
                        </View>
                        ) : null}
                    </View>
                ):null } 

                <Modal isVisible={this.state.isModalVisible} onBackdropPress={()=>this.toggleModal()}>
                    <View style={{backgroundColor: '#fff', borderRadius: 20}}>
                    <View style={styles.modalContainer}>
                        <View style={styles.headerModal}>
                            <Text style={styles.titleModal}>Edit {type}</Text>
                        </View>
                        <View style={styles.textInputWrapper}>
                        {type=="Category" ?(
                            <TextInput 
                            placeholder={item.nameCategory}
                            style={styles.textInput}
                            value={this.state.nameCategory}
                            onChangeText={value => this.setState({nameCategory: value})}
                            />
                        ) : 
                        type=="Status" ?(
                            <TextInput 
                            placeholder={item.nameStatus}
                            style={styles.textInput}
                            value={this.state.nameStatus}
                            onChangeText={value => this.setState({nameStatus: value})}
                            />
                        ):
                        type=="Priority" ?(
                            <TextInput 
                            placeholder={item.namePriority}
                            style={styles.textInput}
                            value={this.state.namePriority}
                            onChangeText={value => this.setState({namePriority: value})}
                            />
                        ):null }
                        <TouchableOpacity
                            onPress={() => this.update(item.id, type)}
                        >
                            <Image 
                            source={require('../images/confirm.png')}
                            style={styles.modalAddButton}
                            />
                        </TouchableOpacity>
                        </View>          
                        </View>  
                    </View>  
                </Modal>
            </TouchableOpacity>
        )
    }
}

const styles = EStyleSheet.create({
    listWrapper:{
        padding: '0.7rem',
        position:'relative'
    },
    attributeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textTitle:{
        fontSize: '1.5rem',
        fontWeight: 'bold'
    },
    textAmont:{
        fontSize: '1rem',
        color: 'gray'
    },
    buttonContainer: {
        flexDirection: 'row',
        // alignSelf: 'flex-end',
        // position: 'absolute', 
        marginTop: '0.5rem',
    },
    button: {
        width: '4rem',
        height: '2rem',
        backgroundColor: '#5FBCE7',
        marginLeft: '0.7rem',
        alignItems: 'center',
        borderRadius: '1rem',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    modalContainer:{
        justifyContent: 'center',
        alignItems: 'center',
      },
      titleModal: {
        marginTop: '1rem',
        fontSize: '2rem',
        fontWeight: 'bold'
      },
      modalAddButton:{
        width: '3rem',
        height: '3rem',
      },
      modalCloseButton:{
        width: '2rem',
        height: '2rem',
        position: 'relative',
        marginTop: '-0.6rem',
        marginLeft: '-0.6rem'
      },
      textInputWrapper:{
        flexDirection: 'row',
        padding: '2rem'
      },
      textInput:{
        borderBottomWidth: '0.1rem',
        borderBottomColor: '#F0F2EF',        
        width: '15rem',
        fontSize: '1.5rem',
        marginRight: '2rem',
      },
})