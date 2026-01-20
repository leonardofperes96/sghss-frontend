import { useState } from "react";
import { deleteDoc, doc, db } from "../utils/firebase/firebase";

export const useDeleteDocument = (docCollection) => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const deleteDocument = async (id, ) => {
    setLoading(true);

    try {
      const docRef = await doc(db, docCollection, id);

      const updatedDoc = await deleteDoc(docRef);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return { loading, error, deleteDocument };
};
