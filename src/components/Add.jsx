/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
import { useState } from "react";
import { auth, db, timestamp } from "../config/Firebase";
import { FcCheckmark } from "react-icons/fc";

export default function Add({ sumEntry, updateTotal }) {
  const { uid } = auth.currentUser;
  const [newEntry, setNewEntry] = useState(0);

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
        uid,
      })
      .then(function () {
        document.getElementById("newEntry").reset();
      })
      .then(() => {
        sumEntry();
      })
      .then(() => {
        updateTotal();
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
          placeholder="enter calories"
          onKeyUp={disableKey}
          onChange={(e) => {
            setNewEntry(e.target.value);
          }}
          required
        ></input>
        <button id="button" type="submit" disabled>
          <FcCheckmark />
        </button>
      </form>
    </>
  );
}
