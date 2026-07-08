/*==================================================
                LUMALIA LOGIN V2
                PARTIE 1
==================================================*/

/*==================================================
                VARIABLES
==================================================*/

const leftPanel = document.querySelector(".left-panel");
const rightPanel = document.querySelector(".right-panel");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");

const message = document.getElementById("message");

const gradient1 = document.querySelector(".gradient1");
const gradient2 = document.querySelector(".gradient2");

const logo = document.querySelector(".logo");

/*==================================================
                ETAT INITIAL
==================================================*/

rightPanel.style.display = "none";

/*==================================================
            AFFICHER LES MESSAGES
==================================================*/

function showMessage(text, type = "info") {

    message.textContent = text;

    message.style.opacity = "0";
    message.style.transform = "translateY(15px)";

    message.className = "";

    switch(type){

        case "success":

            message.style.color = "#00ff88";
            message.style.borderColor = "#00ff88";
            break;

        case "error":

            message.style.color = "#ff5c7c";
            message.style.borderColor = "#ff5c7c";
            break;

        default:

            message.style.color = "#00e5ff";
            message.style.borderColor = "#00e5ff";

    }

    setTimeout(()=>{

        message.style.opacity="1";
        message.style.transform="translateY(0)";

    },50);

}

/*==================================================
            CHANGER DE PANNEAU
==================================================*/

showRegister.addEventListener("click",()=>{

    leftPanel.style.display="none";
    rightPanel.style.display="flex";

});

showLogin.addEventListener("click",()=>{

    rightPanel.style.display="none";
    leftPanel.style.display="flex";

});

/*==================================================
        AFFICHER LE MOT DE PASSE
==================================================*/

document.querySelectorAll(".togglePassword").forEach(icon=>{

    icon.addEventListener("click",()=>{

        const input = icon.parentElement.querySelector("input");

        if(input.type==="password"){

            input.type="text";

            icon.classList.replace("fa-eye","fa-eye-slash");

        }else{

            input.type="password";

            icon.classList.replace("fa-eye-slash","fa-eye");

        }

    });

});

/*==================================================
        ANIMATION DES INPUTS
==================================================*/

document.querySelectorAll(".input-group").forEach(group=>{

    const input = group.querySelector("input");

    input.addEventListener("focus",()=>{

        group.style.transform="scale(1.02)";

    });

    input.addEventListener("blur",()=>{

        group.style.transform="scale(1)";

    });

});

/*==================================================
            PARALLAX
==================================================*/

document.addEventListener("mousemove",(e)=>{

    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    gradient1.style.transform =
        `translate(${x*30}px, ${y*30}px)`;

    gradient2.style.transform =
        `translate(${-x*30}px, ${-y*30}px)`;

});

/*==================================================
            LOGO FLOTTANT
==================================================*/

setInterval(()=>{

    logo.animate([

        { transform:"translateY(0px)" },
        { transform:"translateY(-6px)" },
        { transform:"translateY(0px)" }

    ],{

        duration:2500

    });

},2500);

/*==================================================
            EFFET DES BOUTONS
==================================================*/

document.querySelectorAll("button").forEach(button=>{

    button.addEventListener("mousedown",()=>{

        button.style.transform="scale(.97)";

    });

    button.addEventListener("mouseup",()=>{

        button.style.transform="scale(1)";

    });

    button.addEventListener("mouseleave",()=>{

        button.style.transform="scale(1)";

    });

});

/*==================================================
            CHARGEMENT
==================================================*/

window.addEventListener("load",()=>{

    document.body.style.opacity="1";

});

/*==================================================
                LUMALIA LOGIN V2
                PARTIE 2
                FIREBASE
==================================================*/

/*==================================================
                IMPORTS
==================================================*/

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/*==================================================
                CONFIG FIREBASE
==================================================*/

const firebaseConfig = {

    apiKey: "AIzaSyBSCqSsBTXk9Q8sBX88NgrdDHUAHT0Cq6I",

    authDomain: "lumalia.firebaseapp.com",

    projectId: "lumalia",

    storageBucket: "lumalia.appspot.com",

    messagingSenderId: "722559383104",

    appId: "1:722559383104:web:xxxxxxxxxxxxxxxx"

};

