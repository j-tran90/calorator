import { useState, useEffect } from "react";
import { getDocs } from "firebase/firestore";

export default function useCollectionData(dbPath) {
  const [data, setData] = useState([] || null);

  const getData = async () => {
    const querySnapshot = await getDocs(dbPath);
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setData(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return { data, getData };
}
