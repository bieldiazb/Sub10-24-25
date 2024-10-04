// Import Firebase modules using their full URLs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

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

// Populate the athlete dropdown
async function loadAthletes() {
    const athleteSelect = document.getElementById("athlete-select");
    const athletesCollection = collection(db, "atletes");

    try {
        const athleteSnapshot = await getDocs(athletesCollection);
        athleteSnapshot.forEach((doc) => {
            const athleteData = doc.data();
            const option = document.createElement("option");
            option.value = doc.id; // Set the value to the document ID
            option.textContent = athleteData.nom; // Display the athlete's name
            athleteSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading athletes:", error);
    }
}

// Populate the event dropdown from the 'proves' collection
async function loadEvents() {
    const eventSelect = document.getElementById("event-select");
    const eventsCollection = collection(db, "proves");

    try {
        const eventSnapshot = await getDocs(eventsCollection);
        eventSnapshot.forEach((doc) => {
            const eventData = doc.data();
            const option = document.createElement("option");
            option.value = doc.id; // Set the value to the document ID
            option.textContent = eventData.prova; // Display the 'prova' field as event name
            eventSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading events:", error);
    }
}

// Function to add a mark for the selected athlete and event
async function addMark(event) {
    event.preventDefault(); // Prevent form submission

    const athleteId = document.getElementById("athlete-select").value;
    const eventId = document.getElementById("event-select").value;
    const mark = document.getElementById("mark").value;
    const data = document.getElementById("data").value; // This should be in YYYY-MM-DD format
    const lloc = document.getElementById("lloc").value;

    try {
        // Convert the date from YYYY-MM-DD to DD/MM/YYYY
        const [year, month, day] = data.split("-");
        const europeanDateFormat = `${day}/${month}/${year}`;

        // Add a new document to the 'marca' collection
        const docRef = await addDoc(collection(db, "marca"), {
            IDatleta: athleteId,
            IDprova: eventId,
            marca: mark,
            data: europeanDateFormat, // Save the date in European format
            lloc: lloc,
        });

        alert("Mark added successfully with ID: " + docRef.id);
        // Clear form fields
        document.getElementById("add-mark-form").reset();
    } catch (error) {
        console.error("Error adding mark:", error);
        alert("Error adding mark. Please check the console for more details.");
    }
}

// Load athletes and events when the page loads
window.onload = async () => {
    await loadAthletes();
    await loadEvents();
};

// Attach the addMark function to the form submission event
document.getElementById("add-mark-form").addEventListener("submit", addMark);
