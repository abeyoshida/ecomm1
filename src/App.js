import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import "./App.css";

import CheckoutPage from "./pages/checkout/checkout.component";
import Header from "./components/header/header.component";
import HomePage from "./pages/homepage/homepage.component";
import ShopPage from "./pages/shop/shop.component";
import SignInSignUpPage from "./pages/sign-in-sign-up/sign-in-sign-up.component";

import { auth, createUserProfileDocument } from "./firebase/firebase.utils"; // addCollectionsAndDocuments
import { setCurrentUser } from "./redux/user/user.actions";
import { selectCurrentUser } from "./redux/user/user.selectors";
// import { selectCollectionsforPreview } from './redux/shot/shop.selectors';

class App extends React.Component {
  unsubscribeFromAuth = null;

  componentDidMount() {
    /**
     * Destructure "setCurrentUser" action creator that was passed into props via
     * connect's mapDispatchToProps below.
     */
    const { setCurrentUser } = this.props;
    /**
     * auth.onAuthStateChanged allows us to listen for changes in the Authentication table in Firebase.
     * It passes us "userAuth" which is a reference to a user in that table.
     * Firebase will pass a function back that can be called to unsubscribe to the open auth connection.
     * We userAuth to do 2 things:
     * 1) create a user document in the Firestore database by passing it into the createUserProfileDocument().
     * 2) update the Redux user property by calling the "setCurrentUser" action to set the
     *    "currentUser" data in Redux.
     */
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot((snapShot) => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data(),
          });
        });
      }
      setCurrentUser(userAuth);
      // addCollectionAndDocuments(
      //   "collections",
      //   /** Create a collection with an array of objects of tile and items. */
      //   collectionArray.map(({ title, items }) => ({ title, items }))
      // );
    });
  }

  /**
   * Close the Firebase auth() connection when the app unmounts.
   */
  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/shop" component={ShopPage} />
          <Route exact path="/checkout" component={CheckoutPage} />
          <Route
            exact
            path="/signin"
            render={() =>
              this.props.currentUser ? (
                <Redirect to="/" />
              ) : (
                <SignInSignUpPage />
              )
            }
          />
        </Switch>
      </div>
    );
  }
}

// const mapStateToProps = ({ user }) => ({
//   currentUser: user.currentUser,
// });

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  // collectionsArray: selectCollectionsForPreview
});

/**
 * In order to update the "currentUser" property that exists in the Redux "state.user"
 * that was created by the "userReducer" we add a mapDispatchToProps function to connect
 * as the 2nd argument in the first call.  This receives "dispatch" from Redux as an
 * argument and we use it to tell Redux what action creator to use to set the currentUser.
 * Dispatch tells Redux to take the setCurrentUser action and pass it to every reducer.
 * Since we are invoking setCurrentUser with a user payload it returns an object and this
 * objects is dispatched to all the reducers.  The object key "setCurrentUser" is passed
 * into App as a prop.
 * @param {*} dispatch
 */
const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
