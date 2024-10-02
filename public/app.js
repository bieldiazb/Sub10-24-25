// Import Firebase modules using their full URLs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC09cNolrDC5frhfXep9iiwq8lf-Y4mCYY",
  authDomain: "sub10-ecc96.firebaseapp.com",
  projectId: "sub10-ecc96",
  storageBucket: "sub10-ecc96.appspot.com",
  messagingSenderId: "281812157491",
  appId: "1:281812157491:web:aa4e61897199eeedebcf46",
  measurementId: "G-EGHZBHFRHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


//Function to fetch and display athletes from Firestore
async function fetchAthletes() {
    try {
        // Get the 'atletes' collection from Firestore
        const querySnapshot = await getDocs(collection(db, "atletes"));

        // Get the div element where athletes will be displayed
        const athletesListDiv = document.getElementById("athlete-list");
        athletesListDiv.innerHTML = ""; // Clear any existing content

        // Loop through each document in the collection and create HTML elements to display data
        querySnapshot.forEach((doc) => {
            const athlete = doc.data(); // Get the document data

            // Create a new div element for each athlete
            const athleteDiv = document.createElement("div");
            athleteDiv.className = "athlete"; // Add a class name for styling

            // Set the HTML content of the div with athlete information
            athleteDiv.innerHTML = `
                <h3>${athlete.nom}</h3>
                <p><strong>Sexe:</strong> ${athlete.sexe}</p>
                <p><strong>Naixament:</strong> ${athlete.naixament}</p>
            `;

            // Append the newly created div to the athletes list div
            athletesListDiv.appendChild(athleteDiv);
        });
    } catch (error) {
        console.error("Error fetching athletes: ", error);
    }
}

// Call the function to fetch and display athletes when the page loads
fetchAthletes();