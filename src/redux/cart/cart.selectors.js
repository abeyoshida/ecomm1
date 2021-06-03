import { createSelector } from "reselect";

/**
 * Input selector type that gets the entire state and selects and return a part of it.
 * In this case it returns the cart state.
 */
const selectCart = (state) => state.cart;

/**
 * Output selector type that uses createSelector from the reselect package.
 * It gets 2 arguments: 1) an array of input selectors, 2) a function that will
 * return the value we want out of the selectors.
 * Since we use createSelector to create the selector this is now a memoized selector.
 */
export const selectCartItems = createSelector(
  [selectCart],
  (cart) => cart.cartItems
);

export const selectCartItemsCount = createSelector(
  [selectCartItems],
  (cartItems) =>
    cartItems.reduce(
      (accumulatedQuantity, cartItem) =>
        accumulatedQuantity + cartItem.quantity,
      0
    )
);
