//   // Import the functions you need from the SDKs you need
//   import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
//   import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
//   // TODO: Add SDKs for Firebase products that you want to use
//   // https://firebase.google.com/docs/web/setup#available-libraries

//   // Your web app's Firebase configuration
//   // For Firebase JS SDK v7.20.0 and later, measurementId is optional
//   const firebaseConfig = {
//     apiKey: "AIzaSyBjWCAC_gazDGfozuqC3VOdCYazK_UdPP8",
//     authDomain: "portal-bce40.firebaseapp.com",
//     databaseURL: "https://portal-bce40-default-rtdb.firebaseio.com/",
//     projectId: "portal-bce40",
//     storageBucket: "portal-bce40.firebasestorage.app",
//     messagingSenderId: "338576186844",
//     appId: "1:338576186844:web:1afb2ea6f4464f84708319",
//     measurementId: "G-BZ3K2HF01W"
//   };

//   // Initialize Firebase
//   const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);
  
//   // Define the data you want to store
//   const data = {
//     name: "John Doe",
//     age: 30,
//   };
  
//   // Set the data to the database
//   const dataRef = ref(db, "users/user1");
//   set(dataRef, data)
//     .then(() => {
//       console.log("Data stored successfully!");
//     })
//     .catch((error) => {
//       console.error("Error storing data:", error);
//     });
  
//   // Get the data from the database
//   const userRef = ref(db, "users/user1");
//   get(userRef)
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         const user = snapshot.val();
//         console.log("User data:", user);
//         if (user.name === "John Doe") {
//           console.log("Data stored correctly!");
//         } else {
//           console.log("Data not stored correctly!");
//         }
//       } else {
//         console.log("No data available");
//       }
//     })
//     .catch((error) => {
//       console.error("Error getting data:", error);
//     });