// Import Firebase modules using their full URLs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";


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

async function updateAthleteInfo(event) {
    event.preventDefault(); // Prevent form submission

    // Get values from the form fields
    const athleteId = document.getElementById("athlete-id").value;
    const newName = document.getElementById("athlete-name").value;
    const newSexe = document.getElementById("athlete-sexe").value;
    const newNaixament = document.getElementById("athlete-naixament").value;

    console.log("Attempting to update athlete:", athleteId, newName, newSexe, newNaixament);

    let updatedFields = {};
    if (newName) updatedFields.nom = newName;
    if (newSexe) updatedFields.sexe = newSexe;
    if (newNaixament) updatedFields.naixament = newNaixament;

    try {
        const athleteRef = doc(db, "atletes", athleteId);
        await updateDoc(athleteRef, updatedFields);
        console.log("Update successful");
        alert("Athlete information updated successfully!");
    } catch (error) {
        console.error("Error updating athlete:", error);
        alert("Error updating athlete. Please check the console for more details.");
    }
}


// Attach the update function to the form submission event
document.getElementById("update-form").addEventListener("submit", updateAthleteInfo);
