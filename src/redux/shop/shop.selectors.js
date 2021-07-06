import { createSelector } from "reselect";
import memoize from "lodash.memoize";

const selectShop = (state) => state.shop;

export const selectCollections = createSelector(
  [selectShop],
  (shop) => shop.collections
);

export const selectCollectionsForPreview = createSelector(
  [selectCollections],
  (collections) => Object.keys(collections).map((key) => collections[key])
);
/**
 * "selectCollection" is a selector function that returns a function written as an
 * arrow function that returns the "createSeletor" function from the reselect library.
 * "createSelector" takes the colletions array and finds the specific collection that is
 * in the url and returns it.
 * By wrapping this function with memoize, if it gets called a 2nd time with the same
 * "collectionUrlParam" it won't rerun the function.  It will just return the memoized selector.
 * See the usage in the collection.component.js in the mapStateToProps function.
 */
// export const selectCollection = memoize((collectionUrlParam) =>
//   createSelector([selectCollections], (collections) =>
//     collections.find(
//       (collection) => collection.id === COLLECTION_ID_MAP[collectionUrlParam]
//     )
//   )
// );

/**
 * After normalizing data in shop.data.js, changing the array to an object with keys that correspond
 * to the title which serves as the url param in the route to each collection in the shop.
 */
export const selectCollection = memoize((collectionUrlParam) =>
  createSelector(
    [selectCollections],
    (collections) => collections[collectionUrlParam]
  )
);
