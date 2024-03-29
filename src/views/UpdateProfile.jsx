import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../config/Firebase";
import User from "../components/User";
import Navigation from "../components/Navigation";

export default function UpdateProfile() {
  const { uid } = auth.currentUser;
  const [age, setAge] = useState(0);
  const [weight, setWeight] = useState(0);
  const [error, setError] = useState("");
  const redirect = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    //TODO: TRY CATCH ERROR
    await db
      .collection("users")
      .doc(uid)
      .set({
        age: parseInt(age),
        weight: parseFloat(weight),
      });
    redirect("/profile", { replace: true });
  };

  return (
    <>
      <User />
      <Navigation />

      <form id="updateForm" onSubmit={handleUpdate}>
        <input
          required
          id="age"
          type="number"
          placeholder="enter age"
          onChange={(e) => {
            setAge(e.target.value);
          }}
        ></input>
        <div>
          <input
            required
            id="weight"
            type="number"
            placeholder="enter current weight"
            onChange={(e) => {
              setWeight(e.target.value);
            }}
          ></input>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
