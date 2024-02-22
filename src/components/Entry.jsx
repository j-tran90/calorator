import { db, auth } from "../config/Firebase";
import { collection, orderBy, query, where } from "firebase/firestore";
import useCollectionData from "../hooks/useFetch";
import Navigation from "../components/Navigation";

export default function Entry() {
  const { uid } = auth.currentUser;
  const startOfToday = new Date();
  const endOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  endOfToday.setDate(startOfToday.getDate() + 1);
  const entryCollectionRef = collection(db, "journal/" + uid + "/entries");
  const q = query(
    entryCollectionRef,
    orderBy("createdAt", "asc"),
    where("createdAt", ">=", startOfToday),
    where("createdAt", "<", endOfToday)
  );
  const { data: entries } = useCollectionData(q);

  return (
    <>
      <Navigation />
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
