/** Firebase App is the core Firebase SDK and is always required and must be listed first */
import firebase from "firebase/app";
/**
 * Add the Firebase products that you want to use.
 * firestore -- Firestore database
 * auth -- Authentication database that stores authenticated users.
 */
import "firebase/firestore";
import "firebase/auth";

/** Firebase "ecomm1" Project configuration */
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

/**
 * The auth library gives us access to the Authentication table in Firebase
 * where all authenticated users are stored. When a user signs in with
 * an email/password or through our Google sign-in they get added to the
 * Authentication table and assigned a User UID.
 */
export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

/**
 * Use this function to for authenticated users in Firebase Authentication table
 * and store them in the Firestore database in the "users" collection.
 * @param {*} userAuth
 * @param {*} additionalData
 * @returns userRef -- object that is associated with the user's Firebase created UID.
 */
export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  /**
   * Get a queryReference to a specific user.
   */
  const userRef = firestore.doc(`users/${userAuth.uid}`);

  /**
   * Get querySnapshot reference to user data. Firestore will always return a snapshot object even
   * when the user is logging in for the first time and doesn't exist yet in the users table.
   * This allows us to use the exists() method to create a new user.
   */
  const snapshot = await userRef.get();

  /**
   * The .exists() method allows us to check if a document exists.  It returns a boolean.
   * If the document (user) doesn't exist we create a new user document by calling userRef.set()
   * and passing in the necessary data.
   */
  if (!snapshot.exists) {
    /**
     * Create the user for the first time in Firestore
     */
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

/**
 * Function to add data to the Firestore database using the firestore.batch() write method.
 * We used this to populate the shop data into Firestore from App.js.
 * @param {*} collectionKey - name of collection in Firestore
 * @param {*} objectsToAdd - data object to populate collection
 */
export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = firestore.collection(collectionKey);

  /**
   * Use the batch() method from firestore to add records to collection.
   * Firestore allows you to make only 1 .set() call at a time so we need
   * to use the batch() method to add multiple records into one big request
   * and then commit them all at once.  If any one of them fail the whole batch fails.
   */
  const batch = firestore.batch();
  objectsToAdd.forEach((obj) => {
    /**
     * This tells firestore to create a new document reference with a new ID in this collection
     * created using the collectionKey.
     */
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });

  /**
   * batch.commit() fires off the whole batch of doc refs and returns a promise.
   * When it succeeds with the entire batch it returns a void value.
   * Since it returns a promise we can chain .then() and .catch().
   */
  await batch.commit();
};

/**
 * Transform an array into an object.
 * Transform each collections array element into an object that has a
 * key using the title property and a value that is set to the whole collection.
 */
export const convertCollectionsSnapshotToMap = (collections) => {
  const transformedCollection = collections.docs.map((doc) => {
    const { id, title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id,
      title,
      items,
    };
  });

  /**
   * Use reduce() to create an accumulator that is an object with a list of keys with the name
   * of "title" and a value of "collection".
   */
  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
};

export default firebase;
