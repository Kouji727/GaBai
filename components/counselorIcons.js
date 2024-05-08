import React from 'react'
import { StyleSheet, Image, TouchableHighlight } from 'react-native'

const CounselorIcons = ({ onPress}) => {
    return (
        <TouchableHighlight style={styles.counselorIcons} onPress={onPress}>
        <Image
        style={styles.pfp}
        source={require('../assets/p.jpg')} // Use require for local images
        onError={(error) => console.error('Image loading error:', error)} // Handle errors
        />
    </TouchableHighlight>
    )
}

export default CounselorIcons

const styles = StyleSheet.create({
    
counselorIcons: {
    width: 125,
    height: 125,
    marginVertical: 10,
    //backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#8a344c'
},

pfp: {
    width: 125,
    height: 125,
    backgroundColor: 'black',
    borderRadius: 100,
    margin: 10,
},
})
