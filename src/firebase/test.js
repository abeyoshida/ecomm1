import firebase from "firebase/app";
import "firebase/firestore";

const firestore = firebase.firestore();

/**
 * Query the firestore database using the following syntax.
 */
firestore
  .collection("users")
  .doc("TEaVNhWg82lMydrXHL0C")
  .collection("cartItems")
  .doc("r9VnRFzpy7Mn6IUuQ4Ty");
firestore.doc("/users/TEaVNhWg82lMydrXHL0C/cartItems/r9VnRFzpy7Mn6IUuQ4Ty");
firestore.collection("/users/TEaVNhWg82lMydrXHL0C/cartItems");
