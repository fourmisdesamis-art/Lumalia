// ============================================================
// LUMALIA — PARAMÈTRES
// Firebase Authentication + Firestore
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    updateProfile,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================================
// CONFIGURATION FIREBASE
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyBSCqSsBTXk9Q8sBX88NgrdDHUAHT0Cq6I",
    authDomain: "lumalia.firebaseapp.com",
    projectId: "lumalia"
};


// ============================================================
// INITIALISATION
// ============================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


// ============================================================
// ÉLÉMENTS HTML
// ============================================================

const handleInput = document.getElementById("handle");
const emailInput = document.getElementById("email");
const bioInput = document.getElementById("bio");
const publicProfileInput = document.getElementById("publicProfile");

const avatarPreview = document.getElementById("avatarPreview");
const avatarInput = document.getElementById("avatarInput");
const avatarButton = document.getElementById("avatarButton");

const saveAccountButton = document.getElementById("saveAccount");

const accountId = document.getElementById("accountId");
const accountCreated = document.getElementById("accountCreated");
const twoFactorStatus = document.getElementById("twoFactorStatus");

const emailStatus = document.getElementById("emailStatus");

const bioCounter = document.getElementById("bioCounter");


// ============================================================
// UTILITAIRES
// ============================================================

function showMessage(message, type = "success") {
    console.log(`[Lumalia] ${message}`);

    // On pourra remplacer ça par une vraie notification Lumalia
    // quand l'interface sera terminée.
    alert(message);
}


function formatDate(date) {
    if (!date) {
        return "Inconnue";
    }

    return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}


function updateBioCounter() {
    if (!bioInput || !bioCounter) {
        return;
    }

    bioCounter.textContent = bioInput.value.length;
}


// ============================================================
// VALIDATION DU HANDLE
// ============================================================

function isValidHandle(handle) {

    const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,31}$/;

    return regex.test(handle);
}


// ============================================================
// CHARGEMENT DU COMPTE
// ============================================================

async function loadAccount(user) {

    if (!user) {
        return;
    }

    console.log("Chargement du compte :", user.uid);


    // --------------------------------------------------------
    // DONNÉES FIREBASE AUTHENTICATION
    // --------------------------------------------------------

    if (emailInput) {
        emailInput.value = user.email || "";
    }

    if (accountId) {
        accountId.textContent = user.uid;
    }

    if (emailStatus) {

        if (user.emailVerified) {

            emailStatus.textContent = "Vérifiée";
            emailStatus.classList.add("verified");

        } else {

            emailStatus.textContent = "Non vérifiée";
            emailStatus.classList.remove("verified");

        }
    }


    // --------------------------------------------------------
    // DATE DE CRÉATION DU COMPTE
    // --------------------------------------------------------

    if (accountCreated && user.metadata?.creationTime) {

        const creationDate = new Date(user.metadata.creationTime);

        accountCreated.textContent = formatDate(creationDate);
    }


    // --------------------------------------------------------
    // FIRESTORE
    // users/{uid}
    // --------------------------------------------------------

    const userRef = doc(db, "users", user.uid);

    const userSnapshot = await getDoc(userRef);


    if (!userSnapshot.exists()) {

        console.warn(
            "Aucun document Firestore trouvé pour",
            user.uid
        );

        return;
    }


    const data = userSnapshot.data();

    console.log("Données Firestore :", data);


    // --------------------------------------------------------
    // HANDLE
    // --------------------------------------------------------

    if (handleInput) {

        handleInput.value =
            data.handle ||
            data.pseudo ||
            "";
    }


    // --------------------------------------------------------
    // BIO
    // --------------------------------------------------------

    if (bioInput) {

        bioInput.value =
            data.bio ||
            "";

        updateBioCounter();
    }


    // --------------------------------------------------------
    // PROFIL PUBLIC
    // --------------------------------------------------------

    if (publicProfileInput) {

        publicProfileInput.checked =
            data.publicProfile !== false;
    }


    // --------------------------------------------------------
    // AVATAR
    // --------------------------------------------------------

    if (avatarPreview) {

        if (data.avatar) {

            avatarPreview.src = data.avatar;

        } else if (user.photoURL) {

            avatarPreview.src = user.photoURL;

        } else {

            avatarPreview.src =
                "/assets/default-avatar.png";
        }
    }


    // --------------------------------------------------------
    // 2FA
    // --------------------------------------------------------

    if (twoFactorStatus) {

        if (data.twoFactorEnabled === true) {

            twoFactorStatus.textContent = "Activée";

        } else {

            twoFactorStatus.textContent = "Désactivée";
        }
    }
}


