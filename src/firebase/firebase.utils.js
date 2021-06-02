/** Firebase App is the core Firebase SDK and is always required and must be listed first */
import firebase from "firebase/app";
/** Add the Firebase products that you want to use */
import "firebase/firestore";
import "firebase/auth";

/** Firebase "ecomm1" project configuration */
const config = {
  apiKey: "AIzaSyA7-e1Y9zOyE60NpoRh8J6m9IU9xp4DIkk",
  authDomain: "ecomm1-db.firebaseapp.com",
  projectId: "ecomm1-db",
  storageBucket: "ecomm1-db.appspot.com",
  messagingSenderId: "949807784065",
  appId: "1:949807784065:web:4f62094c8c3c8fd0006d80",
  measurementId: "G-ZE0J2Q9S09",
};

/** Initialize Firebase */
firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

/**
 * Use this function to store authenticated users from Firebase Authentication
 * in the Firestore database in the "users" collection.
 * @param {*} userAuth
 * @param {*} additionalData
 * @returns userRef -- object that is associated with the user's Firebase created UID.
 */
export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.error("error creating user", error);
    }
  }
  return userRef;
};

export default firebase;
