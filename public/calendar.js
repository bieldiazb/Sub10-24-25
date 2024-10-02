// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to parse date in dd/mm/yyyy format
function parseDate(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); // month - 1 because months are 0-indexed
}

// Fetch and display events
async function loadEvents() {
    const eventsTableBody = document.getElementById('events-table').querySelector('tbody');
    const eventsCollection = collection(db, "events"); // Ensure this matches your Firestore collection name

    try {
        const eventsSnapshot = await getDocs(eventsCollection);
        const events = []; // Array to store events for sorting

        eventsSnapshot.forEach(doc => {
            const eventData = doc.data();
            events.push(eventData); // Push event data into array
        });

        // Log events for debugging
        console.log("Fetched Events:", events);

        // Sort all events based on the parsed date
        events.sort((a, b) => parseDate(a.date) - parseDate(b.date));

        // Clear existing rows
        eventsTableBody.innerHTML = '';

        // Create a new row for each sorted event
        events.forEach(eventData => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${eventData.title}</td>
                <td>${eventData.date}</td>
                <td>${eventData.lloc}</td>
            `;
            eventsTableBody.appendChild(row);
        });

        // If no upcoming events, display a message
        if (events.length === 0) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td colspan="3">No upcoming events found.</td>
            `;
            eventsTableBody.appendChild(row);
        }

    } catch (error) {
        console.error("Error loading events:", error);
    }
}

// Load events when the page loads
window.onload = loadEvents;
