// firebaseConfig.js
const firebaseConfig = {
    apiKey: "AIzaSyAlzdvrUAoQ5_7tX9g8Nc_a0Zao62CtCEs",
    authDomain: "comments-555d2.firebaseapp.com",
    projectId: "comments-555d2",
    storageBucket: "comments-555d2.appspot.com",
    messagingSenderId: "206294213643",
    appId: "1:206294213643:web:5d3f10dedbaf7cf9df930e"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
