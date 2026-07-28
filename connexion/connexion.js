import { 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");


form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;


    message.innerHTML = "Connexion en cours...";
    message.style.color = "#aaa";


    try {

        const userCredential = await signInWithEmailAndPassword(
            window.auth,
            email,
            password
        );


        const user = userCredential.user;


        message.innerHTML = "Connexion réussie !";
        message.style.color = "#00ff88";


        console.log("Utilisateur connecté :", user.email);


        setTimeout(() => {
            window.location.href = "profil.html";
        }, 1000);


    } catch (error) {


        console.error(error);


        switch(error.code){

            case "auth/invalid-email":
                message.innerHTML = "Adresse email invalide.";
                break;


            case "auth/user-not-found":
                message.innerHTML = "Aucun compte trouvé avec cet email.";
                break;


            case "auth/wrong-password":
                message.innerHTML = "Mot de passe incorrect.";
                break;


            case "auth/invalid-credential":
                message.innerHTML = "Email ou mot de passe incorrect.";
                break;


            default:
                message.innerHTML = "Une erreur est survenue.";
        }


        message.style.color = "#ff4444";
    }

});

