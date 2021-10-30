import React from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";

import CollectionsOverview from "../../components/collections-overview/collections-overview.component";
import CollectionPage from "../collection/collection.component";
import {
  firestore,
  convertCollectionsSnapshotToMap,
} from "../../firebase/firebase.utils";

import { updateCollections } from "../../redux/shop/shop.actions";
import WithSpinner from "../../components/with-spinner/with-spinner.component";

const CollectionsOverviewWithSpinner = WithSpinner(CollectionsOverview);
const CollectionPageWithSpinner = WithSpinner(CollectionPage);

class ShopPage extends React.Component {
  state = {
    loading: true,
  };

  unsubscribeFromSnapshop = null;

  componentDidMount() {
    // const { updateCollections } = this.props;
    /**
     * Create a reference to a collection that you want to query in the Firestore database.
     * In this case there is a collection called "collections" that holds the data for the shop.
     * Each collection holds 2 collections: items and title.
     */
    const collectionRef = firestore.collection("collections");

    // fetch(
    //   "https://firestore.googleapis.com/v1/projects/ecomm1-db/databases/(default)/documents/collections"
    // )
    //   .then((response) => response.json())
    //   .then((collections) => console.log(collections));

    /**
     * Promise based asynchronous call using .get() of the collectionRef from Firebase
     * to get a data snapshot that we can then manipulate.
     */
    collectionRef.get().then((snapshot) => {
      const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
      updateCollections(collectionsMap);
      this.setState({ loading: false });
    });

    /**
     * This sets up a live update event stream using the Observable/Observer
     * pattern from Firebase's onSnapshot() method of the collectionRef
     * to get a data snapshot from the Firebase collection.
     */
    // this.unsubscribeFromSnapshop = collectionRef.onSnapshot((snapshot) => {
    //   const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
    //   updateCollections(collectionsMap);
    //   this.setState({ loading: false });
    // });
  }

  render() {
    const { match } = this.props;
    const { loading } = this.state;
    return (
      <div className="shop-page">
        <Route
          exact
          path={`${match.path}`}
          render={(props) => (
            <CollectionsOverviewWithSpinner isLoading={loading} {...props} />
          )}
        />
        <Route
          path={`${match.path}/:collectionId`}
          render={(props) => (
            <CollectionPageWithSpinner isLoading={loading} {...props} />
          )}
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateCollections: (collectionsMap) =>
    dispatch(updateCollections(collectionsMap)),
});

export default connect(null, mapDispatchToProps)(ShopPage);
