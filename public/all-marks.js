import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC09cNolrDC5frhfXep9iiwq8lf-Y4mCYY",
    authDomain: "sub10-ecc96.firebaseapp.com",
    projectId: "sub10-ecc96",
    storageBucket: "sub10-ecc96.appspot.com",
    messagingSenderId: "281812157491",
    appId: "1:281812157491:web:aa4e61897199eeedebcf46",
    measurementId: "G-EGHZBHFRHY"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentMarkId; // Variable to hold the ID of the mark being edited
let athleteMap = {}; // Maps athlete names to IDs
let eventMap = {}; // Maps event names to IDs

// Function to load athletes into the dropdown
async function loadAthletes() {
    const athleteSelect = document.getElementById('mark-athlete-select');
    const editAthleteSelect = document.getElementById('edit-mark-athlete-select');

    athleteSelect.innerHTML = '<option value="">Select Athlete</option>';
    editAthleteSelect.innerHTML = '<option value="">Select Athlete</option>';

    const athletesCol = collection(db, 'atletes');
    const athleteSnapshot = await getDocs(athletesCol);
    athleteSnapshot.forEach((doc) => {
        const athleteData = doc.data();
        athleteMap[athleteData.nom] = doc.id; // Store mapping from name to ID
        const option = document.createElement('option');
        option.value = athleteData.nom;
        option.text = athleteData.nom;
        athleteSelect.appendChild(option);
        editAthleteSelect.appendChild(option.cloneNode(true));
    });
}

// Function to load events into the dropdown
async function loadEvents() {
    const eventSelect = document.getElementById('mark-event-select');
    const editEventSelect = document.getElementById('edit-mark-event-select');

    eventSelect.innerHTML = '<option value="">Select Event</option>';
    editEventSelect.innerHTML = '<option value="">Select Event</option>';

    const eventsCol = collection(db, 'proves');
    const eventSnapshot = await getDocs(eventsCol);
    eventSnapshot.forEach((doc) => {
        const eventData = doc.data();
        eventMap[eventData.prova] = doc.id; // Store mapping from name to ID
        const option = document.createElement('option');
        option.value = eventData.prova;
        option.text = eventData.prova;
        eventSelect.appendChild(option);
        editEventSelect.appendChild(option.cloneNode(true));
    });
}

// Function to load marks
async function loadMarks() {
    const markGrid = document.getElementById('mark-grid');
    markGrid.innerHTML = ''; // Clear existing marks

    const marksCol = collection(db, 'marca'); // Collection for marks
    const markSnapshot = await getDocs(marksCol);

    markSnapshot.forEach(async (doc) => {
        const markData = doc.data();
        const athleteName = await getAthleteName(markData.IDatleta);
        const eventName = await getEventName(markData.IDprova);

        const markDiv = document.createElement('div');
        markDiv.className = 'mark-card';
        markDiv.innerHTML = `
            <h2>Athlete: ${athleteName}</h2>
            <p>Event: ${eventName}</p>
            <p>Location: ${markData.lloc}</p>
            <p>Date: ${markData.data}</p>
            <p>Mark: ${markData.marca}</p>
            <button class="edit-button" onclick="editMark('${doc.id}')">Edit</button>
            <button class="delete-button" onclick="confirmDeleteMark('${doc.id}')">Delete</button>
        `;

        markGrid.appendChild(markDiv);
    });
}

// Function to get athlete name by ID
async function getAthleteName(id) {
    const athleteDoc = doc(db, 'atletes', id);
    const athleteData = await getDoc(athleteDoc);
    return athleteData.exists() ? athleteData.data().nom : 'Unknown Athlete';
}

// Function to get event name by ID
async function getEventName(id) {
    const eventDoc = doc(db, 'proves', id);
    const eventData = await getDoc(eventDoc);
    return eventData.exists() ? eventData.data().prova : 'Unknown Event';
}

// Function to add a new mark
document.getElementById('add-mark-button').addEventListener('click', async () => {
    const athleteName = document.getElementById('mark-athlete-select').value;
    const eventName = document.getElementById('mark-event-select').value;
    const location = document.getElementById('mark-location').value;
    const date = document.getElementById('mark-date').value;
    const result = document.getElementById('mark-result').value;

    // Check if all fields are filled
    if (!athleteName || !eventName || !location || !date || !result) {
        alert('All fields are required!');
        return;
    }

    const athleteID = athleteMap[athleteName];
    const eventID = eventMap[eventName];

    await addDoc(collection(db, 'marca'), {
        IDatleta: athleteID,
        IDprova: eventID,
        lloc: location,
        data: date,
        marca: result
    });
    loadMarks(); // Reload marks after adding

    // Clear input fields
    document.getElementById('mark-athlete-select').value = '';
    document.getElementById('mark-event-select').value = '';
    document.getElementById('mark-location').value = '';
    document.getElementById('mark-date').value = '';
    document.getElementById('mark-result').value = '';
});

// Function to confirm mark deletion
window.confirmDeleteMark = function(id) { // Expose to global scope
    const confirmDelete = confirm('Are you sure you want to delete this mark?');
    if (confirmDelete) {
        deleteMark(id);
    }
};

// Function to delete a mark
window.deleteMark = async function(id) {
    await deleteDoc(doc(db, 'marca', id));
    loadMarks(); // Reload marks after deletion
};

// Function to edit a mark
window.editMark = async function(id) {
    currentMarkId = id; // Set the current mark ID
    const markDoc = doc(db, 'marca', id);
    const markData = await getDoc(markDoc); // Fetch mark data from Firestore

    // Populate the modal fields with the mark data
    document.getElementById('edit-mark-athlete-select').value = markData.data().IDatleta;
    document.getElementById('edit-mark-event-select').value = markData.data().IDprova;
    document.getElementById('edit-mark-location').value = markData.data().lloc;
    document.getElementById('edit-mark-date').value = markData.data().data;
    document.getElementById('edit-mark-result').value = markData.data().marca;

    // Show the modal
    document.getElementById('edit-mark-modal').style.display = 'block';
};

// Function to close the modal
document.getElementById('close-modal').onclick = function() {
    document.getElementById('edit-mark-modal').style.display = 'none';
};

// Function to update the mark's data
document.getElementById('update-mark-button').onclick = async function() {
    const updatedAthleteName = document.getElementById('edit-mark-athlete-select').value;
    const updatedEventName = document.getElementById('edit-mark-event-select').value;
    const updatedLocation = document.getElementById('edit-mark-location').value;
    const updatedDate = document.getElementById('edit-mark-date').value;
    const updatedResult = document.getElementById('edit-mark-result').value;

    // Check if all fields are filled
    if (!updatedAthleteName || !updatedEventName || !updatedLocation || !updatedDate || !updatedResult) {
        alert('All fields are required!');
        return;
    }

    const updatedAthleteID = athleteMap[updatedAthleteName];
    const updatedEventID = eventMap[updatedEventName];

    await updateDoc(doc(db, 'marca', currentMarkId), {
        IDatleta: updatedAthleteID,
        IDprova: updatedEventID,
        lloc: updatedLocation,
        data: updatedDate,
        marca: updatedResult
    });

    loadMarks(); // Reload marks after updating
    document.getElementById('edit-mark-modal').style.display = 'none'; // Close the modal
};

// Load athletes, events, and marks when the page is loaded
loadAthletes();
loadEvents();
loadMarks();
