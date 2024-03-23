import Navigation from "../components/Navigation";
import Add from "../components/Add";
import useTracker from "../hooks/useTracker";
import { auth, db } from "../config/Firebase";
import { useState } from "react";
import { FcCancel } from "react-icons/fc";

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

  //TODO: FIX ADD BUTTON TO RE-RENDER

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

  console.log(date);

  return (
    <>
      <h1>Journal</h1>

      <Navigation />

      {/* <div style={{ marginBottom: "50px" }}>
        <Add sumEntry={sumEntry} getEntries={getEntries} />
      </div> */}
      <h2 className="card">Total: {total}</h2>
      <h3> {currentDate}</h3>
      {entries.map((entry) => {
        return (
          <div key={entry.id}>
            {JSON.stringify(
              entry.createdAt.toDate().toLocaleTimeString(navigator.language, {
                // weekday: "short",
                // month: "short",
                // day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            ).replace(/['"]+/g, "")}
            : {entry.calories}
            <FcCancel
              style={{
                marginLeft: "20px",
                marginBottom: "-3px",
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
