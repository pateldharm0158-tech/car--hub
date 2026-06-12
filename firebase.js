import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

apiKey: "PASTE_YOUR_API_KEY",

authDomain: "PASTE_YOUR_AUTH_DOMAIN",

projectId: "magneto-carsz",

storageBucket: "PASTE_YOUR_STORAGE_BUCKET",

messagingSenderId: "PASTE_YOUR_SENDER_ID",

appId: "PASTE_YOUR_APP_ID"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut
};
