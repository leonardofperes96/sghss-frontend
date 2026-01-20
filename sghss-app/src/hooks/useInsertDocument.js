import {
  POSTDOCUMENT_BEGIN,
  POSTDOCUMENT_SUCCESS,
  POSTDOCUMENT_ERROR,
} from "../actions";

import { useEffect, useReducer, useState } from "react";
import reducer from '../reducers/getDocuments_reducer'
import { collection, addDoc, db } from "../utils/firebase/firebase";

const initialState = {
  loading: false,
  error: null,
};

export const useInsertDocument = (docCollection) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [cancelled, setCancelled] = useState(false);


  const checkCancelledBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const insertDocument = async (document) => {
    checkCancelledBeforeDispatch({ type: POSTDOCUMENT_BEGIN });

    try {
       await addDoc(
        collection(db, docCollection),
        document
      );

      checkCancelledBeforeDispatch({
        type: POSTDOCUMENT_SUCCESS,
      });
    } catch (error) {
      checkCancelledBeforeDispatch({
        type: POSTDOCUMENT_ERROR,
        payload: error.message,
      });
    }
  };
  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { ...state, insertDocument };
};
