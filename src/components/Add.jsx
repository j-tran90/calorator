/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
import { useState } from "react";
import { auth, db, timestamp } from "../config/Firebase";
import { FcCheckmark } from "react-icons/fc";
import useTracker from "../hooks/useTracker";

export default function Add({ getEntries }) {
  const { uid } = auth.currentUser;
  const [newEntry, setNewEntry] = useState(0);
  const { sumEntry, updateTotal } = useTracker(0);

  const handleAdd = async (e) => {
    e.preventDefault();

    await db
      .collection("journal")
      .doc(uid)
      .collection("entries")
      .doc()
      .set({
        calories: parseFloat(newEntry),
        createdAt: timestamp,
      })
      .then(function () {
        document.getElementById("newEntry").reset();
      })
      .then(() => {
        sumEntry();
      })
      .then(() => {
        updateTotal();
      })
      .then(() => {
        getEntries();
      });
  };

  const disableKey = () => {
    if (document.getElementById("newEntry").value === "") {
      document.getElementById("button").disabled = true;
    } else {
      document.getElementById("button").disabled = false;
    }
  };

  return (
    <>
      <form id="newEntry" onSubmit={handleAdd}>
        <input
          id="newEntry"
          type="number"
          placeholder="Enter Calories"
          onKeyUp={disableKey}
          onChange={(e) => {
            setNewEntry(e.target.value);
          }}
          style={{ width: "100px", height: "30px" }}
          required
        ></input>
        <button id="button" type="submit" disabled>
          <FcCheckmark />
        </button>
      </form>
    </>
  );
}
