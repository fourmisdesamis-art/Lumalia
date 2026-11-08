// ==========================================
// 1. CONFIGURATION FIREBASE
// ==========================================
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

// ==========================================
// 2. GESTION DU MENU DÉROULANT COMPTE
// ==========================================
const accountBtn = document.getElementById('account-btn');
const accountMenu = document.getElementById('account-menu');
const usernameDisplay = document.getElementById('username-display');
const loggedInView = document.getElementById('logged-in-view');
const loggedOutView = document.getElementById('logged-out-view');
const logoutBtn = document.getElementById('logout-btn');

// Ouvrir / Fermer le menu au clic
accountBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    accountMenu.classList.toggle('show');
    accountBtn.classList.toggle('active');
});

// Fermer le menu si on clique ailleurs
window.addEventListener('click', (e) => {
    if (!accountMenu.contains(e.target) && !accountBtn.contains(e.target)) {
        accountMenu.classList.remove('show');
        accountBtn.classList.remove('active');
    }
});

// ==========================================
// 3. GESTION DE L'ÉTAT DE CONNEXION
// ==========================================
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Connecté
        usernameDisplay.textContent = user.displayName || user.email.split('@')[0];
        loggedInView.style.display = 'block';
        loggedOutView.style.display = 'none';
    } else {
        // Déconnecté
        usernameDisplay.textContent = "Connexion";
        loggedInView.style.display = 'none';
        loggedOutView.style.display = 'block';
    }
});

// ==========================================
// 4. BOUTON DÉCONNEXION
// ==========================================
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
        accountMenu.classList.remove('show');
        accountBtn.classList.remove('active');
    }).catch((error) => {
        console.error("Erreur :", error);
    });
});
