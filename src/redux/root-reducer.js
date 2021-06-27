import { combineReducers } from "redux";

import userReducer from "./user/user.reducer";
import cartReducer from "./cart/cart.reducer";

/**
 * The rootReducer is the entire Redux store.  Each key defined by smaller reducers is
 * added to the "store" and is accessible as the "state" argument to "mapStateToProps" when
 * using "connect()()" from the "react-redux" library.
 * Since this is available to any component anywhere in the app there is no need for prop drilling.
 */
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
});

export default rootReducer;
