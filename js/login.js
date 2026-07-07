/*==================================================
                LUMALIA LOGIN V2
==================================================*/

const authCard = document.querySelector(".auth-card");

const leftPanel = document.querySelector(".left-panel");
const rightPanel = document.querySelector(".right-panel");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

/*=========================================
            ETAT INITIAL
=========================================*/

rightPanel.style.display = "none";

/*=========================================
        OUVRIR INSCRIPTION
=========================================*/

showRegister.addEventListener("click", () => {

    leftPanel.animate([

        {
            opacity:1,
            transform:"translateX(0)"
        },

        {
            opacity:0,
            transform:"translateX(-60px)"
        }

    ],{

        duration:300,

        fill:"forwards"

    });

    setTimeout(()=>{

        leftPanel.style.display="none";

        rightPanel.style.display="flex";

        rightPanel.animate([

            {
                opacity:0,
                transform:"translateX(60px)"
            },

            {
                opacity:1,
                transform:"translateX(0)"
            }

        ],{

            duration:350,

            fill:"forwards"

        });

    },280);

});

/*=========================================
        RETOUR CONNEXION
=========================================*/

showLogin.addEventListener("click",()=>{

    rightPanel.animate([

        {
            opacity:1,
            transform:"translateX(0)"
        },

        {
            opacity:0,
            transform:"translateX(60px)"
        }

    ],{

        duration:300,

        fill:"forwards"

    });

    setTimeout(()=>{

        rightPanel.style.display="none";

        leftPanel.style.display="flex";

        leftPanel.animate([

            {
                opacity:0,
                transform:"translateX(-60px)"
            },

            {
                opacity:1,
                transform:"translateX(0)"
            }

        ],{

            duration:350,

            fill:"forwards"

        });

    },280);

});

/*=========================================
        AFFICHER MOT DE PASSE
=========================================*/

document
.querySelectorAll(".togglePassword")
.forEach(icon=>{

    icon.addEventListener("click",()=>{

        const input =
        icon.parentElement.querySelector("input");

        if(input.type==="password"){

            input.type="text";

            icon.classList.remove("fa-eye");

            icon.classList.add("fa-eye-slash");

        }

        else{

            input.type="password";

            icon.classList.remove("fa-eye-slash");

            icon.classList.add("fa-eye");

        }

    });

});

/*=========================================
        ANIMATION INPUTS
=========================================*/

document
.querySelectorAll("input")
.forEach(input=>{

    input.addEventListener("focus",()=>{

        input.parentElement.style.transform="scale(1.02)";

    });

    input.addEventListener("blur",()=>{

        input.parentElement.style.transform="scale(1)";

    });

});

/*==================================================
            MESSAGES ANIMÉS
==================================================*/

const message = document.getElementById("message");

window.showMessage = function(text, type = "info") {

    message.textContent = text;

    message.style.opacity = "0";
    message.style.transform = "translateY(15px)";

    switch(type){

        case "success":

            message.style.borderColor = "#00ff88";
            message.style.color = "#00ff88";
            break;

        case "error":

            message.style.borderColor = "#ff4d6d";
            message.style.color = "#ff4d6d";
            break;

        default:

            message.style.borderColor = "#00e5ff";
            message.style.color = "#00e5ff";

    }

    setTimeout(()=>{

        message.style.transition=".35s";

        message.style.opacity="1";

        message.style.transform="translateY(0px)";

    },50);

}

/*==================================================
            BOUTONS
==================================================*/

document.querySelectorAll("button").forEach(button=>{

    button.addEventListener("mousedown",()=>{

        button.style.transform="scale(.96)";

    });

    button.addEventListener("mouseup",()=>{

        button.style.transform="scale(1)";

    });

    button.addEventListener("mouseleave",()=>{

        button.style.transform="scale(1)";

    });

});

/*==================================================
        PARALLAX DU FOND
==================================================*/

const gradient1 = document.querySelector(".gradient1");
const gradient2 = document.querySelector(".gradient2");

document.addEventListener("mousemove",(e)=>{

    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    gradient1.style.transform =
        `translate(${x*40}px, ${y*40}px)`;

    gradient2.style.transform =
        `translate(${-x*40}px, ${-y*40}px)`;

});

/*==================================================
            LOGO
==================================================*/

const logo = document.querySelector(".logo");

setInterval(()=>{

    logo.animate([

        {
            transform:"translateY(0px)"
        },

        {
            transform:"translateY(-6px)"
        },

        {
            transform:"translateY(0px)"
        }

    ],{

        duration:2500

    });

},2500);

/*==================================================
        FEATURES
==================================================*/

document.querySelectorAll(".features div").forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.animate([

            {
                transform:"translateY(0)"
            },

            {
                transform:"translateY(-8px)"
            }

        ],{

            duration:200,

            fill:"forwards"

        });

    });

});

/*==================================================
            CHARGEMENT
==================================================*/

window.addEventListener("load",()=>{

    document.body.style.opacity="1";

});

/*==================================================
                FIREBASE
==================================================*/

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification
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
            BOUTONS
==================================================*/

const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");

/*==================================================
            INSCRIPTION
==================================================*/

registerButton.addEventListener("click", async () => {

    const pseudo =
        document.getElementById("pseudo").value.trim();

    const email =
        document.getElementById("register-email").value.trim();

    const password =
        document.getElementById("register-password").value;

    if(!pseudo || !email || !password){

        showMessage(
            "Remplis tous les champs.",
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

                pseudoMinecraft:pseudo,

                email:email,

                rang:"Joueur",

                coins:0,

                niveau:1,

                experience:0,

                createdAt:new Date().toISOString()

            }

        );

        showMessage(

            "✅ Compte créé ! Vérifie ton adresse e-mail.",

            "success"

        );

    }

    catch(error){

        showMessage(

            error.message,

            "error"

        );

        console.error(error);

    }

});

/*==================================================
            CONNEXION
==================================================*/

loginButton.addEventListener("click", async () => {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    if(!email || !password){

        showMessage(

            "Remplis tous les champs.",

            "error"

        );

        return;

    }

    try{

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

                "❌ Vérifie ton adresse e-mail avant de te connecter.",

                "error"

            );

            return;

        }

        showMessage(

            "Connexion réussie !",

            "success"

        );

        setTimeout(()=>{

            window.location.href="index.html";

        },1200);

    }

    catch(error){

        showMessage(

            error.message,

            "error"

        );

        console.error(error);

    }

});