// ============================================================
// AUTHENTIFICATION
// ============================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        console.log("Aucun utilisateur connecté.");

        // L'utilisateur n'est pas connecté.
        // Retour vers la page de connexion.
        window.location.href = "/connexion/";

        return;
    }


    try {

        await loadAccount(user);

    } catch (error) {

        console.error(
            "Erreur lors du chargement du compte :",
            error
        );

        showMessage(
            "Impossible de charger les données du compte.",
            "error"
        );
    }
});


// ============================================================
// BIO — COMPTEUR
// ============================================================

if (bioInput) {

    bioInput.addEventListener(
        "input",
        updateBioCounter
    );
}


// ============================================================
// AVATAR — OUVRIR LE SÉLECTEUR
// ============================================================

if (avatarButton && avatarInput) {

    avatarButton.addEventListener(
        "click",
        () => {
            avatarInput.click();
        }
    );
}


// ============================================================
// AVATAR — APERÇU
// ============================================================

if (avatarInput) {

    avatarInput.addEventListener(
        "change",
        () => {

            const file = avatarInput.files?.[0];

            if (!file) {
                return;
            }


            // Vérification du format

            const allowedTypes = [
                "image/png",
                "image/jpeg",
                "image/webp"
            ];

            if (!allowedTypes.includes(file.type)) {

                showMessage(
                    "Format invalide. Utilise PNG, JPG ou WEBP.",
                    "error"
                );

                avatarInput.value = "";

                return;
            }


            // Vérification de la taille : 2 Mo

            const maxSize = 2 * 1024 * 1024;

            if (file.size > maxSize) {

                showMessage(
                    "L'image est trop volumineuse. Maximum : 2 Mo.",
                    "error"
                );

                avatarInput.value = "";

                return;
            }


            // Aperçu local

            const imageURL =
                URL.createObjectURL(file);

            avatarPreview.src = imageURL;
        }
    );
}


// ============================================================
// ENREGISTRER LE COMPTE
// ============================================================

