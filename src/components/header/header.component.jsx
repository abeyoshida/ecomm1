import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { auth } from "../../firebase/firebase.utils";
import CartIcon from "../cart-icon/cart-icon.component";
import CartDropdown from "../cart-dropdown/cart-dropdown.component";
import { selectCartHidden } from "../../redux/cart/cart.selectors";
import { selectCurrentUser } from "../../redux/user/user.selectors";
/**
 * ReactComponent is special syntax when importing SVG that tells
 * Create React app to render an SVG image file.
 */
import { ReactComponent as Logo } from "../../assets/crown.svg";

import {
  HeaderContainer,
  LogoContainer,
  OptionsContainer,
  OptionLink,
} from "./header.styles.jsx";

const Header = ({ currentUser, hidden }) => {
  return (
    <HeaderContainer>
      <LogoContainer to="/">
        <Logo className="logo" />
      </LogoContainer>
      <OptionsContainer>
        <OptionLink to="/shop">SHOP</OptionLink>
        <OptionLink to="/shop">CONTACT</OptionLink>
        {currentUser ? (
          /* The "as" prop allows you to pass in the html element that the styled component
             should use as the container for the styles.  */
          <OptionLink as="div" onClick={() => auth.signOut()}>
            SIGN OUT
          </OptionLink>
        ) : (
          <OptionLink to="/signin">SIGN IN</OptionLink>
        )}
        <CartIcon />
      </OptionsContainer>
      {hidden ? null : <CartDropdown />}
    </HeaderContainer>
  );
};

// const mapStateToProps = ({ user: { currentUser }, cart: { hidden } }) => ({
//   currentUser,
//   hidden,
// });

/**
 * Refactor using selectors to grab slices of state.
 */
// const mapStateToProps = (state) => ({
//   currentUser: selectCurrentUser(state),
//   hidden: selectCartHidden(state)
// });

/**
 * Refactored using a "reselect" function called "createStructuredSelector."
 * Instead of passing a function with a "state" argument to "mapStateToProps"
 * "createStructuredSelector" takes an object with keys and values from
 * assigned selectors and automatically passes state into each selector.
 */
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  hidden: selectCartHidden,
});

export default connect(mapStateToProps)(Header);
