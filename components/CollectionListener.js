import React, { useEffect } from 'react';
import firebase from 'firebase';
import 'firebase/firestore';

const CollectionListener = ({ name }) => {
  useEffect(() => {
    const unsubscribe = firebase.firestore().collection(name).onSnapshot(snapshot => {
      const data = snapshot.docs.map(doc => doc.data());
      console.log(data);
    });

    return () => unsubscribe();
  }, [name]);

  return null;
}

export default CollectionListener();