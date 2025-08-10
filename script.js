import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, set, get, ref, update, remove, push, onChildAdded } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAgcnPQ00J8ZaI6PwZO-BwOx-k7WVVx3t8",
    authDomain: "test-c461a.firebaseapp.com",
    databaseURL: "https://test-c461a-default-rtdb.firebaseio.com",
    projectId: "test-c461a",
    storageBucket: "test-c461a.appspot.com",
    messagingSenderId: "306949126741",
    appId: "1:306949126741:web:e933e913cda094890432dc",
    measurementId: "G-NR2KXC0C8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log("Firebase initialized", db);

// --- Existing user data functions ---

function writeUserData(userId, firstname, lastname, email) {
    set(ref(db, 'users/' + userId), {
        firstname,
        lastname,
        email
    });
}

writeUserData("user1", "Ram", "Thapa", "ram@gmail.com");
writeUserData("user2", "Sita", "Sharma", "sita.sharma@example.com");
writeUserData("user3", "Hari", "Gurung", "hari.gurung@example.com");
writeUserData("user4", "Anita", "Koirala", "anita.koirala@example.com");
writeUserData("user5", "Bikash", "Rai", "bikash.rai@example.com");

function readUser() {
    const userRef = ref(db, 'users');
    get(userRef).then(snapshot => {
        snapshot.forEach(childSnapshot => {
            console.log("User:", childSnapshot.val());
        });
    });
}

readUser();

function updateUserData(userId, updatedData) {
    const userRef = ref(db, 'users/' + userId);
    update(userRef, updatedData)
        .then(() => console.log("User updated successfully"))
        .catch(error => console.error("Error updating user:", error));
}

function deleteUserData(userId) {
    const userRef = ref(db, 'users/' + userId);
    remove(userRef)
        .then(() => console.log("User deleted successfully"))
        .catch(error => console.error("Error deleting user:", error));
}

// --- NEW: Handle contact form submission and save messages ---

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const messagesRef = ref(db, 'messages');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = contactForm['name'].value.trim();
    const email = contactForm['email'].value.trim();
    const message = contactForm['message'].value.trim();

    if (!name || !email || !message) {
        formStatus.textContent = "Please fill in all fields.";
        formStatus.style.color = "red";
        return;
    }

    const newMessageRef = push(messagesRef);
    set(newMessageRef, {
        name,
        email,
        message,
        timestamp: Date.now()
    })
    .then(() => {
        formStatus.textContent = "Message sent successfully!";
        formStatus.style.color = "#acc1ff";
        contactForm.reset();
    })
    .catch(error => {
        formStatus.textContent = "Error sending message.";
        formStatus.style.color = "red";
        console.error("Error writing message:", error);
    });
});

// --- NEW: Listen for new messages and display them in console ---

onChildAdded(messagesRef, (data) => {
    const msg = data.val();
    console.log("New message received:");
    console.log(`Name: ${msg.name}`);
    console.log(`Email: ${msg.email}`);
    console.log(`Message: ${msg.message}`);
    console.log(`Timestamp: ${new Date(msg.timestamp).toLocaleString()}`);
});
