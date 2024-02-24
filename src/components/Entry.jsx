import { db, auth } from "../config/Firebase";
import {
  collection,
  getAggregateFromServer,
  orderBy,
  query,
  sum,
  where,
} from "firebase/firestore";
import useCollectionData from "../hooks/useFetch";
import Navigation from "../components/Navigation";
import { useEffect, useState } from "react";

export default function Entry() {
  const { uid } = auth.currentUser;
  const startOfToday = new Date();
  const endOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  endOfToday.setDate(startOfToday.getDate() + 1);
  const entryCollectionRef = query(
    collection(db, "journal/" + uid + "/entries"),
    orderBy("createdAt", "asc"),
    where("createdAt", ">=", startOfToday),
    where("createdAt", "<", endOfToday)
  );
  const { data: entries } = useCollectionData(entryCollectionRef);
  const [total, setNewTotal] = useState();

  const sumEntry = async () => {
    const snapshot = await getAggregateFromServer(entryCollectionRef, {
      totalCalories: sum("calories"),
    });
    const total = snapshot.data().totalCalories;
    setNewTotal(total);
    return;
  };

  useEffect(() => {
    sumEntry();
  }, []);

  return (
    <>
      <Navigation />
      <h2> Total: {total}</h2>
      {entries.map((entry) => {
        return (
          <div key={entry.id}>
            {JSON.stringify(
              entry.createdAt.toDate().toLocaleTimeString(navigator.language, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            ).replace(/['"]+/g, "")}
            : {entry.calories}
          </div>
        );
      })}
    </>
  );
}
