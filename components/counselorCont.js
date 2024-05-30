import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableHighlight, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function CounselorCont({ item }) {

  const [link, setLink] = useState();

  useEffect(() => {
    setLink(item?.link);
  }, []);

  const openLink = () => {
    if (link && Linking.canOpenURL(link)) {
      Linking.openURL(link);
    } else {
      console.log("Invalid URL");
    }
  };

  return (
    <View style={styles.counselorCont}>
      <View style={styles.marginCounselorCont}></View>
      <View style={styles.counselPicName}>
        <TouchableHighlight style={styles.counselorIcons}>
          <Image
            style={styles.pfp}
            source={item.img ? { uri: item.img } : require('../assets/defaultPfp.jpg')}
            onError={(error) => console.error('Image loading error:', error)} // Handle errors
          />
        </TouchableHighlight>
        <View style={styles.pfpName}>
          <Text style={styles.textC}>
            {item.username}
          </Text>
        </View>
      </View>
      <View style={styles.counselorDesc}>
        <Text style={{ textAlign: 'center', fontSize: 15, color: '#BA5255' }}>
          {item.info1} {'\n'}
          {item.info2}{'\n'}
          {item.info3}
        </Text>
      </View>
      {/* <TouchableOpacity style={styles.socialLinkButton} onPress={openLink}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Social Link</Text>
          <FontAwesome name="heart" size={24} color="white" />
        </View>
      </TouchableOpacity> */}
    </View>
  )
}

const styles = StyleSheet.create({

  counselorIcons: {
    width: 125,
    height: 125,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#8a344c',
  },

  counselorCont: {
    backgroundColor: '#F3E8EB',
    width: '85%',
    height: 'auto',
    borderRadius: 10,
    justifyContent: 'center',
    elevation: 10,
    paddingVertical: 15,
    alignItems: 'center'
  },

  marginCounselorCont: {
    backgroundColor: 'yellow', //wala pa
  },

  counselPicName: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  pfp: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    borderRadius: 100,
    margin: 20,
  },

  pfpName: {
  },

  textC: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#BA5255'
  },

  counselorDesc: {
    alignItems: 'center',
    paddingTop: 10,
    padding: 25
  },

  socialLinkButton: {
    width: '35%',
    backgroundColor: '#BA5255',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 10
  },

  buttonContent: {
    alignItems: 'center',
  },

  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white'
  }
})
