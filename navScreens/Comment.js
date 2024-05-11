import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { db, auth, firebase } from '../firebase';
import CollectionListener from '../components/CollectionListener';
import ThreadDesignComment from '../components/threadDesignComment';
import { MenuProvider } from 'react-native-popup-menu';

const Comment = ({ route }) => {
    const { postId } = route.params;
    const [threadId, setThreadId] = useState(null);

    useEffect(() => {
        const threadRef = db.collection('threads').doc(postId);

        const unsubscribe = threadRef.onSnapshot(snapshot => {
            if (snapshot.exists) {
                const threadData = snapshot.data();
                setThreadId(threadData);
                console.log("Document Data:", threadData);
            } else {
                console.log('Document does not exist!');
            }
        });

        return () => unsubscribe();
    }, [postId]);

    console.log(postId);

    return (
        <MenuProvider>
            <View style={styles.container}>
                <ThreadDesignComment item={threadId} />
                <Text>sfgdfsdfgdf {threadId?.username}</Text>
            </View>
        </MenuProvider>
    );
}

export default Comment;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
