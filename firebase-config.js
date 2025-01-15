import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBjWCAC_gazDGfozuqC3VOdCYazK_UdPP8",
    authDomain: "portal-bce40.firebaseapp.com",
    databaseURL: "https://portal-bce40-default-rtdb.firebaseio.com/",
    projectId: "portal-bce40",
    storageBucket: "portal-bce40.appspot.com",
    messagingSenderId: "338576186844",
    appId: "1:338576186844:web:1afb2ea6f4464f84708319",
    measurementId: "G-BZ3K2HF01W",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
