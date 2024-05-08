import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAXBM4bLhvzmT_cL9ZsHuoKs-Fd4YodM3I",
    authDomain: "gabai-g4841.firebaseapp.com",
    projectId: "gabai-g4841",
    storageBucket: "gabai-g4841.appspot.com",
    messagingSenderId: "719409106806",
    appId: "1:719409106806:web:e3af3fe80f5d4ab5bc3457"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const getPosts = () => {
    return db.collection('posts')
        .get()
        .then(result => result.docs)
        .then(docs => docs.map(doc => ({
            id: doc.id,
            username: doc.data().username,
            title: doc.data().title,
            date: doc.data().date.toDate().toLocaleString()
        })))
    }

export const streamPosts = (observer) => {
    db.collection('posts').onSnapshot(observer)
}

export const streamCounselor = (observer) => {
    db.collection('users').onSnapshot(observer)
}

const auth = firebase.auth();
const db = firebase.firestore();

export { firebase, auth, db };
