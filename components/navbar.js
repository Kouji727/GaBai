import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Navbar() {
  return (
    <View style={styles.container}>

      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navItem}>
          <Text>1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text>2</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text>3</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text>4</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text>5</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:0,
    backgroundColor: 'black',
    height:60

  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    //position: 'absolute',
    //bottom: 0,
    //left: 0,
    //right: 0,
    backgroundColor: '#f0f0f0',
    height: 60,
    //elevation: 5,
  },
  navItem: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
