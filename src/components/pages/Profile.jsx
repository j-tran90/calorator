import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../config/Firebase";
import { collection, documentId, query, where } from "firebase/firestore";
import useCollectionData from "../../hooks/useFetch";
import dayjs from "dayjs"; // Import dayjs for date manipulation

export default function Profile() {
  const { currentUser } = useAuth();
  const { uid } = auth.currentUser;
  const userProfileRef = collection(db, "userProfile/");
  const queryUserProfile = query(
    userProfileRef,
    where(documentId(), "==", uid)
  );
  const { data: profile } = useCollectionData(queryUserProfile);

  // Function to format date in "M-D-YYYY" format, without leading zeros
  const formatDate = (date) => {
    const formattedDate = dayjs(date);
    const month = formattedDate.month() + 1; // `.month()` is zero-indexed, so we add 1
    const day = formattedDate.date(); // `.date()` returns the day of the month
    const year = formattedDate.year(); // `.year()` returns the year

    return `${month}-${day}-${year}`;
  };

  return (
    <>
      <div className='card'>
        <div style={{ textAlign: "left" }}>
          <div className='column'>
            Name: {currentUser.displayName || "Guest User"}
          </div>

          {profile.map((showProfile) => {
            const age = showProfile.dateOfBirth
              ? calculateAge(showProfile.dateOfBirth)
              : "N/A"; // Calculate age from dob if it exists

            return (
              <div key={showProfile.id}>
                <div className='column'>
                  <div className='column'>
                    Age: {showProfile.age} {/* Display calculated age */}
                  </div>
                  <div>
                    Date of Birth: {formatDate(showProfile.dateOfBirth)}
                  </div>{" "}
                  {/* Display formatted DOB */}
                  <div>Gender: {showProfile.gender}</div>
                  <div>Current Weight: {showProfile.currentWeight} lbs</div>
                </div>
                <div>Height: {showProfile.height} cm</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
