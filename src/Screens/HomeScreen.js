import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { PieChart } from "react-native-chart-kit";
import Header from '../components/Header'
import EStyleSheet from 'react-native-extended-stylesheet'
import firestore from '@react-native-firebase/firestore'
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage'


export default  class HomeScreen extends React.Component{
  constructor(props){
    super(props)
    this.state={
      data: [],
      dataStatus: [],
      dataPriority: [],
      dataCategory: [],
      dataDashboard: [],
      dataDashboardPri: [],
      dataDashboardCate: [],
    }
  }
  
  componentDidMount(){
    this.getData()
    this.getDataStatus()
    this.getDataPriority()
    this.getDataCategory()
  }
  componentDidUpdate(prevState){
    if(prevState.data !== this.state.data){
      this.getDataStatus()
      this.getDataPriority()
      this.getDataCategory()
    }
  }


  getData = async() => {
    const userID =  await AsyncStorage.getItem('userID')
  firestore()
    .collection(`Users/${userID}/Note`)
    .onSnapshot(snapshot => {
        let data = []
      snapshot.forEach( doc => {
        data.push({...doc.data(), id: doc.id})
      })
      this.setState({data: data})
    })
  }

  getDataStatus = async() => {   
    const userID =  await AsyncStorage.getItem('userID')
    firestore()
      .collection(`Users/${userID}/Status`)
      .onSnapshot(snapshot => {
        let data = []
        let temp = []
        snapshot.forEach( doc => {
          data.push({...doc.data(), id: doc.id})
        })
        this.setState({dataStatus: data})
        for(let i = 0; i < data.length; i++){
          temp.push({
            name: data[i].nameStatus,
            population: 0,
            color: `#${data[i].color}`,
            legendFontColor: "#000",
            legendFontSize: 18
          })
        }      
        for(let i = 0; i < temp.length; i++){
          const count = this.state.data.filter(obj => obj.status === temp[i].name).length
          temp[i].population += count
        }
        this.setState({dataDashboard: temp})
      })
  }
  
  getDataPriority = async() => {   
    const userID =  await AsyncStorage.getItem('userID')
    firestore()
      .collection(`Users/${userID}/Priority`)
      .onSnapshot(snapshot => {
        let data = []
        let temp = []
        snapshot.forEach( doc => {
          data.push({...doc.data(), id: doc.id})
        })
        this.setState({dataPriority: data})
        for(let i = 0; i < data.length; i++){
          temp.push({
            name: data[i].namePriority,
            population: 0,
            color: `#${data[i].color}`,
            legendFontColor: "#000",
            legendFontSize: 18
          })
        }      
        for(let i = 0; i < temp.length; i++){
          const count = this.state.data.filter(obj => obj.priority === temp[i].name).length
          temp[i].population += count
        }
        this.setState({dataDashboardPri: temp})
      })
  }

  getDataCategory = async() => {   
    const userID =  await AsyncStorage.getItem('userID')
    firestore()
      .collection(`Users/${userID}/Category`)
      .onSnapshot(snapshot => {
        let data = []
        let temp = []
        snapshot.forEach( doc => {
          data.push({...doc.data(), id: doc.id})
        })
        this.setState({dataCategory: data})
        for(let i = 0; i < data.length; i++){
          temp.push({
            name: data[i].nameCategory,
            population: 0,
            color: `#${data[i].color}`,
            legendFontColor: "#000",
            legendFontSize: 18
          })
        }      
        for(let i = 0; i < temp.length; i++){
          const count = this.state.data.filter(obj => obj.category === temp[i].name).length
          temp[i].population += count
        }
        this.setState({dataDashboardCate: temp})
      })
  }

render(){
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`
  }
    return (
      <View style={styles.container}>
        <Header name={`TOTAL NOTES: ${this.state.data.length}`}></Header>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.titleChart}>Status</Text>
          <PieChart
            data={this.state.dataDashboard}
            width={Dimensions.get('screen').width}
            height={Dimensions.get('screen').height * 30 / 100}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"20"}
            absolute
          />
        </View>
        <View>
          <Text style={styles.titleChart}>Priority</Text>
          <PieChart
            data={this.state.dataDashboardPri}
            width={Dimensions.get('screen').width}
            height={Dimensions.get('screen').height * 30 / 100}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"20"}
            absolute
          />
        </View>
        <View style={styles.bottom}>
          <Text style={styles.titleChart}>Category</Text>
          <PieChart
            data={this.state.dataDashboardCate}
            width={Dimensions.get('screen').width}
            height={Dimensions.get('screen').height * 30 / 100}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"20"}
            absolute
          />
        </View>
        </ScrollView>
      </View>
    );
}
}
  const styles = EStyleSheet.create({
    container: {
      backgroundColor: '#F0F2EF',
    },
    titleChart: {
      fontSize: '2rem',
      fontWeight: '600',
      marginTop: '5%',
      textAlign: 'center'
    },
    total: {
      fontSize: '1.5rem',
      fontWeight: '400',
      textAlign: 'center'
    },
    bottom:{
      marginBottom: '6rem'
    }
  });
  
