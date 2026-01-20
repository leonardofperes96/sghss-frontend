import { useEffect, useState } from "react";
import { db, doc, getDoc } from "../utils/firebase/firebase";

export const useFetchDocument = (docColection, id) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDocument = async () => {
      setLoading(true);
      try {
        const docRef = await doc(db, docColection, id);
        const docSnap = await getDoc(docRef);

        const data = docSnap.data();

        setDocument(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    getDocument();
  }, [docColection, id]);

  return { document, loading, error };
};
