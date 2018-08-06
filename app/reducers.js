import { combineReducers } from 'redux';

const auth = (state = { isAuthenticated: !!PDK.getSession() }, action) => {
  switch (action.type) {
    case "USER_AUTH_SUCCEEDED":
      return { isAuthenticated: true };
    case "USER_AUTH_FAILED":
      return { isAuthenticated: false, error: action.error };
    default:
      return state;
  }
}

const slides = (state = {pins: []}, action) => {
  switch (action.type) {
    case "FEED_LOAD_SUCCEED":
      const newPins = action.pins.filter(pin => (pin && pin.note && pin.image && Object.keys(pin.image).length > 0))
      return { pins: state.pins.concat(newPins) };
    case "FEED_LOAD_FAILED":
      return { ...state, err: action.err }
    default:
      return state;
  }
}

export default combineReducers({auth, slides});
