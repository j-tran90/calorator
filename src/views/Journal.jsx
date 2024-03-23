import Navigation from "../components/Navigation";
import User from "../components/User";
import useTracker from "../hooks/useTracker";
import { auth, db } from "../config/Firebase";
import { useState } from "react";
import { RiDeleteBack2Fill } from "react-icons/ri";

export default function Entry() {
  const { entries, total, sumEntry, getEntries, handleDelete } = useTracker(0);
  const { uid } = auth.currentUser;
  const [editEntry, setEditEntry] = useState(0);
  const date = new Date();
  const [currentDate, setCurrentDate] = useState(getDate());

  function getDate() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const today = new Date();
    const month = months[today.getMonth()];
    const year = today.getFullYear();
    const date = today.getDate();
    return `${month} ${date}, ${year}`;
  }

  console.log("entries:", entries);

  const handleEdit = async (id) => {
    await db
      .collection("journal")
      .doc(uid)
      .collection("entries")
      .doc(id)
      .update({
        calories: parseFloat(editEntry),
      });
  };

  return (
    <>
      <User />
      <Navigation />
      <h1>{currentDate}</h1>
      <h2 className="card">Total Calories: {total}</h2>

      {entries.map((entry, count) => {
        return (
          <div key={entry.id}>
            <strong>{count + 1}. </strong>
            {JSON.stringify(
              entry.createdAt.toDate().toLocaleTimeString(navigator.language, {
                // weekday: "short",
                // month: "short",
                // day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            )
              .replace(/['"]+/g, "", "^0+", "")
              .replace(/^(?:0+(?=[1-9])|0+(?=0$))/gm, "")}
            : {entry.calories}
            <RiDeleteBack2Fill
              style={{
                marginLeft: "20px",
                marginBottom: "-3px",
                color: "red",
              }}
              onClick={() => {
                handleDelete(entry.id);
              }}
            />
          </div>
        );
      })}
    </>
  );
}
