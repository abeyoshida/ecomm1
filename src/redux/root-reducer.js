import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./user/user.reducer";
import cartReducer from "./cart/cart.reducer";
import directoryReducer from "./directory/directory.reducer";
import shopReducer from "./shop/shop.reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"],
};

/**
 * The rootReducer is the entire Redux store.  Each key defined by smaller reducers is
 * added to the "store" and is accessible as the "state" argument to "mapStateToProps" when
 * using "connect()()" from the "react-redux" library.
 * Since this is available to any component anywhere in the app there is no need for prop drilling.
 */
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  directory: directoryReducer,
  shop: shopReducer,
});

export default persistReducer(persistConfig, rootReducer);
