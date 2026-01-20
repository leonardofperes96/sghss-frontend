import {
  LOGIN_BEGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  USERCREDENTIALS_BEGIN,
  USERCREDENTIALS_SUCCESS,
  USERCREDENTIALS_ERROR,
} from "../actions";

const user_reducer = (state, action) => {

  if (action.type === USERCREDENTIALS_BEGIN) {
    return { ...state, loading: true, error: null };
  }

  if (action.type === USERCREDENTIALS_SUCCESS) {
    return { ...state, loading: false, error: null, data: action.payload };
  }

  if (action.type === USERCREDENTIALS_ERROR) {
    return { ...state, loading: false, error: action.payload };
  }

  if (action.type === LOGIN_BEGIN) {
    return { ...state, loading: true, error: null };
  }

  if (action.type === LOGIN_ERROR) {
    state.error = null;
    return { ...state, error: action.payload, loading: false };
  }

  if (action.type === LOGIN_SUCCESS) {
    return { ...state, loading: false, error: null };
  }

  return state;
};

export default user_reducer;
