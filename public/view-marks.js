import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC09cNolrDC5frhfXep9iiwq8lf-Y4mCYY",
    authDomain: "sub10-ecc96.firebaseapp.com",
    projectId: "sub10-ecc96",
    storageBucket: "sub10-ecc96.appspot.com",
    messagingSenderId: "281812157491",
    appId: "1:281812157491:web:aa4e61897199eeedebcf46",
    measurementId: "G-EGHZBHFRHY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let athletes = [];
let events = [];
let allMarks = [];

let currentSort = {
    column: null,
    direction: 'asc'
};

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
}

async function loadAthletes() {
    const athleteSelect = document.getElementById("athlete-select");
    const athletesCollection = collection(db, "atletes");

    try {
        const snapshot = await getDocs(athletesCollection);
        snapshot.forEach((doc) => {
            const data = { id: doc.id, ...doc.data() };
            athletes.push(data);
            const option = document.createElement("option");
            option.value = doc.id;
            option.textContent = data.nom;
            athleteSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading athletes:", error);
    }
}

async function loadEvents() {
    const eventSelect = document.getElementById("event-select");
    const eventsCollection = collection(db, "proves");

    try {
        const snapshot = await getDocs(eventsCollection);
        snapshot.forEach((doc) => {
            const data = { id: doc.id, ...doc.data() };
            events.push(data);
            const option = document.createElement("option");
            option.value = doc.id;
            option.textContent = data.prova;
            eventSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading events:", error);
    }
}

async function fetchAllMarks() {
    const marksCollection = collection(db, "marca");
    try {
        const snapshot = await getDocs(marksCollection);
        allMarks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching marks:", error);
    }
}

function displayMarks(filteredMarks) {
    const marksTableBody = document.querySelector("#marks-table tbody");
    marksTableBody.innerHTML = "";

    for (const mark of filteredMarks) {
        const athlete = athletes.find(a => a.id === mark.IDatleta);
        if (!athlete) continue;

        const event = events.find(e => e.id === mark.IDprova);
        const eventName = event ? event.prova : "Unknown";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${athlete.nom}</td>
            <td>${eventName}</td>
            <td>${mark.marca}</td>
            <td>${mark.data ? formatDate(mark.data) : "N/A"}</td>
            <td>${mark.lloc}</td>
        `;
        marksTableBody.appendChild(row);
    }
}

function sortMarks(column) {
    const direction = currentSort.column === column && currentSort.direction === 'asc' ? 'desc' : 'asc';
    currentSort = { column, direction };

    allMarks.sort((a, b) => {
        const getValue = (mark) => {
            const athlete = athletes.find(at => at.id === mark.IDatleta);
            const event = events.find(ev => ev.id === mark.IDprova);
            switch (column) {
                case 'nom': return athlete?.nom || '';
                case 'prova': return event?.prova || '';
                case 'marca': return parseFloat(mark.marca) || 0;
                case 'data': return mark.data || '';
                case 'lloc': return mark.lloc || '';
                default: return '';
            }
        };

        const valA = getValue(a);
        const valB = getValue(b);

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    filterAndDisplay();
}

function filterAndDisplay() {
    const athleteId = document.getElementById("athlete-select").value;
    const eventId = document.getElementById("event-select").value;
    const selectedSex = document.getElementById("sex-select").value;

    const filtered = allMarks.filter(mark => {
        const athlete = athletes.find(a => a.id === mark.IDatleta);
        if (!athlete) return false;

        if (athleteId && athlete.id !== athleteId) return false;
        if (eventId && mark.IDprova !== eventId) return false;
        if (selectedSex && athlete.sexe !== selectedSex) return false;

        return true;
    });

    displayMarks(filtered);
}

document.getElementById("filter-button").addEventListener("click", filterAndDisplay);

document.querySelectorAll("#marks-table th").forEach((th, index) => {
    const columnKeys = ['nom', 'prova', 'marca', 'data', 'lloc'];
    th.style.cursor = 'pointer';
    th.addEventListener("click", () => sortMarks(columnKeys[index]));
});

window.onload = async () => {
    await loadAthletes();
    await loadEvents();
    await fetchAllMarks();
    filterAndDisplay();
};
