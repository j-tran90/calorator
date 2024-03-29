/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
import { useState } from "react";
import { auth, db, timestamp } from "../config/Firebase";
import { FcCheckmark } from "react-icons/fc";

export default function Add({ sumEntry, updateTotal }) {
  const { uid } = auth.currentUser;
  const [newEntry, setNewEntry] = useState(0);
  const [newFood, setFoodEntry] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();

    await db
      .collection("journal")
      .doc(uid)
      .collection("entries")
      .doc()
      .set({
        calories: parseFloat(newEntry),
        food: newFood.toLowerCase().trim(),
        createdAt: timestamp,
      })
      .then(() => {
        document.getElementById("newEntry").value = "";
        document.getElementById("newFood").value = "";
        disableButton();
      })
      .then(() => {
        sumEntry();
      })
      .then(() => {
        updateTotal();
      });
  };

  const disableButton = () => {
    if (document.getElementById("newEntry").value === "" || NaN || null) {
      document.getElementById("button").style.visibility = "hidden";
    } else {
      document.getElementById("button").style.visibility = "";
    }
  };

  return (
    <>
      <div className="">
        <form id="entryForm" onSubmit={handleAdd}>
          <input
            required
            id="newFood"
            type="string"
            placeholder="Enter Food"
            onChange={(e) => {
              setFoodEntry(e.target.value);
            }}
          ></input>
          <input
            required
            id="newEntry"
            type="number"
            min="1"
            max="9999"
            onKeyDown={(evt) =>
              ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
            }
            placeholder="Cals"
            onKeyUp={disableButton}
            onChange={(e) => {
              setNewEntry(e.target.value);
            }}
            style={{ width: "50px" }}
          ></input>
          <button
            id="button"
            type="submit"
            style={{
              background: "none",
              visibility: "hidden",
            }}
          >
            <FcCheckmark style={{ fontSize: "30px", marginBottom: "-10px" }} />
          </button>
        </form>
      </div>
    </>
  );
}
