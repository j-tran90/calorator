import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db, auth } from "../../config/Firebase";
import { collection, documentId, query, where } from "firebase/firestore";
import useCollectionData from "../../hooks/useFetch";
import dayjs from "dayjs";

export default function Profile() {
  const { currentUser } = useAuth();
  const { uid } = auth.currentUser;
  const userProfileRef = collection(db, "userProfile/");
  const queryUserProfile = query(
    userProfileRef,
    where(documentId(), "==", uid)
  );
  const { data: profile } = useCollectionData(queryUserProfile);
  const [age, setAge] = useState(0); // Calculated age in years

  function calculateAge(dateOfBirth) {
    const currentDate = new Date();
    const ageInMilliseconds = currentDate - new Date(dateOfBirth);
    const ageInYears = Math.floor(
      ageInMilliseconds / (1000 * 3600 * 24 * 365.25)
    );
    return ageInYears;
  }

  useEffect(() => {
    if (profile && profile.length > 0) {
      const calculatedAge = calculateAge(profile[0].dob);
      setAge(calculatedAge);
    }
  }, [profile]); // Recalculate age when profile data changes

  return (
    <>
      <div className='card'>
        <div style={{ textAlign: "left" }}>
          <div className='column'>
            Name: {currentUser.displayName || "Guest User"}
          </div>

          {profile.map((showProfile) => (
            <div key={showProfile.id}>
              <div className='column'>
                <div className='column'>
                  Age: {age} {/* Display calculated age */}
                </div>
                <div>
                  Date of Birth: {dayjs(showProfile.dob).format("MM/DD/YYYY")}
                </div>{" "}
                {/* Display formatted DOB */}
                <div>Gender: {showProfile.gender}</div>
                <div>Current Weight: {showProfile.currentWeight} lbs</div>
              </div>
              <div>Height: {showProfile.height} cm</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
