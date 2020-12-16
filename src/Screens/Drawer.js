import React from 'react';
import {View,Image, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth'

import HomeScreen from './HomeScreen';
import CategoryScreen from './CategoryScreen';
import NoteScreen from './NoteScreen';
import PriorityScreen from './PriorityScreen';
import StatusScreen from './StatusScreen';
import AccountScreen from './AccountScreen';
 
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const Screens = ({navigation}) => {
    return (
        <Stack.Navigator
            screenOptions={{ 
                gestureEnabled: false,
                headerTransparent: true,
                headerTitle: null,
                headerLeft: ()=>(
                    <TouchableOpacity
                        onPress={()=>{navigation.openDrawer()}}
                    >
                    <Image style={{height: 30, width: 30, marginTop: 5, marginLeft: 15}} source={require('../images/menu.png')} />
                    </TouchableOpacity>
                )
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Account" component={AccountScreen} />
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen name="Priority" component={PriorityScreen} />
            <Stack.Screen name="Status" component={StatusScreen} />
            <Stack.Screen name="Note" component={NoteScreen} />        
        </Stack.Navigator>
    )
};

const DrawerContent = props => {
    return(
        <DrawerContentScrollView {...props} >
            <View style={{alignItems: 'center', padding:10}}>
                <Image style={{height:150, width: 150,marginVertical: 20}} source={require('../images/logo.png')}>
                </Image>
            </View>
            <DrawerItem 
                label="Home"
                onPress={()=>{props.navigation.navigate('Home')}}
            />
            <DrawerItem 
                label="Category"
                onPress={()=>{props.navigation.navigate('Category')}}
            />
            <DrawerItem 
                label="Priority"
                onPress={()=>{props.navigation.navigate('Priority')}}
            />
            <DrawerItem 
                label="Status"
                onPress={()=>{props.navigation.navigate('Status')}}
            />
            <DrawerItem 
                label="Note"
                onPress={()=>{props.navigation.navigate('Note')}}
            />
            <DrawerItem 
                label="Account"
                onPress={()=>{ props.navigation.navigate('Account')}}
            />
            <DrawerItem 
                label="Log Out"
                onPress={() => {
                    AsyncStorage.removeItem('userID')
                    AsyncStorage.removeItem('username')
                    AsyncStorage.removeItem('email')
                    auth().signOut()
                    props.navigation.navigate('Home')
                    props.navigation.navigate('Login')
                    props.navigation.closeDrawer()
               }}
            />
        </DrawerContentScrollView>
    )
}

export default () => {
    return(
        <Drawer.Navigator 
            initialRouteName="Home"
            drawerContent={props => <DrawerContent {...props} />}
        >
            <Drawer.Screen name="Screens" component={Screens} />
        </Drawer.Navigator>
    );
}