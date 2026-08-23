import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ============================================================
// FIREBASE
// ============================================================

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


// ============================================================
// HELPERS
// ============================================================

function $(id) {
    return document.getElementById(id);
}


function showProfileError(message) {

    const element = $("profile-message");

    element.textContent = message;

    element.className = "profile-message show";
}


function showAdminMessage(message, type = "error") {

    const element = $("admin-message");

    element.textContent = message;

    element.className =
        `admin-message show ${type}`;
}


function formatDate(timestamp) {

    if (
        !timestamp ||
        typeof timestamp.toDate !== "function"
    ) {
        return "Date indisponible";
    }

    return new Intl.DateTimeFormat(
        "fr-FR",
        {
            dateStyle: "long",
            timeStyle: "short"
        }
    ).format(
        timestamp.toDate()
    );
}


// ============================================================
// AFFICHAGE DU PROFIL
// ============================================================

function displayProfile(user, profileData) {

    $("profile-uid").textContent =
        user.uid;


    $("profile-username").textContent =
        profileData.username ||
        user.displayName ||
        "—";


    $("profile-email").textContent =
        profileData.email ||
        user.email ||
        "—";


    const grade =
        profileData.grade ||
        "Joueur";


    $("profile-grade").textContent =
        grade;


    $("profile-created").textContent =
        formatDate(
            profileData.createdAt
        );


    $("profile-loading").hidden =
        true;


    $("profile-card").hidden =
        false;


    /*
     * Le panneau Administration est affiché
     * uniquement pour le grade Administrateur.
     */
    if (
        grade.toLowerCase() ===
        "administrateur"
    ) {

        $("admin-panel").hidden =
            false;
    }
}


// ============================================================
// CHARGEMENT DU PROFIL
// ============================================================

async function loadProfile(user) {

    const profileReference =
        doc(
            db,
            "users",
            user.uid
        );


    const profileSnapshot =
        await getDoc(
            profileReference
        );


    if (!profileSnapshot.exists()) {

        throw new Error(
            "PROFILE_NOT_FOUND"
        );
    }


    const profileData =
        profileSnapshot.data();


    displayProfile(
        user,
        profileData
    );
}


// ============================================================
// AUTHENTIFICATION
// ============================================================

onAuthStateChanged(
    auth,
    async (user) => {

        /*
         * Personne n'est connecté :
         * retour vers la page de connexion.
         */
        if (!user) {

            window.location.href =
                "../connexion/";

            return;
        }


        try {

            await loadProfile(
                user
            );

        } catch (error) {

            console.error(
                "Erreur de chargement du profil :",
                error
            );


            $("profile-loading").hidden =
                true;


            showProfileError(
                "Impossible de charger votre profil."
            );
        }
    }
);


// ============================================================
// ATTRIBUTION D'UN GRADE
// ============================================================

$("assign-grade").addEventListener(
    "click",
    async () => {

        const usernameInput =
            $("target-username");


        const gradeInput =
            $("target-grade");


        const button =
            $("assign-grade");


        /*
         * Nettoyage du pseudo.
         */
        const username =
            usernameInput.value
                .trim()
                .replace(/^@/, "");


        const grade =
            gradeInput.value;


        if (!username) {

            showAdminMessage(
                "Entrez le pseudo Lumalia du joueur.",
                "error"
            );

            return;
        }


        button.disabled = true;


        showAdminMessage(
            "Recherche du joueur…",
            "success"
        );


        try {

            /*
             * Recherche du joueur via son pseudo.
             *
             * On utilise le champ username
             * enregistré dans users/{UID}.
             */
            const playerQuery =
                query(
                    collection(db, "users"),
                    where(
                        "username",
                        "==",
                        username
                    )
                );


            const result =
                await getDocs(
                    playerQuery
                );


            /*
             * Aucun résultat.
             */
            if (result.empty) {

                showAdminMessage(
                    `Aucun joueur trouvé avec le pseudo « ${username} ».`,
                    "error"
                );

                return;
            }


            /*
             * Sécurité supplémentaire :
             * un pseudo doit être unique.
             */
            if (result.size > 1) {

                showAdminMessage(
                    "Plusieurs comptes utilisent ce pseudo. Le pseudo Lumalia doit être unique.",
                    "error"
                );

                return;
            }


            const playerDocument =
                result.docs[0];


            /*
             * Modification du grade.
             *
             * On ne modifie QUE le champ grade.
             */
            await updateDoc(
                doc(
                    db,
                    "users",
                    playerDocument.id
                ),
                {
                    grade: grade
                }
            );


            showAdminMessage(
                `Le grade « ${grade} » a été attribué à ${username}.`,
                "success"
            );


        } catch (error) {

            console.error(
                "Erreur d'attribution du grade :",
                error
            );


            if (
                error.code ===
                "permission-denied"
            ) {

                showAdminMessage(
                    "Action refusée par Firebase. Vérifiez les règles Firestore.",
                    "error"
                );

            } else {

                showAdminMessage(
                    "Impossible de modifier le grade pour le moment.",
                    "error"
                );
            }


        } finally {

            button.disabled =
                false;
        }
    }
);
