import { useState } from "react";

import { FaAppleAlt } from "react-icons/fa";
import { IoEggSharp } from "react-icons/io5";
import { GiBananaPeeled, GiButterToast, GiChickenOven } from "react-icons/gi";
import { GiSteak } from "react-icons/gi";
import { LuSalad } from "react-icons/lu";
import { IoIosIceCream } from "react-icons/io";
import { GiSodaCan } from "react-icons/gi";
import { auth, db, timestamp } from "../config/Firebase";
import { SiBurgerking } from "react-icons/si";
import { GiFrenchFries } from "react-icons/gi";
import { GiFullPizza } from "react-icons/gi";

export default function FoodButtons({ sumEntry, updateTotal }) {
  const { uid } = auth.currentUser;
  const [newEntry, setNewEntry] = useState({
    calorie: 0,
  });
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
        updateTotal();
      });

    console.log("added", typeof newEntry, newEntry);
  };

  return (
    <>
      <div>
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
            style={{ color: "#73ff00", fontSize: "30px", background: "none" }}
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
          value="679"
          id="steak"
          title="Steak"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{
            fontSize: "10px",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          <GiSteak
            style={{
              color: "#b8430d",
              fontSize: "30px",
              background: "none",
            }}
          />
          <div>+679</div>
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
        <button
          value="660"
          id="whopper"
          title="Whopper"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{
            fontSize: "10px",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          <SiBurgerking
            style={{
              color: "red",
              fontSize: "30px",
              background: "none",
            }}
          />
          <div>+660</div>
        </button>
        <button
          value="380"
          id="fries"
          title="Fries"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{
            fontSize: "10px",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          <GiFrenchFries
            style={{
              color: "#ffe600",
              fontSize: "30px",
              background: "none",
            }}
          />
          <div>+380</div>
        </button>
        <button
          value="2000"
          id="fullpizza"
          title="Full Pizza"
          type="submit"
          onMouseDown={(e) => setNewEntry(e.currentTarget.value)}
          onClick={handleAdd}
          style={{
            fontSize: "10px",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          <GiFullPizza
            style={{
              color: "#cea00a",
              fontSize: "30px",
              background: "none",
            }}
          />
          <div>+2000</div>
        </button>
      </div>
    </>
  );
}
