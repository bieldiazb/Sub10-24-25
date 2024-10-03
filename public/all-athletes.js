import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

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

let currentAthleteId; // Variable to hold the ID of the athlete being edited

// Function to load athletes
async function loadAthletes() {
    const athleteGrid = document.getElementById('athlete-grid');
    athleteGrid.innerHTML = ''; // Clear existing athletes

    const athletesCol = collection(db, 'atletes');
    const athleteSnapshot = await getDocs(athletesCol);

    athleteSnapshot.forEach((doc) => {
        const athleteData = doc.data();
        const athleteDiv = document.createElement('div');
        athleteDiv.className = 'athlete-card';
        athleteDiv.innerHTML = `
            <h2>${athleteData.nom}</h2>
            <p>Sex: ${athleteData.sexe}</p>
            <p>Birthdate: ${athleteData.naixament}</p>
            <button onclick="editAthlete('${doc.id}')">Edit</button>
            <button onclick="confirmDeleteAthlete('${doc.id}')">Delete</button>
        `;
        athleteGrid.appendChild(athleteDiv);
    });
}

// Function to add an athlete
document.getElementById('add-athlete-button').addEventListener('click', async () => {
    const name = document.getElementById('athlete-name').value;
    const sex = document.getElementById('athlete-sex').value;
    const birthdate = document.getElementById('athlete-birthdate').value;

    // Check if all fields are filled
    if (!name || !sex || !birthdate) {
        alert('All fields are required!');
        return;
    }

    await addDoc(collection(db, 'atletes'), {
        nom: name,
        sexe: sex,
        naixament: birthdate
    });
    loadAthletes(); // Reload athletes after adding
    document.getElementById('athlete-name').value = ''; // Clear input fields
    document.getElementById('athlete-sex').value = '';
    document.getElementById('athlete-birthdate').value = '';
});

// Function to confirm athlete deletion
window.confirmDeleteAthlete = function(id) { // Expose to global scope
    const confirmDelete = confirm('Are you sure you want to delete this athlete?');
    if (confirmDelete) {
        deleteAthlete(id);
    }
};

// Function to delete an athlete
window.deleteAthlete = async function(id) {
    await deleteDoc(doc(db, 'atletes', id));
    loadAthletes(); // Reload athletes after deletion
};

// Function to edit an athlete
window.editAthlete = async function(id) {
    currentAthleteId = id; // Set the current athlete ID
    const athleteDoc = doc(db, 'atletes', id);
    const athleteData = await getDoc(athleteDoc); // Fetch athlete data from Firestore

    // Populate the modal fields with the athlete data
    document.getElementById('edit-athlete-name').value = athleteData.data().nom;
    document.getElementById('edit-athlete-sex').value = athleteData.data().sexe;
    document.getElementById('edit-athlete-birthdate').value = athleteData.data().naixament;

    // Show the modal
    document.getElementById('edit-athlete-modal').style.display = 'block';
};

// Function to close the modal
document.getElementById('close-modal').onclick = function() {
    document.getElementById('edit-athlete-modal').style.display = 'none';
};

// Function to update the athlete's data
document.getElementById('update-athlete-button').onclick = async function() {
    const updatedName = document.getElementById('edit-athlete-name').value;
    const updatedSex = document.getElementById('edit-athlete-sex').value;
    const updatedBirthdate = document.getElementById('edit-athlete-birthdate').value;

    // Check if all fields are filled
    if (!updatedName || !updatedSex || !updatedBirthdate) {
        alert('All fields are required!');
        return;
    }

    await updateDoc(doc(db, 'atletes', currentAthleteId), {
        nom: updatedName,
        sexe: updatedSex,
        naixament: updatedBirthdate
    });

    loadAthletes(); // Reload athletes after updating
    document.getElementById('edit-athlete-modal').style.display = 'none'; // Close the modal
};

// Load athletes when the page is loaded
loadAthletes();
