import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBSCqSsBTXk9Q8sBX88NgrdDHUAHT0Cq6I",
  authDomain: "lumalia.firebaseapp.com",
  projectId: "lumalia",
  storageBucket: "lumalia.firebasestorage.app",
  messagingSenderId: "189011821397",
  appId: "1:189011821397:web:03c8609d35d488dce2a5dc",
  measurementId: "G-4G4KMZCWFH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const $ = (id) => document.getElementById(id);
const form = $("register-form");
const message = $("message");
const submit = $("submit");
const submitText = $("submit-text");
const loader = $("loader");

function showMessage(text, type = "error") {
  message.textContent = text;
  message.className = `message show${type === "success" ? " success" : ""}`;
}

function clearMessage() {
  message.textContent = "";
  message.className = "message";
}

function setError(id, text = "") {
  const error = $(`${id}-error`);
  if (error) error.textContent = text;

  const input = $(id);
  if (input && input.type !== "checkbox") {
    input.classList.toggle("invalid", Boolean(text));
  }
}

function clearErrors() {
  ["email", "username", "password", "confirm", "terms"].forEach((id) => setError(id));
}

function cleanUsername(value) {
  return value.trim().replace(/^@/, "");
}

function validUsername(value) {
  return /^[A-Za-z0-9_-]{3,32}$/.test(value);
}

function setLoading(loading) {
  submit.disabled = loading;
  submitText.hidden = loading;
  loader.hidden = !loading;
}

function firebaseMessage(error) {
  const messages = {
    "auth/email-already-in-use": "Cette adresse e-mail possède déjà un compte Lumalia.",
    "auth/invalid-email": "L'adresse e-mail n'est pas valide.",
    "auth/weak-password": "Le mot de passe est trop faible.",
    "auth/network-request-failed": "Impossible de contacter Firebase. Vérifiez votre connexion.",
    "auth/operation-not-allowed": "L'inscription par e-mail n'est pas activée dans Firebase Authentication.",
    "auth/too-many-requests": "Trop de tentatives. Attendez quelques instants avant de réessayer.",
    "auth/admin-restricted-operation": "Cette méthode d'inscription est désactivée dans Firebase."
  };

  return messages[error.code] || `Erreur Firebase : ${error.code || "inconnue"}. ${error.message || ""}`;
}

function updatePasswordStrength() {
  const password = $("password").value;
  const bar = $("strength-bar");
  const label = $("strength-label");

  if (!password) {
    bar.style.width = "0%";
    label.textContent = "Entrez un mot de passe";
    return;
  }

  let score = 0;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  bar.style.width = `${Math.min((score / 6) * 100, 100)}%`;

  if (score <= 2) {
    bar.style.background = "#ff758e";
    label.textContent = "Faible";
  } else if (score <= 4) {
    bar.style.background = "#f2c45d";
    label.textContent = "Correct";
  } else {
    bar.style.background = "#69e89b";
    label.textContent = "Fort";
  }
}

$("password").addEventListener("input", updatePasswordStrength);

document.querySelectorAll(".password-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const input = $(button.dataset.target);
    const visible = input.type === "text";
    input.type = visible ? "password" : "text";
    button.textContent = visible ? "◉" : "◌";
  });
});

$("suggest").addEventListener("click", () => {
  $("username").value = `Lumalien${Math.floor(1000 + Math.random() * 9000)}`;
  setError("username");
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  clearMessage();
  clearErrors();

  const email = $("email").value.trim().toLowerCase();
  const username = cleanUsername($("username").value);
  const password = $("password").value;
  const confirmation = $("confirm").value;
  const termsAccepted = $("terms").checked;

  let valid = true;

  if (!email) {
    setError("email", "Veuillez entrer votre adresse e-mail.");
    valid = false;
  }

  if (!validUsername(username)) {
    setError("username", "Le pseudo doit contenir 3 à 32 caractères : lettres, chiffres, _ ou -.");
    valid = false;
  }

  if (password.length < 12) {
    setError("password", "Le mot de passe doit contenir au moins 12 caractères.");
    valid = false;
  }

  if (password !== confirmation) {
    setError("confirm", "Les deux mots de passe ne correspondent pas.");
    valid = false;
  }

  if (!termsAccepted) {
    setError("terms", "Vous devez accepter les conditions d'utilisation.");
    valid = false;
  }

  if (!valid) {
    showMessage("Vérifiez les informations indiquées avant de continuer.");
    return;
  }

  setLoading(true);

  try {
    // 1. Création réelle du compte Firebase Authentication.
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    // 2. Enregistrement du pseudo dans le profil Firebase.
    await updateProfile(user, { displayName: username });

    // 3. Création du profil Firestore dans users/{UID}.
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      username,
      grade: "Joueur",
      role: "player",
      bio: "",
      avatar: "",
      emailVerified: false,
      twoFactorEnabled: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 4. Vérification de l'adresse e-mail.
    try {
      await sendEmailVerification(user);
    } catch (verificationError) {
      console.warn("Compte créé, mais e-mail de vérification non envoyé.", verificationError);
    }

    showMessage("Compte créé avec succès ! Vérifiez votre adresse e-mail.", "success");

    // À adapter si ta page de compte se trouve ailleurs.
    setTimeout(() => {
      window.location.href = "../compte/";
    }, 1800);

  } catch (error) {
    console.error("Erreur complète Lumalia/Firebase :", error);
    showMessage(firebaseMessage(error));
    setLoading(false);
  }
});
