import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Navbar from '../components/navbar';
export default function Schedule() {
  return (
    <View style={styles.container}>

        <View style={styles.test}>
            <Text>
                Schedule Page
            </Text>
        </View>


      <Navbar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },

  test: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  }

});
