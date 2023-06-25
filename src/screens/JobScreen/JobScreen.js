import React, {useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // import the icons from the expo vector icons library
const JobScreen = ({navigation}) => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What You Want to Do?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate("Post Job")}} >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Post Job</Text>
            <MaterialIcons name="add" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate("AllJobScreen")}} >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>View Jobs</Text>
            <MaterialIcons name="add" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{navigation.navigate("View Bids")}} style={styles.button}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>View Bids</Text>
            <MaterialIcons name="visibility" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{navigation.navigate("Invited Bids")}} style={styles.button}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Invited Bids</Text>
            <MaterialIcons name="visibility" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{navigation.navigate("ViewOrdersScreen")}} style={styles.button}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Active Orders</Text>
            <MaterialIcons name="reorder" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{navigation.navigate("CompletedOrders")}} style={styles.button}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Completed Orders</Text>
            <MaterialIcons name="playlist-add-check" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 32,
      color: '#2196F3',
    },
    buttonContainer: {
      flexDirection: 'column',
      padding: 10,
      flexWrap:'wrap',
      justifyContent:'center',
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'space-between'
    },
    button: {
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      paddingVertical: 16,
      paddingHorizontal: 32,
      marginHorizontal: 8,
      marginBottom:20,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    buttonText: {
      color: '#2196F3',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  
  });
  
export default JobScreen