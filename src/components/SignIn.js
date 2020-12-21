import React from 'react';
import{TextInput, View, Text, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Modal from 'react-native-modal'


export default class SignIn extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            userName:"",
            password:"",
            errorID: '',
            errorPass: '',
            isShowAlert: false,
            isLoading: false
        }
    }
    toggleLoading(){
        this.setState({isLoading: !this.state.isLoading})
    }
    hideLoading(){
        this.setState({isShowAlert: true, isLoading: false})
    }
    hideAlert() {
        this.setState({isShowAlert: false})
        this.props.props.navigation.navigate('Note App')
    }
    handleSignIn = async() => {
        this.setState({errorPass: '', errorID: ''})
        if(this.state.userName === ""){
            this.setState({errorID: 'This field can not be blank!'})
        }
        if (this.state.password === ""){
            this.setState({errorPass: 'This field can not be blank!'})
        }
        if (this.state.userName !== "" && this.state.password !== "") {
        await this.toggleLoading()
        auth()
        .signInWithEmailAndPassword(this.state.userName, this.state.password)
        .then( async() => {
        const user = auth().currentUser
        await this.storeUser(user.uid, user.email, user.displayName)
        await this.setState({userName: '', password: '',errorID: '',errorPass: ''})
        await this.hideLoading()
        })
        .catch(error => {
            console.log(error.code)
            if (error.code === 'auth/invalid-email') {
                this.setState({errorID: 'That email is invalid!', errorPass: ''})
                this.toggleLoading()
            }
            
            else if(error.code === 'auth/user-not-found'){
                this.setState({errorID: 'That user not found!', errorPass: ''})
                this.toggleLoading()
            }
            else if(error.code === 'auth/wrong-password'){
                this.setState({errorPass: 'That password is wrong!', errorID: ''})
                this.toggleLoading()
            }            
          })
        }
        
    }
    storeUser = async(userID, email, username) => {
        try{
          await AsyncStorage.setItem('userID', userID)
          await AsyncStorage.setItem('email', email)
          await AsyncStorage.setItem('username', username)
        } catch (e){
          console.log(e)
        }
    }
    
    render(){
        return(
            <View style={styles.box}>
                <View style={styles.header}>
                    <Image style={styles.iconUser} source={require('../images/user.png')}/>
                </View>
                <View style={styles.action}>
                    <TextInput 
                        placeholder="User Name"
                        autoCapitalize="none"
                        style={styles.textInput}
                        placeholderTextColor="#A0ACBB"
                        onChangeText={(text) => this.setState({
                            userName: text
                            })} value={this.state.userName}
                    />
                </View>
                <Text style={styles.err}>{this.state.errorID}</Text>            
                <View style={styles.action}>
                    <TextInput 
                        secureTextEntry
                        placeholder="Password"
                        placeholderTextColor="#A0ACBB"
                        autoCapitalize="none"
                        style={styles.textInput}
                        value={this.state.password}
                        onChangeText={pass => this.setState({password: pass})}
                        //caretHidden= {true}
                    />
                </View>
                <Text style={styles.err}>{this.state.errorPass}</Text>            
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={this.handleSignIn}
                        style={styles.button}
                    >   
                        <Text style={styles.buttonText}>Sign In</Text>                                                              
                    </TouchableOpacity>
                </View>
                <View style={styles.instrucment}>
                    <Text style={styles.instrucmentText}>Slide to register <Image 
                        source={require('../images/right-arrow.png')}
                        style={{height: 15, width: 15}}
                        />
                    </Text>
                </View>
                {this.state.isLoading ? (
                <Modal isVisible={this.state.isLoading}>
                    <ActivityIndicator 
                    size="large" 
                    style={{alignSelf: 'center', position: 'absolute', marginTop: '30%'}}
                    />
                </Modal>
                ): null}
                <Modal isVisible={this.state.isShowAlert} onBackdropPress={() => this.hideAlert()}>  
                    <View style={styles.containerAlert}>
                        <Image 
                            source={require('../images/tick.png')}
                            style={styles.imageAlert}
                        />
                        <Text style={styles.nameAlert}>Success!</Text>
                    </View>
                </Modal>
            </View>   
        );
    }

    }
    
    var styles = EStyleSheet.create({
        iconUser: {
            height: '4rem',
            width: '4rem',
            marginBottom: '1rem'
        },
        textInput:{
            color: 'gray',
            backgroundColor: '#f2f2f2',
            paddingHorizontal: '1rem',
            paddingVertical: '0.7rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
        },
        header:{
            alignItems: 'center',
            marginVertical: '0.7rem'
        },
        buttonContainer:{
            alignItems:'center',
            marginTop: "-0.9rem"
        },
        errText:{            
            color: 'red',
        },        
        title:{
            color: "#2EA7E0",
            fontSize: '2.7rem',
            fontWeight: 'bold',    
        },
        action:{
            marginHorizontal: '0.25rem',
        },
        box:{
            flex: 1,
            paddingHorizontal: '1rem',
            paddingVertical: '0.5rem',
        },
        button:{
            backgroundColor: "#2EA7E0",
            marginTop: '1rem',
            borderRadius: '5rem',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: '0.7rem',
            paddingHorizontal: '2.2rem'
        },
        buttonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.1rem'
        },
        err: {
            color: 'red', 
            fontWeight: '500',
            marginLeft: '0.5rem',
            marginVertical: '0.1rem'
        },
        notiContainer: {
            marginTop: '-3.8rem',
            backgroundColor: '#fff', 
            position: 'absolute',
            padding : "1rem",
            width: '20rem',
            marginLeft: '2rem',
            justifyContent: 'center',
            borderRadius: 20
        },
        notiText:{
            fontSize: 25,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: "0.5rem",
            marginBottom: '0.5rem'
        },
        buttonModal:{
            marginTop: '1rem',
            backgroundColor: '#2EA7E0',
            borderRadius: '5rem',
            padding: '1rem',
            alignItems: 'center',
            marginHorizontal: '1rem',    
        },
        buttonName:{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white'
        },
        containerAlert: {
            backgroundColor: '#fff',
            borderRadius: 25,
            justifyContent: 'center',
            marginLeft: '2.5rem',
            height: '16rem',
            width: '18rem'
        },
        imageAlert: {
            height: '4.5rem',
            width: '4.5rem',
            alignSelf: 'center',
            marginBottom: '1.5rem',
        },
        nameAlert: {
            fontWeight: '500',
            fontSize: '1.7rem',
            textAlign: 'center',
            marginBottom: '0.5rem'
        },
        instrucment: {
            position: 'absolute',
            marginTop: '19.5rem',
            marginLeft: '12rem'
        },
        instrucmentText: {
            fontWeight: '400',
            fontSize: '1.1rem'
        }
    })
