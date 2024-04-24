import React, { useState } from 'react';
import { StyleSheet,Text, View, TouchableOpacity } from 'react-native';
import Navbar from '../components/navbar';

export default function QuotePage() {

    const [quote, setQuote] = useState('');

    const genQuote = () => {
      setQuote('Random Quote');
    }

    return (
        <View style={styles.container}>


            <View style={styles.quoteElement}>
                <View style={styles.quoteCont}>

                </View>

                <View style={styles.quoteAndBut}>
                    <View style={styles.placeholder}>
                        <Text>
                            {quote}
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.butGen} onPress={genQuote}>
                        <Text>Generate</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Navbar/>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FECCC8'
    },

    quoteElement: {
        flex: 10,
        //backgroundColor: 'blue',
        justifyContent: 'center',
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
        backgroundColor: 'white',
        borderRadius: 30
    }
})