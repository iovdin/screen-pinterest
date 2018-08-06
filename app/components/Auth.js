import React from 'react';

export default ({authError, dispatch}) => {
  const onAuthClick = () => {
    PDK.login({ scope: "read_public" }, (res) => {
      if (res.error) {
        dispatch({ type: "USER_AUTH_FAILED", error: res.error });
      } else {
        dispatch({ type: "USER_AUTH_SUCCEEDED" });
      }
    })
  }
  return (<div className="center-center">
    { authError && <p className="error"> {authError} </p> }
    <button onClick={onAuthClick}> Authorize with Pinterest </button>
  </div>)
}
