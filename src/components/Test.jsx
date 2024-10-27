import NavBar from "./NavBar";
import useTracker from "../hooks/useTracker";
import { useState } from "react";
import { auth, db, timestamp } from "../config/Firebase";

import { FaAppleAlt } from "react-icons/fa";
import { IoEggSharp } from "react-icons/io5";
import { GiBananaPeeled, GiButterToast, GiChickenOven } from "react-icons/gi";
import { LuSalad } from "react-icons/lu";
import { IoIosIceCream } from "react-icons/io";
import { GiSodaCan } from "react-icons/gi";
import ProgressCircle from "./ProgressCircle";

export default function Test({ sumEntry, updateTotal }) {
  const { entries, total, getEntries } = useTracker(0);
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
      // .then(() => {
      //   getEntries();
      // })
      .then(() => {
        updateTotal();
      });

    console.log("added", typeof newEntry, newEntry);
  };

  return (
    <>
      {/* <Navigation />
      <h2> Total: {total}</h2> */}
      <ProgressCircle />
      {/* <div>
        <button
          value="95"
          id="apple"
          title="Apple"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{
            fontSize: "10px",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          <FaAppleAlt
            style={{ color: "maroon", fontSize: "30px", background: "none" }}
          />
          <div>+95</div>
        </button>
        <button
          value="78"
          id="eggs"
          title="1 Egg"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{
            fontSize: "10px",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          <IoEggSharp
            style={{
              color: "white",
              fontSize: "30px",
              background: "none",
            }}
          />
          <div>+78</div>
        </button>
        <button
          value="105"
          id="banana"
          title="Banana"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{
            fontSize: "10px",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          <GiBananaPeeled
            style={{
              color: "yellow",
              fontSize: "30px",
              background: "none",
            }}
          />
          <div>+105</div>
        </button>
        <button
          value="267"
          id="pbtoast"
          title="Peanut Butter Toast"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{
            fontSize: "10px",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          <GiButterToast
            style={{
              color: "brown",
              fontSize: "30px",
              background: "none",
            }}
          />
          <div>+267</div>
        </button>
        <button
          value="335"
          id="chicken"
          title="Chicken"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{
            fontSize: "10px",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          <GiChickenOven
            style={{
              color: "chocolate",
              fontSize: "30px",
              background: "none",
            }}
          />
          <div>+335</div>
        </button>
        <button
          value="45"
          id="salad"
          title="Salad"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{
            fontSize: "10px",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          <LuSalad
            style={{
              color: "green",
              fontSize: "30px",
              background: "none",
            }}
          />
          <div>+45</div>
        </button>
        <button
          value="417"
          id="icecream"
          title="Ice Cream"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{
            fontSize: "10px",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          <IoIosIceCream
            style={{
              color: "pink",
              fontSize: "30px",
              background: "none",
            }}
          />
          <div>+417</div>
        </button>
        <button
          value="150"
          id="coke"
          title="Coke"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{
            fontSize: "10px",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          <GiSodaCan
            style={{
              color: "red",
              fontSize: "30px",
              background: "none",
            }}
          />
          <div>+150</div>
        </button>
      </div> */}
      <br />
      {/* {entries.map((entry) => {
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
      })} */}
    </>
  );
}
