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
  Grid,
  Box,
  Button,
  Typography,
} from "@mui/material";
import SetTargetButton from "../buttons/SetTargetButton";
import Header from "../navigation/Header";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  linkWithPopup,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { Google, MailOutline } from "@mui/icons-material";

export default function Profile() {
  const { currentUser } = useAuth();
  const { uid, isAnonymous, providerData } = auth.currentUser;

  // Query user profile
  const userProfileRef = collection(db, "userProfile");
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
  const [linkedAccounts, setLinkedAccounts] = useState([]);

  function calculateAge(dateOfBirth) {
    return Math.floor(
      (new Date() - new Date(dateOfBirth)) / (1000 * 3600 * 24 * 365.25)
    );
  }

  const formatDate = (date) => dayjs(date).format("MMM DD, YYYY");

  useEffect(() => {
    if (profile?.length > 0) {
      setAge(calculateAge(profile[0].dob));
    }
  }, [profile]);

  useEffect(() => {
    if (goals?.length > 0) {
      setCurrentWeight(goals[0].currentWeight);
    }
  }, [goals]);

  // Fetch linked authentication providers
  useEffect(() => {
    if (currentUser?.email) {
      fetchSignInMethodsForEmail(auth, currentUser.email)
        .then((methods) => {
          setLinkedAccounts(methods);
        })
        .catch((error) =>
          console.error("Error fetching sign-in methods:", error)
        );
    }
  }, [currentUser]);

  async function handleLinkEmail() {
    const email = prompt("Enter your email:");
    const password = prompt("Enter a password:");
    if (!email || !password) return;

    try {
      const credential = EmailAuthProvider.credential(email, password);
      await linkWithCredential(auth.currentUser, credential);
      alert("Email linked successfully!");
    } catch (error) {
      console.error("Error linking email account:", error);
    }
  }

  async function handleLinkGoogle() {
    try {
      await linkWithPopup(auth.currentUser, new GoogleAuthProvider());
      alert("Google account linked successfully!");
    } catch (error) {
      console.error("Error linking Google account:", error);
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
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
                    <Grid container spacing={2}>
                      <Grid item>{currentWeight} lbs</Grid>
                      <Grid item>
                        <SetTargetButton buttonText='New' buttonHeight='20px' />
                      </Grid>
                    </Grid>
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

      <Box sx={{ p: { xs: 2, md: 1 } }}>
        <Header headText='Linked Accounts' />
        <Box sx={{ mt: 2 }}>
          <Typography variant='body1'>
            {linkedAccounts.length > 0
              ? `Currently linked: ${linkedAccounts.join(", ")}`
              : "No linked accounts found."}
          </Typography>
        </Box>
      </Box>

      {isAnonymous && (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Button disabled variant='contained' onClick={handleLinkEmail} sx={{ mr: 2 }}>
            <MailOutline sx={{ mr: 1 }} /> Link Email
          </Button>
          <Button variant='contained' onClick={handleLinkGoogle}>
            <Google sx={{ mr: 1 }} />
            Link Google
          </Button>
        </Box>
      )}
    </>
  );
}