if (saveAccountButton) {

    saveAccountButton.addEventListener(
        "click",
        async () => {

            const user = auth.currentUser;

            if (!user) {

                showMessage(
                    "Tu dois être connecté.",
                    "error"
                );

                return;
            }


            // ------------------------------------------------
            // RÉCUPÉRATION DES VALEURS
            // ------------------------------------------------

            const handle =
                handleInput.value.trim();

            const bio =
                bioInput.value.trim();

            const publicProfile =
                publicProfileInput.checked;


            // ------------------------------------------------
            // VALIDATION DU HANDLE
            // ------------------------------------------------

            if (!isValidHandle(handle)) {

                showMessage(
                    "Ton pseudo @handle doit contenir entre 3 et 32 caractères, commencer par une lettre et utiliser uniquement des lettres, chiffres ou underscores.",
                    "error"
                );

                handleInput.focus();

                return;
            }


            // ------------------------------------------------
            // VALIDATION DE LA BIO
            // ------------------------------------------------

            if (bio.length > 160) {

                showMessage(
                    "Ta bio ne peut pas dépasser 160 caractères.",
                    "error"
                );

                return;
            }


            // ------------------------------------------------
            // ÉTAT DU BOUTON
            // ------------------------------------------------

            const originalText =
                saveAccountButton.textContent;

            saveAccountButton.disabled = true;

            saveAccountButton.textContent =
                "Enregistrement...";


            try {

                // ------------------------------------------------
                // RÉFÉRENCE FIRESTORE
                // ------------------------------------------------

                const userRef =
                    doc(db, "users", user.uid);


                // ------------------------------------------------
                // SAUVEGARDE FIRESTORE
                // ------------------------------------------------

                await setDoc(
                    userRef,
                    {
                        handle: handle,
                        bio: bio,
                        publicProfile: publicProfile,
                        updatedAt: serverTimestamp()
                    },
                    {
                        merge: true
                    }
                );


                // ------------------------------------------------
                // MISE À JOUR DU PROFIL FIREBASE AUTH
                // ------------------------------------------------

                await updateProfile(
                    user,
                    {
                        displayName: handle
                    }
                );


                console.log(
                    "Compte Lumalia enregistré."
                );


                showMessage(
                    "Tes modifications ont été enregistrées !"
                );


            } catch (error) {

                console.error(
                    "Erreur lors de l'enregistrement :",
                    error
                );


                showMessage(
                    "Une erreur est survenue pendant l'enregistrement.",
                    "error"
                );


            } finally {

                saveAccountButton.disabled = false;

                saveAccountButton.textContent =
                    originalText;
            }
        }
    );
}


// ============================================================
// VÉRIFICATION EMAIL
// ============================================================

if (emailStatus) {

    emailStatus.addEventListener(
        "click",
        async () => {

            const user = auth.currentUser;

            if (!user) {
                return;
            }


            if (user.emailVerified) {
                return;
            }


            try {

                await sendEmailVerification(user);

                showMessage(
                    "Un nouvel email de vérification a été envoyé."
                );

            } catch (error) {

                console.error(
                    "Erreur vérification email :",
                    error
                );

                showMessage(
                    "Impossible d'envoyer l'email de vérification.",
                    "error"
                );
            }
        }
    );
}


// ============================================================
// NAVIGATION DES PARAMÈTRES
// ============================================================

const settingsItems =
    document.querySelectorAll(
        ".settings-item"
    );

const settingsContents =
    document.querySelectorAll(
        ".settings-content"
    );


settingsItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            const section =
                item.dataset.section;

            if (!section) {
                return;
            }


            // Retirer l'état actif

            settingsItems.forEach(
                element => {
                    element.classList.remove("active");
                }
            );


            // Ajouter l'état actif

            item.classList.add("active");


            // Masquer toutes les sections

            settingsContents.forEach(
                content => {
                    content.classList.remove("active");
                }
            );


            // Afficher la section demandée

            const target =
                document.getElementById(section);

            if (target) {

                target.classList.add("active");

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        }
    );
});


// ============================================================
// BOUTONS "VOIR LA LISTE"
// ============================================================

document
    .querySelectorAll("[data-section]")
    .forEach(element => {

        if (
            !element.classList.contains(
                "settings-item"
            )
        ) {

            element.addEventListener(
                "click",
                () => {

                    const section =
                        element.dataset.section;

                    const target =
                        document.getElementById(
                            section
                        );

                    if (!target) {
                        return;
                    }


                    settingsContents.forEach(
                        content => {
                            content.classList.remove(
                                "active"
                            );
                        }
                    );


                    target.classList.add(
                        "active"
                    );
                }
            );
        }
    });


// ============================================================
// 2FA
// ============================================================

const enable2FA =
    document.getElementById("enable2FA");


if (enable2FA) {

    enable2FA.addEventListener(
        "click",
        () => {

            /*
             * Le 2FA sera branché sur Firebase
             * Multi-Factor Authentication.
             *
             * On ne simule volontairement pas
             * l'activation ici.
             */

            console.log(
                "Configuration du 2FA demandée."
            );

            alert(
                "La configuration du 2FA sera lancée ici."
            );
        }
    );
}
