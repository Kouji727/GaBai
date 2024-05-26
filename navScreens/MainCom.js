import React from 'react';
import { View, Text, TouchableOpacity, ScrollView} from 'react-native';

const MainCom = () => {
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}>
        <View style={{width: '85%', borderRadius: 10, marginTop: 10}}>
            <TouchableOpacity style={{paddingVertical: 50, backgroundColor: 'green', borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}>   
                <Text>Enter Freedom Wall</Text>
            </TouchableOpacity>
        </View>

    </ScrollView>
  )
}

export default MainCom
