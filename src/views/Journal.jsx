import { db, auth } from "../config/Firebase";
import { collection, orderBy, query } from "firebase/firestore";
import useCollectionData from "../hooks/useFetch";
import Navigation from "../components/Navigation";
import Add from "../components/Add";

export default function Entry() {
  const { uid } = auth.currentUser;
  const entryCollectionRef = collection(db, "journal/" + uid + "/entries");
  const q = query(entryCollectionRef, orderBy("createdAt", "asc"));
  const { data: entries, getData: getEntry } = useCollectionData(q);

  //TODO: QUERY FOR CURRENT DAY

  console.log("entries:", entries);

  return (
    <>
      <h1>Journal</h1>
      <Navigation />
      <div style={{ marginBottom: "50px" }}>
        <Add getEntry={getEntry} />
      </div>
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
