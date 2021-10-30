import React from "react";

import { SpinnerContainer, SpinnerOverlay } from "./with-spinner.styles";

/**
 * Higher order function that takes an argument and returns a function that takes
 * another argument.
 *
 * @param {*} WrappedComponent
 * @returns
 */
const WithSpinner = (WrappedComponent) => {
  const Spinner = ({ isLoading, ...otherProps }) => {
    return isLoading ? (
      <SpinnerOverlay>
        <SpinnerContainer />
      </SpinnerOverlay>
    ) : (
      <WrappedComponent {...otherProps} />
    );
  };
  return Spinner;
};

export default WithSpinner;
