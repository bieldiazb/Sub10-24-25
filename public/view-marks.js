// Import Firebase modules using their full URLs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

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

// Global variables to store athletes and events
let athletes = [];
let events = [];

// Load athletes into the dropdown
async function loadAthletes() {
    const athleteSelect = document.getElementById("athlete-select");
    const athletesCollection = collection(db, "atletes");

    try {
        const athleteSnapshot = await getDocs(athletesCollection);
        athleteSnapshot.forEach((doc) => {
            athletes.push({ id: doc.id, ...doc.data() });
            const option = document.createElement("option");
            option.value = doc.id;
            option.textContent = doc.data().nom; // Display athlete's name
            athleteSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading athletes:", error);
    }
}

// Load events into the dropdown
async function loadEvents() {
    const eventSelect = document.getElementById("event-select");
    const eventsCollection = collection(db, "proves");

    try {
        const eventSnapshot = await getDocs(eventsCollection);
        eventSnapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() });
            const option = document.createElement("option");
            option.value = doc.id;
            option.textContent = doc.data().prova; // Display event name
            eventSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading events:", error);
    }
}

// Fetch and display marks with optional filters
async function loadMarks(athleteId = "", eventId = "") {
    const marksTableBody = document.getElementById("marks-table").querySelector("tbody");
    marksTableBody.innerHTML = ""; // Clear existing rows

    const marksCollection = collection(db, "marca");

    try {
        const marksSnapshot = await getDocs(marksCollection);
        const marksData = marksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        for (const mark of marksData) {
            // Check if the mark matches the filter criteria
            if ((athleteId && mark.IDatleta !== athleteId) || (eventId && mark.IDprova !== eventId)) {
                continue; // Skip marks that do not match the criteria
            }

            // Fetch athlete name
            const athlete = athletes.find(a => a.id === mark.IDatleta);
            const athleteName = athlete ? athlete.nom : "Unknown";

            // Fetch event name
            const event = events.find(e => e.id === mark.IDprova);
            const eventName = event ? event.prova : "Unknown";

            // Create a new row
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${athleteName}</td>
                <td>${eventName}</td>
                <td>${mark.marca}</td>
                <td>${mark.data}</td>
                <td>${mark.lloc}</td>
            `;
            marksTableBody.appendChild(row);
        }
    } catch (error) {
        console.error("Error loading marks:", error);
    }
}

// Filter marks based on selected athlete and event
document.getElementById("filter-button").addEventListener("click", () => {
    const selectedAthleteId = document.getElementById("athlete-select").value;
    const selectedEventId = document.getElementById("event-select").value;
    loadMarks(selectedAthleteId, selectedEventId);
});

// Load athletes and events when the page loads
window.onload = async () => {
    await loadAthletes();
    await loadEvents();
    loadMarks(); // Load all marks initially
};