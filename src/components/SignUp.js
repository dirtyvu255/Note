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
            isLoading: false,

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
        this.props.props.navigation.navigate('FirstSignUp')
    }

    handleSignUp = async() =>{
        this.setState({errorPass: '', errorID: ''})
        if(this.state.userName === "" ){
            this.setState({errorID: 'This field can not be blank'})
        }
        if (this.state.password === ""){
            this.setState({errorPass: 'This field can not be blank'})
        }
        if(this.state.userName !== "" && this.state.password !== "" ){
        this.toggleLoading()
        await auth()
        .createUserWithEmailAndPassword(this.state.userName, this.state.password)
        .then( async() => { 
        const user = auth().currentUser
        await this.storeUser(user.uid, user.email, this.state.password)
        await this.setState({userName: '', password: '',error: ''})
        await this.hideLoading()
        }
        )
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                this.setState({errorID: 'That email is already in use!', errorPass: ''})
                this.toggleLoading()
            }
            else if (error.code === 'auth/invalid-email') {
                this.setState({errorID: 'That email is invalid!', errorPass: ''})
                this.toggleLoading()
            }
            else if(error.code === 'auth/weak-password'){
                this.setState({errorPass: 'That password is to weak!', errorID: ''})
                this.toggleLoading()
            }
        });
    }
    }
    storeUser = async(userID, email, password) => {
        try{
          await AsyncStorage.setItem('userID', userID)
          await AsyncStorage.setItem('email', email)
          await AsyncStorage.setItem('password', password)
        } catch (e){
        }
    }



    render(){
        return(
            <View style={styles.box}>
                <View style={styles.header}>
                <Image style={styles.iconUser} source={require('../images/add-user.png')}/>
                </View>
                <View style={styles.action}>
                    <TextInput 
                        placeholder="Username"
                        placeholderTextColor="#A0ACBB"
                        autoCapitalize="none"
                        style={styles.textInput}
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
                    />
                </View>
                <Text style={styles.err}>{this.state.errorPass}</Text>            
                <View style={styles.buttonContainer}>                    
                    <View>
                        <TouchableOpacity
                            onPress={this.handleSignUp}
                        >
                            <View style={styles.button}>    
                                <Text style={styles.buttonText}>Sign Up</Text>                                                              
                            </View>
                        </TouchableOpacity>
                    </View>
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
        title:{            
            color: "#5FBCE7",
            fontSize: '2.7rem',
            fontWeight: 'bold',    
        },
        action:{
            marginVertical: '0.25rem',
        },
        box:{
            flex: 1,
            paddingHorizontal: '1rem',
            paddingVertical: '0.5rem'
        },
        button:{
            backgroundColor: "#5FBCE7",
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
        iconButton:{
            height: "1.2rem",
            width: '1.2rem'
        },
        err: {
            color: 'red', 
            fontWeight: '500',
            marginLeft: '0.5rem',
            marginHorizontal: '0.1rem'
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
            backgroundColor: '#5FBCE7',
            borderRadius: '5rem',
            padding: '1rem',
            alignItems: 'center',
            marginHorizontal: '3rem',    
          },
          buttonName:{
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'white'
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
    })