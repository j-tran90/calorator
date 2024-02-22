import { useState, useEffect } from "react";
import { db, auth, timestamp } from "../config/Firebase";
import { getDocs, doc, collection, deleteDoc } from "firebase/firestore";
import { FcCancel } from "react-icons/fc";
import { FaEdit } from "react-icons/fa";
import { FcCheckmark } from "react-icons/fc";
import { FcCollapse } from "react-icons/fc";

export default function Edit() {
  const { uid } = auth.currentUser;
  const [editEntry, setEditEntry] = useState(0);

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

  const toggleEdit = (id) => {
    const editField = document.getElementById("editEntry");
    //UPDATE TO SWITCH STATEMENT
    const openEdit = document.getElementById("openEdit");
    const closeEdit = document.getElementById("closeEdit");
    if (editField.style.display === "none") {
      editField.style.display = "";
      openEdit.style.display = "none";
      closeEdit.style.display = "";
    } else {
      editField.style.display = "none";
      openEdit.style.display = "";
      closeEdit.style.display = "none";
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(entryCollectionRef, id));
  };

  return (
    <>
      {" "}
      <form id="editEntry" style={{ display: "none" }}>
        <input
          id="editEntry"
          placeholder="update calories"
          type="number"
          required={true}
          onChange={(e) => {
            setEditEntry(e.target.value);
          }}
        ></input>
        <FcCheckmark
          style={{
            marginLeft: "20px",
          }}
          onClick={() => {
            handleEdit(entry.id);
          }}
        />
        <FcCancel
          style={{
            marginLeft: "20px",
          }}
          onClick={() => {
            handleDelete(entry.id);
          }}
        />
        <FcCollapse
          id="closeEdit"
          style={{
            marginLeft: "20px",
          }}
          onClick={() => toggleEdit(entry.id)}
        />
      </form>
      <FaEdit
        id="openEdit"
        style={{
          color: "grey",
          marginLeft: "20px",
        }}
        onClick={() => toggleEdit(entry.id)}
      />
    </>
  );
}
