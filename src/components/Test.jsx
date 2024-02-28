import Navigation from "./Navigation";
import useTracker from "../hooks/useTracker";
import { useState } from "react";
import { auth, db, timestamp } from "../config/Firebase";

import { FaAppleAlt } from "react-icons/fa";
import { IoEggSharp } from "react-icons/io5";
import { GiBananaPeeled, GiButterToast, GiChickenOven } from "react-icons/gi";

export default function Test() {
  const { entries, total, updateTotal, sumEntry, getEntries } = useTracker(0);

  const { uid } = auth.currentUser;
  const [newEntry, setNewEntry] = useState(0);

  const handleAdd = async () => {
    await db
      .collection("journal")
      .doc(uid)
      .collection("entries")
      .doc()
      .set({
        calories: parseFloat(newEntry),
        createdAt: timestamp,
      })
      .then(() => {
        sumEntry();
      })
      .then(() => {
        getEntries();
      });
    console.log("added", typeof newEntry, newEntry);
  };

  return (
    <>
      <Navigation />
      <h2> Total: {total}</h2>
      <div>
        <button
          value="95"
          id="apple"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{ fontSize: "10px", marginRight: "10px" }}
        >
          <FaAppleAlt
            style={{ color: "maroon", fontSize: "30px", background: "none" }}
          />
          <div>Apple</div>
        </button>
        <button
          value="78"
          id="eggs"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{ fontSize: "10px", marginRight: "10px" }}
        >
          <IoEggSharp
            style={{
              color: "white",
              fontSize: "30px",
              background: "none",
            }}
          />
          <div>Eggs</div>
        </button>
        <button
          value="105"
          id="banana"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{ fontSize: "10px", marginRight: "10px" }}
        >
          <GiBananaPeeled
            style={{
              color: "yellow",
              fontSize: "30px",
              background: "none",
            }}
          />
          <div>Banana</div>
        </button>
        <button
          value="267"
          id="pbtoast"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{ fontSize: "10px", marginRight: "10px" }}
        >
          <GiButterToast
            style={{
              color: "brown",
              fontSize: "30px",
              background: "none",
            }}
          />
          <div>Peanut Butter Toast</div>
        </button>
        <button
          value="335"
          id="chicken"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{ fontSize: "10px", marginRight: "10px" }}
        >
          <GiChickenOven
            style={{
              color: "brown",
              fontSize: "30px",
              background: "none",
            }}
          />
          <div>Chicken</div>
        </button>
      </div>
      <br />
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
