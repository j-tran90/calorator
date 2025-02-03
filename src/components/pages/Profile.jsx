import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db, auth } from "../../config/Firebase";
import { collection, documentId, query, where } from "firebase/firestore";
import useCollectionData from "../../hooks/useFetch";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Grid2,
  Box,
} from "@mui/material";
import SetTargetButton from "../buttons/SetTargetButton";
import Header from "../navigation/Header";

export default function Profile() {
  const { currentUser } = useAuth();
  const { uid } = auth.currentUser;

  // Query user profile
  const userProfileRef = collection(db, "userProfile/");
  const queryUserProfile = query(
    userProfileRef,
    where(documentId(), "==", uid)
  );
  const { data: profile } = useCollectionData(queryUserProfile);

  // Query user goals to fetch currentWeight
  const userGoalsRef = collection(db, "userGoals");
  const queryUserGoals = query(userGoalsRef, where(documentId(), "==", uid));
  const { data: goals } = useCollectionData(queryUserGoals);

  const [age, setAge] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(null);

  function calculateAge(dateOfBirth) {
    const currentDate = new Date();
    const ageInMilliseconds = currentDate - new Date(dateOfBirth);
    const ageInYears = Math.floor(
      ageInMilliseconds / (1000 * 3600 * 24 * 365.25)
    );
    return ageInYears;
  }

  const formatDate = (date) => {
    return dayjs(date).format("MMM DD, YYYY");
  };

  useEffect(() => {
    if (profile && profile.length > 0) {
      const calculatedAge = calculateAge(profile[0].dob);
      setAge(calculatedAge);
    }
  }, [profile]); // Recalculate age when profile data changes

  useEffect(() => {
    if (goals && goals.length > 0) {
      setCurrentWeight(goals[0].currentWeight); // Set the currentWeight from userGoals
    }
  }, [goals]); // Update currentWeight when goals data changes

  return (
    <>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>{currentUser.displayName || "Guest User"}</TableCell>
            </TableRow>

            {profile.map((showProfile) => (
              <React.Fragment key={showProfile.id}>
                <TableRow>
                  <TableCell>
                    <strong>Date of Birth</strong>
                  </TableCell>
                  <TableCell>{formatDate(showProfile.dob)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Age</strong>
                  </TableCell>
                  <TableCell>{age}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Gender</strong>
                  </TableCell>
                  <TableCell>{showProfile.gender}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Height</strong>
                  </TableCell>
                  <TableCell>{showProfile.height} cm</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Current Weight</strong>
                  </TableCell>
                  <TableCell>
                    <Grid2 container>
                      <Grid2 size={6}> {currentWeight} lbs </Grid2>
                      <Grid2 size={6}>
                        <SetTargetButton
                          buttonText={"New"}
                          buttonHeight={"20px"}
                        />
                      </Grid2>
                    </Grid2>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Account Created</strong>
                  </TableCell>
                  <TableCell sx={{ fontStyle: "italic" }}>
                    {formatDate(showProfile.joinDate)}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ p: {xs: 2, md: 1} }}>
        <Header headText={"Linked Accounts"} />
      </Box>
    </>
  );
}
