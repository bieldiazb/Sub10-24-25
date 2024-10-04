// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

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

// Add event to Firestore
document.getElementById('submit-event').addEventListener('click', async () => {
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    const lloc = document.getElementById('event-lloc').value;

    if (title && date) {
        try {
            // Convert the date from YYYY-MM-DD to DD/MM/YYYY
            const [year, month, day] = date.split("-");
            const europeanDateFormat = `${day}/${month}/${year}`;
            
            // Save the event with the formatted date
            await addDoc(collection(db, "events"), {
                title,
                date: europeanDateFormat, // Save the date in European format
                lloc,
            });
            alert('Event added successfully!');
            document.getElementById('event-title').value = '';
            document.getElementById('event-date').value = '';
            document.getElementById('event-lloc').value = '';
        } catch (error) {
            console.error("Error adding event:", error);
            alert('Error adding event. Please try again.');
        }
    } else {
        alert('Please fill in both fields.');
    }
});
