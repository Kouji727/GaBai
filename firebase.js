import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCtCweTsBCHge-5g5T1ZwjkDSqGmRsD9wE",
    authDomain: "guidanceweb-43eec.firebaseapp.com",
    projectId: "guidanceweb-43eec",
    storageBucket: "guidanceweb-43eec.appspot.com",
    messagingSenderId: "68099093831",
    appId: "1:68099093831:web:d5852faec4d8603d02c862",
    measurementId: "G-X2PYPXCXN8"
  };

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const getPosts = () => {
    return db.collection('threads')
        .get()
        .then(result => result.docs)
        .then(docs => docs.map(doc => ({
            id: doc.id,
            username: doc.data().username,
            content: doc.data().content,
            createdAt: doc.data().createdAt.toDate().toLocaleString()
        })))
    }

export const streamPosts = (observer) => {
    db.collection('threads').onSnapshot(observer)
}

export const streamCounselor = (observer) => {
    db.collection('users').onSnapshot(observer)
}

const auth = firebase.auth();
const db = firebase.firestore();

export { firebase, auth, db };
