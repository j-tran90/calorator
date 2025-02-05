import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db, auth } from "../../config/Firebase";
import {
  collection,
  documentId,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import useCollectionData from "../../hooks/useFetch";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Box,
  Button,
  Grid2,
} from "@mui/material";
import SetTargetButton from "../buttons/SetTargetButton";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  linkWithPopup,
  fetchSignInMethodsForEmail,
  browserPopupRedirectResolver,
} from "firebase/auth";
import { Google, MailOutline } from "@mui/icons-material";
import { Alert, Snackbar } from "@mui/material";

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
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

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
      const provider = new GoogleAuthProvider();
      const result = await linkWithPopup(
        auth.currentUser,
        provider,
        browserPopupRedirectResolver
      );

      // Check if display name is null or "anonymous" (or any placeholder for guest users)
      if (
        !auth.currentUser.displayName ||
        auth.currentUser.displayName.toLowerCase().includes("anonymous")
      ) {
        // Get Google display name
        const googleDisplayName = result.user.displayName;

        // Update Firebase Auth profile
        await auth.currentUser.updateProfile({
          displayName: googleDisplayName,
        });

        console.log("Updated display name to:", googleDisplayName);
      }

      // Show success alert
      setAlert({
        open: true,
        message: "Google account linked successfully!",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Failed to link Google account.",
        severity: "error",
      });
      console.error("Error linking Google account:", error);
    }
  }

  useEffect(() => {
    async function fetchLinkedAccounts() {
      if (currentUser?.email) {
        try {
          const methods = await fetchSignInMethodsForEmail(
            auth,
            currentUser.email
          );
          setLinkedAccounts(methods);
        } catch (error) {
          console.error("Error fetching sign-in methods:", error);
        }
      }
    }

    fetchLinkedAccounts();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      setLinkedAccounts(currentUser.providerData.map((p) => p.providerId));
    }
  }, [currentUser]);

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
                    <Grid2 container spacing={2}>
                      <Grid2>{currentWeight} lbs</Grid2>
                      <Grid2>
                        <SetTargetButton buttonText='New' buttonHeight='20px' />
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

      <Box sx={{ p: 2, textAlign: "center" }}>
        <Button
          disabled={linkedAccounts.includes("password")}
          variant='contained'
          onClick={handleLinkEmail}
          sx={{ mr: 2 }}
        >
          <MailOutline sx={{ mr: 1 }} />
          {linkedAccounts.includes("password")
            ? "Linked to Email"
            : "Link Email"}
        </Button>

        <Button
          disabled={linkedAccounts.includes("google.com")}
          variant='contained'
          onClick={handleLinkGoogle}
        >
          <Google sx={{ mr: 1 }} />
          {linkedAccounts.includes("google.com")
            ? "Linked to Google"
            : "Link Google"}
        </Button>
      </Box>
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}
