import React from 'react';
import {Image, View, Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import * as Animatable from 'react-native-animatable';
import EStyleSheet from 'react-native-extended-stylesheet';


import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'

export default class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    this.state={
        entries:[
            {
                thumbnail: ''
            },
            {
                thumbnail: ''
            }
        ],
    }
  }
  _renderItem = ({item, index}, parallaxProps) => {
      return (
          <View style={styles.item}>
              <ParallaxImage
                  source={{uri : item.thumbnail  }}
                  containerStyle={styles.imageContainer}
                  style={styles.image}
                  parallaxFactor={1}
                  {...parallaxProps}
              />
              {index==0 ?
                  <View style={styles.absolute}>             
                      <SignIn props={this.props} />            
                  </View>
              :
              <View style={styles.absolute}>     
                      <SignUp props={this.props} />   
                  </View>
              }
          </View>
      )
  }


  render()  {
    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior='padding'>
    <View style={styles.container}>   
        <Image
            style={styles.logo}
            source={require('../images/logo.png')}
        />
        <Animatable.View 
        animation="bounceInUp"
        style={styles.footer}
        >
            <Carousel                        
                data={this.state.entries}
                renderItem={this._renderItem}
                sliderWidth={screenWidth}
                sliderHeight={screenWidth}
                itemWidth={screenWidth - 60}
                hasParallaxImages={true}
            />
        </Animatable.View>        
    </View>
    </KeyboardAvoidingView>
  );
}
}
const screenWidth = Dimensions.get("screen").width;
const styles = EStyleSheet.create({
  container:{
      flex: 1,
      backgroundColor: '#F0F2EF'
  },
  absolute:{
      position: 'absolute',
      width: '100%',
      height: ' 100%'
  },
  text:{
      fontWeight: 'bold',
      color:'#5FBCE7',
  },  
  image:{
      width: screenWidth/2,
      height: screenWidth/2,
      borderRadius: '10rem'
  },
  header:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  footer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: '-1rem',
      height: '50%'
  },
  item:{
      width: screenWidth - 60,
      height: screenWidth - 120,
  },
  imageContainer:{
      flex: 1,
      marginBottom: Platform.select({android: '0.1rem'}),
      backgroundColor: 'white',
      borderRadius: '0.8rem',
      borderWidth: '0.1rem',
      borderColor: "#EEEEEE",
  },
  logo: {
      alignSelf: 'center',
      height: '20rem',
      width: '20rem',
      marginTop: '5rem',
      marginBottom: '4rem'
  }
});