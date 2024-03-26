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
      })
      .then(() => {
        document.getElementById("updateForm").value = "";
        document.getElementById("button").style.visibility = "hidden";
      })
      .then(() => {
        sumEntry();
      })
      .then(() => {
        updateTotal();
      });
  };

  const disableButton = () => {
    if (document.getElementById("updateForm").value === "" || NaN || null) {
      document.getElementById("button").style.visibility = "hidden";
    } else {
      document.getElementById("button").style.visibility = "";
    }
  };

  return (
    <>
      <div className="">
        <form id="newEntry" onSubmit={handleAdd}>
          <input
            required
            id="updateForm"
            type="number"
            min="1"
            max="9999"
            onKeyDown={(evt) =>
              ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
            }
            placeholder="Enter Calories"
            onKeyUp={disableButton}
            onChange={(e) => {
              setNewEntry(e.target.value);
            }}
            style={{ width: "100px" }}
          ></input>
          <button
            id="button"
            type="submit"
            style={{
              background: "none",
              visibility: "hidden",
              marginLeft: "5px",
            }}
          >
            <FcCheckmark style={{ fontSize: "30px", marginBottom: "-10px" }} />
          </button>
        </form>
      </div>
    </>
  );
}
