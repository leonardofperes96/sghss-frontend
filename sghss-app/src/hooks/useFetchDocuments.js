import { useEffect, useReducer, useState } from "react";
import {
  GETDOCUMENTS_BEGIN,
  GETDOCUMENTS_ERROR,
  GETDOCUMENTS_SUCCESS,
} from "../actions";
import { collection, db, onSnapshot } from "../utils/firebase/firebase";
import reducer from "../reducers/getDocuments_reducer"

const initialState = {
  loading: false,
  error: null,
  data: null,
};

export const useFetchDocuments = (docCollection) => {
  const [cancelled, setCancelled] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  // deal with memory leak
  const checkCancelledBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };
  useEffect(() => {
    const getPhotos = async () => {
      checkCancelledBeforeDispatch({ type: GETDOCUMENTS_BEGIN });

      try {
        const collectionRef = collection(db, docCollection);

        let photos;

        const snapshot = await onSnapshot(collectionRef, (snapshot) => {
          photos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          checkCancelledBeforeDispatch({
            type: GETDOCUMENTS_SUCCESS,
            payload: photos,
          });
        });
      } catch (err) {
        checkCancelledBeforeDispatch({
          type: GETDOCUMENTS_ERROR,
          payload: err.message,
        });
      }
    };
    getPhotos();
  }, [docCollection, cancelled]);

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { ...state };
};
