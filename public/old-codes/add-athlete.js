// Import Firebase modules using their full URLs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

// Firebase configuration (replace with your Firebase project details)
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

// Function to add an athlete
async function addAthlete(event) {
    event.preventDefault(); // Prevent form submission

    // Get values from the form fields
    const name = document.getElementById("athlete-name").value;
    const sexe = document.getElementById("athlete-sexe").value;
    const naixament = document.getElementById("athlete-naixament").value;

    try {
        // Convert the birth date from YYYY-MM-DD to DD/MM/YYYY
        const [year, month, day] = naixament.split("-");
        const europeanBirthDateFormat = `${day}/${month}/${year}`;

        // Add a new document to the 'atletes' collection
        const docRef = await addDoc(collection(db, "atletes"), {
            nom: name,
            sexe: sexe,
            naixament: europeanBirthDateFormat // Save the date in European format
        });

        alert("Athlete added successfully with ID: " + docRef.id);
        // Clear form fields
        document.getElementById("add-athlete-form").reset();
    } catch (error) {
        console.error("Error adding athlete:", error);
        alert("Error adding athlete. Please check the console for more details.");
    }
}

// Attach the addAthlete function to the form submission event
document.getElementById("add-athlete-form").addEventListener("submit", addAthlete);
