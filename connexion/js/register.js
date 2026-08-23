import{initializeApp}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";import{getAuth,createUserWithEmailAndPassword,updateProfile,sendEmailVerification}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";import{getFirestore,doc,setDoc,serverTimestamp}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/* REMPLACEZ UNIQUEMENT CES VALEURS PAR LA CONFIGURATION WEB DE VOTRE PROJET FIREBASE. */
const firebaseConfig = {
  apiKey: "AIzaSyBSCqSsBTXk9Q8sBX88NgrdDHUAHT0Cq6I",
  authDomain: "lumalia.firebaseapp.com",
  projectId: "lumalia",
  storageBucket: "lumalia.firebasestorage.app",
  messagingSenderId: "189011821397",
  appId: "1:189011821397:web:03c8609d35d488dce2a5dc",
  measurementId: "G-4G4KMZCWFH"
};

const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
const $=id=>document.getElementById(id),form=$("register-form"),message=$("message"),submit=$("submit");

function msg(text,ok=false){message.textContent=text;message.className="message show"+(ok?" ok":"")}
function err(id,text){$(id+"-error").textContent=text;if($(id))$(id).classList.toggle("invalid",!!text)}
function clean(v){return v.trim().replace(/^@/,"")}
function validName(v){return/^[A-Za-z0-9_-]{3,32}$/.test(v)}

$("password").addEventListener("input",()=>{let p=$("password").value,s=0;if(p.length>=12)s++;if(p.length>=16)s++;if(/[a-z]/.test(p))s++;if(/[A-Z]/.test(p))s++;if(/[0-9]/.test(p))s++;if(/[^A-Za-z0-9]/.test(p))s++;$("bar").style.width=(s/6*100)+"%";$("bar").style.background=s<3?"#ff758e":s<5?"#f2c45d":"#69e89b";$("strength-label").textContent=!p?"Entrez un mot de passe":s<3?"Faible":s<5?"Correct":"Fort"});
document.querySelectorAll(".password button").forEach(b=>b.onclick=()=>{let i=$(b.dataset.target);i.type=i.type==="password"?"text":"password";});
$("suggest").onclick=()=>{$("username").value="Lumalien"+Math.floor(1000+Math.random()*9000)};

function firebaseMessage(e){return({ "auth/email-already-in-use":"Cette adresse e-mail possède déjà un compte Lumalia.","auth/invalid-email":"L'adresse e-mail n'est pas valide.","auth/weak-password":"Le mot de passe est trop faible.","auth/network-request-failed":"Impossible de contacter Firebase. Vérifiez votre connexion.","auth/operation-not-allowed":"L'inscription par e-mail n'est pas activée dans Firebase Authentication."})[e.code]||"Impossible de créer le compte pour le moment. Réessayez."}

form.onsubmit=async e=>{e.preventDefault();message.className="message";["email","username","password","confirm","terms"].forEach(x=>err(x,""));let email=$("email").value.trim().toLowerCase(),username=clean($("username").value),password=$("password").value,confirm=$("confirm").value,valid=true;
if(!email){err("email","Veuillez entrer votre adresse e-mail.");valid=false}if(!validName(username)){err("username","3 à 32 caractères : lettres, chiffres, _ ou -.");valid=false}if(password.length<12){err("password","Au moins 12 caractères.");valid=false}if(password!==confirm){err("confirm","Les mots de passe ne correspondent pas.");valid=false}if(!$("terms").checked){err("terms","Vous devez accepter les conditions.");valid=false}if(!valid){msg("Vérifiez les informations indiquées avant de continuer.");return}
submit.disabled=true;$("submit-text").hidden=true;$("loader").hidden=false;
try{const c=await createUserWithEmailAndPassword(auth,email,password),u=c.user;await updateProfile(u,{displayName:username});
await setDoc(doc(db,"users",u.uid),{uid:u.uid,email,username,grade:"Joueur",role:"player",bio:"",avatar:"",createdAt:serverTimestamp(),updatedAt:serverTimestamp(),emailVerified:false,twoFactorEnabled:false});
try{await sendEmailVerification(u)}catch(x){console.warn(x)}msg("Compte créé avec succès ! Vérifiez votre adresse e-mail.",true);setTimeout(()=>location.href="../compte/",1800)
}catch(e){console.error(e);msg(firebaseMessage(e));submit.disabled=false;$("submit-text").hidden=false;$("loader").hidden=true}};
