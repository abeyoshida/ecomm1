import { createSelector } from "reselect";

/**
 * Input selector type that gets the entire state and selects and return a part of it
 * usually one level deep.
 * In this case it returns the cart object in state.
 */
const selectCart = (state) => state.cart;

/**
 * Output selector type that uses "createSelector" from the "reselect" package.
 * It gets 2 arguments: 1) an array of input selectors, 2) a function that receives
 * the output of input selector and returns a value out of the selected input.
 * Here "selectCart" returns "cart" from "state" and "selectCartItems" returns "cartItems" from "cart."
 * Since we use "createSelector" to create the selector this is now a memoized selector.
 */
export const selectCartItems = createSelector(
  [selectCart],
  (cart) => cart.cartItems
);

export const selectCartHidden = createSelector(
  [selectCart],
  (cart) => cart.hidden
);

/**
 * createSelector can use another output selector as input as the first argument.
 * Here is gets items that are in the cart and calculates a total.
 */
export const selectCartItemsCount = createSelector(
  [selectCartItems],
  (cartItems) =>
    cartItems.reduce(
      (accumulatedQuantity, cartItem) =>
        accumulatedQuantity + cartItem.quantity,
      0
    )
);

export const selectCartTotal = createSelector([selectCartItems], (cartItems) =>
  cartItems.reduce(
    (accumulatedQuantity, cartItem) =>
      accumulatedQuantity + cartItem.quantity * cartItem.price,
    0
  )
);
