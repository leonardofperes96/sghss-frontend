import {
  GETDOCUMENTS_BEGIN,
  GETDOCUMENTS_ERROR,
  GETDOCUMENTS_SUCCESS,
} from "../actions";

const getDocuments_reducer = (state, action) => {
  if (action.type === GETDOCUMENTS_BEGIN) {
    return { ...state, loading: true, error: null };
  }

  if (action.type === GETDOCUMENTS_SUCCESS) {
    return { ...state, loading: false, error: null, data: action.payload };
  }

  if (action.type === GETDOCUMENTS_ERROR) {
    return { ...state, loading: false, error: action.payload };
  }

  return state;
};

export default getDocuments_reducer;
