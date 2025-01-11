import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../config/Firebase";
import { collection, documentId, query, where } from "firebase/firestore";
import useCollectionData from "../../hooks/useFetch";

export default function Profile() {
  const { currentUser } = useAuth();
  const { uid } = auth.currentUser;
  const userProfileRef = collection(db, "userProfile/");
  const queryUserProfile = query(
    userProfileRef,
    where(documentId(), "==", uid)
  );
  const { data: profile } = useCollectionData(queryUserProfile);

  return (
    <>
      <div className='card'>
        <div style={{ textAlign: "left" }}>
          <div className='column'>
            Name: {currentUser.displayName || "Guest User"}
          </div>

          {profile.map((showProfile) => {
            return (
              <div key={showProfile.id}>
                <div className='column'>
                  <div className='column'>Age: {showProfile.age}</div>
                  <div>Gender: {showProfile.gender}</div>
                  Current Weight: {showProfile.currentWeight} lbs
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
