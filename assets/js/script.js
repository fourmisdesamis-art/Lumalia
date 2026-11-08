const firebaseConfig = {
    apiKey: "TON_API_KEY",
    authDomain: "TON_PROJET.firebaseapp.com",
    projectId: "TON_PROJET_ID",
    storageBucket: "TON_PROJET.appspot.com",
    messagingSenderId: "TON_SENDER_ID",
    appId: "TON_APP_ID"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const accountBtn = document.getElementById('account-btn');
const accountMenu = document.getElementById('account-menu');
const usernameDisplay = document.getElementById('username-display');
const loggedInView = document.getElementById('logged-in-view');
const loggedOutView = document.getElementById('logged-out-view');
const logoutBtn = document.getElementById('logout-btn');

accountBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    accountMenu.classList.toggle('show');
    accountBtn.classList.toggle('active');
});

window.addEventListener('click', (e) => {
    if (!accountMenu.contains(e.target) && !accountBtn.contains(e.target)) {
        accountMenu.classList.remove('show');
        accountBtn.classList.remove('active');
    }
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        usernameDisplay.textContent = user.displayName || user.email.split('@')[0];
        loggedInView.style.display = 'block';
        loggedOutView.style.display = 'none';
    } else {
        usernameDisplay.textContent = "Anilyse"; // Pour tester l'UI
        loggedInView.style.display = 'none';
        loggedOutView.style.display = 'block';
    }
});

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
        accountMenu.classList.remove('show');
        accountBtn.classList.remove('active');
    });
});
