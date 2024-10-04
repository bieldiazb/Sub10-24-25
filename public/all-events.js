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

let currentEventId; // Variable to hold the ID of the event being edited

// Function to load events
async function loadEvents() {
    const eventGrid = document.getElementById('event-grid');
    eventGrid.innerHTML = ''; // Clear existing events

    const eventsCol = collection(db, 'events'); // Collection for events
    const eventSnapshot = await getDocs(eventsCol);

    eventSnapshot.forEach((doc) => {
        const eventData = doc.data();
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-card';
        eventDiv.innerHTML = `
            <h2>${eventData.title}</h2>
            <p>Location: ${eventData.lloc}</p>
            <p>Date: ${eventData.data}</p>
            <button onclick="editEvent('${doc.id}')">Edit</button>
            <button onclick="confirmDeleteEvent('${doc.id}')">Delete</button>
        `;
        eventGrid.appendChild(eventDiv);
    });
}

// Function to add a new event
document.getElementById('add-event-button').addEventListener('click', async () => {
    const title = document.getElementById('event-title').value;
    const location = document.getElementById('event-location').value;
    const date = document.getElementById('event-date').value;

    // Check if all fields are filled
    if (!title || !location || !date) {
        alert('All fields are required!');
        return;
    }

    await addDoc(collection(db, 'events'), {
        title: title,
        lloc: location,
        data: date
    });
    loadEvents(); // Reload events after adding
    // Clear input fields
    document.getElementById('event-title').value = '';
    document.getElementById('event-location').value = '';
    document.getElementById('event-date').value = '';
});

// Function to confirm event deletion
window.confirmDeleteEvent = function(id) { // Expose to global scope
    const confirmDelete = confirm('Are you sure you want to delete this event?');
    if (confirmDelete) {
        deleteEvent(id);
    }
};

// Function to delete an event
window.deleteEvent = async function(id) {
    await deleteDoc(doc(db, 'events', id));
    loadEvents(); // Reload events after deletion
};

// Function to edit an event
window.editEvent = async function(id) {
    currentEventId = id; // Set the current event ID
    const eventDoc = doc(db, 'events', id);
    const eventData = await getDoc(eventDoc); // Fetch event data from Firestore

    // Populate the modal fields with the event data
    document.getElementById('edit-event-title').value = eventData.data().title;
    document.getElementById('edit-event-location').value = eventData.data().lloc;
    document.getElementById('edit-event-date').value = eventData.data().data;

    // Show the modal
    document.getElementById('edit-event-modal').style.display = 'block';
};

// Function to close the modal
document.getElementById('close-modal').onclick = function() {
    document.getElementById('edit-event-modal').style.display = 'none';
};

// Function to update the event's data
document.getElementById('update-event-button').onclick = async function() {
    const updatedTitle = document.getElementById('edit-event-title').value;
    const updatedLocation = document.getElementById('edit-event-location').value;
    const updatedDate = document.getElementById('edit-event-date').value;

    // Check if all fields are filled
    if (!updatedTitle || !updatedLocation || !updatedDate) {
        alert('All fields are required!');
        return;
    }

    await updateDoc(doc(db, 'events', currentEventId), {
        title: updatedTitle,
        lloc: updatedLocation,
        data: updatedDate
    });

    loadEvents(); // Reload events after updating
    document.getElementById('edit-event-modal').style.display = 'none'; // Close the modal
};

// Load events when the page is loaded
loadEvents();
