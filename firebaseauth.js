// Import the functions you need from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    sendEmailVerification, 
    signInWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Show a message on the UI
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Handle User Sign-Up
const signUpButton = document.getElementById("submitSignUp");
signUpButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.getElementById("rEmail").value;
    const password = document.getElementById("rPassword").value;
    const firstName = document.getElementById("fName").value;
    const lastName = document.getElementById("lName").value;

    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send email verification
        await sendEmailVerification(user);
        showMessage("A verification email has been sent. Please verify your email before signing in.", "signUpMessage");

        // Sign out user to prevent immediate login
        await signOut(auth);

        // Save user data in Firestore after verification (not yet!)
        console.log("Account created but not verified. Data not saved to Firestore.");
    } catch (error) {
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
            showMessage("Email Address Already Exists!", "signUpMessage");
        } else {
            showMessage("Error creating account: " + error.message, "signUpMessage");
        }
    }
});

// Handle User Sign-In
const signInButton = document.getElementById("submitSignIn");
signInButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // Sign in user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            showMessage("Please verify your email address before signing in.", "signInMessage");
            await signOut(auth);
            return;
        }

        // Save verified user data to Firestore
        const userData = {
            email: user.email,
            firstName: "FirstNameHere", // Replace with input or existing data retrieval
            lastName: "LastNameHere", // Replace with input or existing data retrieval
            isVerified: true,
        };

        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, userData, { merge: true });

        showMessage("Login successful!", "signInMessage");
        localStorage.setItem("loggedInUserId", user.uid);
        window.location.href = "homepage.html"; // Redirect to homepage
    } catch (error) {
        const errorCode = error.code;
        if (errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password") {
            showMessage("Invalid email or password.", "signInMessage");
        } else {
            showMessage("Error signing in: " + error.message, "signInMessage");
        }
    }
});