/*==================================================
            INITIALISATION
==================================================*/

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

console.log("✅ Firebase initialisé");

/*==================================================
                PARTIE 3
                INSCRIPTION
==================================================*/

registerButton.addEventListener("click", async () => {

    const pseudo = document
        .getElementById("pseudo")
        .value
        .trim();

    const email = document
        .getElementById("register-email")
        .value
        .trim();

    const password = document
        .getElementById("register-password")
        .value;

    if (!pseudo || !email || !password) {

        showMessage(
            "Merci de remplir tous les champs.",
            "error"
        );

        return;

    }

    if (password.length < 6) {

        showMessage(
            "Le mot de passe doit contenir au moins 6 caractères.",
            "error"
        );

        return;

    }

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        await sendEmailVerification(
            userCredential.user
        );

        await setDoc(

            doc(
                db,
                "users",
                userCredential.user.uid
            ),

            {

                pseudoMinecraft: pseudo,

                email: email,

                rang: "Joueur",

                niveau: 1,

                experience: 0,

                coins: 0,

                createdAt: new Date().toISOString()

            }

        );

        showMessage(
            "✅ Compte créé ! Vérifie ton adresse e-mail.",
            "success"
        );

        setTimeout(() => {

            window.location.href = "../index.html";

        }, 2000);

    }

    catch (error) {

        console.error(error);

        switch (error.code) {

            case "auth/email-already-in-use":

                showMessage(
                    "Cette adresse e-mail est déjà utilisée.",
                    "error"
                );

                break;

            case "auth/invalid-email":

                showMessage(
                    "Adresse e-mail invalide.",
                    "error"
                );

                break;

            case "auth/weak-password":

                showMessage(
                    "Mot de passe trop faible.",
                    "error"
                );

                break;

            default:

                showMessage(
                    "Une erreur est survenue.",
                    "error"
                );

        }

    }

});

/*==================================================
                PARTIE 4
                CONNEXION
==================================================*/

loginButton.addEventListener("click", async () => {

    const email = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    const rememberMe = document
        .getElementById("rememberMe")
        .checked;

    if (!email || !password) {

        showMessage(
            "Merci de remplir tous les champs.",
            "error"
        );

        return;

    }

    try {

        /*==============================
            RESTER CONNECTÉ
        ==============================*/

        await setPersistence(

            auth,

            rememberMe

                ? browserLocalPersistence

                : browserSessionPersistence

        );

        /*==============================
            CONNEXION FIREBASE
        ==============================*/

        const userCredential =
            await signInWithEmailAndPassword(

                auth,

                email,

                password

            );

        const user = userCredential.user;

        await user.reload();

        /*==============================
            EMAIL VERIFIE
        ==============================*/

        if (!user.emailVerified) {

            showMessage(

                "Tu dois vérifier ton adresse e-mail avant de te connecter.",

                "error"

            );

            return;

        }

        showMessage(

            "Connexion réussie !",

            "success"

        );

        /*==============================
            REDIRECTION
        ==============================*/

        setTimeout(() => {

            window.location.href = "../index.html";

        }, 1200);

    }

    catch (error) {

        console.error(error);

        switch (error.code) {

            case "auth/invalid-email":

                showMessage(
                    "Adresse e-mail invalide.",
                    "error"
                );

                break;

            case "auth/invalid-credential":

                showMessage(
                    "Adresse e-mail ou mot de passe incorrect.",
                    "error"
                );

                break;

            case "auth/user-disabled":

                showMessage(
                    "Ce compte est désactivé.",
                    "error"
                );

                break;

            case "auth/too-many-requests":

                showMessage(
                    "Trop de tentatives. Réessaie plus tard.",
                    "error"
                );

                break;

            default:

                showMessage(
                    "Une erreur est survenue.",
                    "error"
                );

        }

    }

});
