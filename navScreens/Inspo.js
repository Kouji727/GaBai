import React, { useState } from 'react';
import { StyleSheet,Text, View, TouchableOpacity } from 'react-native';

export default function Inspo() {

    const [quote, setQuote] = useState('');

    const genQuote = () => {
      setQuote("The only way to do great work is to love what you do. \n\n- Steve Jobs");
    }

    return (
        <View style={styles.container}>

            <View style={styles.inspoInfo}>
                <Text style={styles.textInspoInfo}>
                    INSPO
                </Text>

                <Text>
                    page description
                </Text>

            </View>

            <View style={styles.quoteContainer}>
                <Text style={styles.qotdText}>
                    Quote of the Day
                </Text>

                <View style={styles.quoteAndBut}>
                    <View style={styles.placeholder}>
                        <Text style={{textAlign: 'center'}}>
                            {quote}
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.butGen} onPress={genQuote}>
                        <Text>Show</Text>
                    </TouchableOpacity>
                </View>

            </View>

            <View style={styles.weCont}>

                <View style={styles.wfaCont}>
                    <Text style={styles.insideText}>Words from Alumni</Text>

                </View>

                <View style={styles.reCont}>
                    <Text style={styles.insideText}>Recent Events</Text>

                </View>
                
            </View>

        </View>
    )


}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#edd9df'
        //backgroundColor: 'yellow'
    },

    inspoInfo: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    textInspoInfo: {
        fontSize: 25
    },

    qotdText: {
        fontSize: 25,
        color: 'black',
        fontWeight: 'bold',
        padding: 10
    },

    quoteContainer: {
        flex: 2,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },

    weCont: {
        flex: 3,
        //backgroundColor: 'red',
        alignItems: 'center',
    },

    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 100,
        borderStyle: 'dashed',
        borderColor: 'black',
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10
    },

    quoteAndBut: {
        alignItems: 'center'
    },

    butGen: {
        alignItems:'center',
        marginTop: 10,
        width:100,
        padding: 10,
        backgroundColor: '#edd9df',
        borderRadius: 30
    },

    wfaCont: {

        width: '80%',
        height: '30%',
        backgroundColor: 'white',
        marginTop: 15,
        alignItems: 'center',
        borderRadius: 15


    },

    reCont: {
        width: '80%',
        height: '30%',
        backgroundColor: 'white',
        marginTop: 15,
        alignItems: 'center',
        borderRadius: 15
    },

    insideText: {
        fontSize: 25,
        color: 'black',
        fontWeight: 'bold',
        padding: 10
    }

})