/*==================================================
                LUMALIA LOGIN V2
==================================================*/

/*==================================================
                IMPORTS FIREBASE
==================================================*/

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    browserLocalPersistence,
    browserSessionPersistence,
    setPersistence
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

    projectId: "lumalia"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

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

    switch(type){

        case "success":

            message.style.color="#00ff88";
            message.style.borderColor="#00ff88";
            break;

        case "error":

            message.style.color="#ff5c7c";
            message.style.borderColor="#ff5c7c";
            break;

        default:

            message.style.color="#00e5ff";
            message.style.borderColor="#00e5ff";

    }

    setTimeout(()=>{

        message.style.transition=".35s";
        message.style.opacity="1";
        message.style.transform="translateY(0px)";

    },50);

}

/*==================================================
            OUVRIR INSCRIPTION
==================================================*/

showRegister.addEventListener("click",()=>{

    leftPanel.animate([

        {opacity:1,transform:"translateX(0)"},
        {opacity:0,transform:"translateX(-60px)"}

    ],{

        duration:300,
        fill:"forwards"

    });

    setTimeout(()=>{

        leftPanel.style.display="none";

        rightPanel.style.display="flex";

        rightPanel.animate([

            {opacity:0,transform:"translateX(60px)"},
            {opacity:1,transform:"translateX(0)"}

        ],{

            duration:350,
            fill:"forwards"

        });

    },280);

});

/*==================================================
            RETOUR CONNEXION
==================================================*/

showLogin.addEventListener("click",()=>{

    rightPanel.animate([

        {opacity:1,transform:"translateX(0)"},
        {opacity:0,transform:"translateX(60px)"}

    ],{

        duration:300,
        fill:"forwards"

    });

    setTimeout(()=>{

        rightPanel.style.display="none";

        leftPanel.style.display="flex";

        leftPanel.animate([

            {opacity:0,transform:"translateX(-60px)"},
            {opacity:1,transform:"translateX(0)"}

        ],{

            duration:350,
            fill:"forwards"

        });

    },280);

});

/*==================================================
        AFFICHER / MASQUER LE MOT DE PASSE
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
            PARALLAX
==================================================*/

document.addEventListener("mousemove",(e)=>{

    const x=e.clientX/window.innerWidth;
    const y=e.clientY/window.innerHeight;

    gradient1.style.transform=`translate(${x*35}px,${y*35}px)`;
    gradient2.style.transform=`translate(${-x*35}px,${-y*35}px)`;

});

/*==================================================
            LOGO FLOTTANT
==================================================*/

setInterval(()=>{

    logo.animate([

        {transform:"translateY(0px)"},
        {transform:"translateY(-6px)"},
        {transform:"translateY(0px)"}

    ],{

        duration:2500

    });

},2500);

/*==================================================
            ANIMATION DES INPUTS
==================================================*/

document.querySelectorAll(".input-group").forEach(group=>{

    const input=group.querySelector("input");

    input.addEventListener("focus",()=>{

        group.style.transform="scale(1.02)";

    });

    input.addEventListener("blur",()=>{

        group.style.transform="scale(1)";

    });

});

/*==================================================
            CHARGEMENT
==================================================*/

window.addEventListener("load",()=>{

    document.body.style.opacity="1";

});

/*==================================================
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

    if(!pseudo || !email || !password){

        showMessage(
            "Remplis tous les champs.",
            "error"
        );

        return;

    }

    if(password.length < 6){

        showMessage(
            "Le mot de passe doit contenir au moins 6 caractères.",
            "error"
        );

        return;

    }

    try{

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

        setTimeout(()=>{

            window.location.href="../index.html";

        },1800);

    }

    catch(error){

        switch(error.code){

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

        console.error(error);

    }

});

/*==================================================
                CONNEXION
==================================================*/

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/*==================================================
        DEJA CONNECTE ?
==================================================*/

onAuthStateChanged(auth, (user)=>{

    if(user && user.emailVerified){

        window.location.href="../index.html";

    }

});

/*==================================================
            CONNEXION
==================================================*/

loginButton.addEventListener("click", async ()=>{

    const email =
        document.getElementById("email")
        .value
        .trim();

    const password =
        document.getElementById("password")
        .value;

    if(!email || !password){

        showMessage(

            "Remplis tous les champs.",

            "error"

        );

        return;

    }

    try{

        const rememberMe =
            document.getElementById("rememberMe").checked;

        await setPersistence(

            auth,

            rememberMe

            ? browserLocalPersistence

            : browserSessionPersistence

        );

        const userCredential =
        await signInWithEmailAndPassword(

            auth,

            email,

            password

        );

        const user =
            userCredential.user;

        await user.reload();

        if(!user.emailVerified){

            showMessage(

                "Vérifie ton adresse e-mail avant de te connecter.",

                "error"

            );

            return;

        }

        showMessage(

            "Connexion réussie !",

            "success"

        );

        setTimeout(()=>{

            window.location.href="../index.html";

        },1200);

    }

    catch(error){

        switch(error.code){

            case "auth/invalid-email":

                showMessage(

                    "Adresse e-mail invalide.",

                    "error"

                );

                break;

            case "auth/user-not-found":

                showMessage(

                    "Aucun compte n'existe avec cette adresse.",

                    "error"

                );

                break;

            case "auth/wrong-password":

                showMessage(

                    "Mot de passe incorrect.",

                    "error"

                );

                break;

            case "auth/invalid-credential":

                showMessage(

                    "Adresse e-mail ou mot de passe incorrect.",

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

                console.error(error);

        }

    }

});
