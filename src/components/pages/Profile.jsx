import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db, auth } from "../../config/Firebase";
import {
  collection,
  documentId,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import dayjs from "dayjs";
import {
  Paper,
  Box,
  Button,
  Grid2,
  Card,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
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
import {
  Edit,
  Google,
  MailOutline,
  Settings,
  PrivacyTip,
  HelpOutline,
  ArrowForwardIos,
} from "@mui/icons-material";
import { Alert, Snackbar } from "@mui/material";
import Header from "../navigation/Header";
import User from "../layouts/User";
import { Type } from "react-swipeable-list";
import { useNavigate } from "react-router-dom";
import BackButton from "../navigation/BackButton";

export default function Profile() {
  const { currentUser } = useAuth();
  const { uid, isAnonymous, providerData } = auth.currentUser;

  const [profile, setProfile] = useState([]);
  const [goals, setGoals] = useState([]);
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

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfileRef = collection(db, "userProfile");
        const queryUserProfile = query(
          userProfileRef,
          where(documentId(), "==", uid)
        );
        const querySnapshot = await getDocs(queryUserProfile);
        const fetchedProfile = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProfile(fetchedProfile);

        if (fetchedProfile.length > 0) {
          setAge(calculateAge(fetchedProfile[0].dob));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (uid) {
      fetchUserProfile();
    }
  }, [uid]);

  // Fetch user goals
  useEffect(() => {
    const fetchUserGoals = async () => {
      try {
        const userGoalsRef = collection(db, "userGoals");
        const queryUserGoals = query(
          userGoalsRef,
          where(documentId(), "==", uid)
        );
        const querySnapshot = await getDocs(queryUserGoals);
        const fetchedGoals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGoals(fetchedGoals);

        if (fetchedGoals.length > 0) {
          setCurrentWeight(fetchedGoals[0].currentWeight);
        }
      } catch (error) {
        console.error("Error fetching user goals:", error);
      }
    };

    if (uid) {
      fetchUserGoals();
    }
  }, [uid]);

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

  const cardStyles = {
    borderRadius: "20px",
    width: { xxs: "105px", xs: "120px" },
    height: "100px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };

  // Shared styles for Typography
  const sectionTitleStyles = {
    m: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "left",
    color: "#777777",
  };

  // Shared styles for ListItem components
  const listItemStyles = (isDisabled) => ({
    "&:hover": {
      backgroundColor: isDisabled ? "inherit" : "rgba(0, 0, 0, 0.08)",
      borderRadius: "10px",
    },
    opacity: isDisabled ? 0.5 : 1,
    cursor: isDisabled ? "not-allowed" : "pointer",
  });

  const navigate = useNavigate();

  return (
    <>
      <Box sx={{ pb: 2 }}>
        <Grid2 container>
          <Grid2
            size={{ xs: 4 }}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "left",
            }}
          >
            {" "}
            <BackButton />{" "}
          </Grid2>{" "}
          <Grid2 size={{ xs: 8 }} sx={{ pl: 2 }}></Grid2>
        </Grid2>
      </Box>

      <Box sx={{ borderRadius: "20px", mb: 1 }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <User photoWidth='100px' />
          <Stack>
            <Typography variant='h6'>
              {currentUser.displayName || "Guest User"}
            </Typography>
          </Stack>
          <Stack>
            <Typography variant='body2' sx={{ color: "#777777" }}>
              {currentUser.email}
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Button variant='contained' disabled onClick={() => {}}>
        <Edit sx={{ mr: 1 }} /> Edit Profile
      </Button>

      <Typography variant='caption' sx={sectionTitleStyles}>
        Personal Details
      </Typography>
      <Grid2
        container
        spacing={2}
        sx={{
          p: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          textAlign: "center",
        }}
        xs={12}
        md={6}
      >
        {profile.map((showProfile) => (
          <React.Fragment key={showProfile.id}>
            <Card sx={cardStyles}>
              <Typography variant='h6'>Age</Typography>
              <Typography variant='body2'>{age}</Typography>
            </Card>
            <Card sx={cardStyles}>
              <Typography variant='h6'>Gender</Typography>
              <Typography variant='body2'>{showProfile.gender}</Typography>
            </Card>
            <Card sx={cardStyles}>
              <Typography variant='h6'>Height</Typography>
              <Typography variant='body2'>{showProfile.height} cm</Typography>
            </Card>
            <Card sx={cardStyles}>
              <Typography variant='h6'>Weight</Typography>
              <Typography variant='body2'>{currentWeight} lbs</Typography>
            </Card>
            <Card sx={cardStyles}>
              <Typography variant='h6'>Plan</Typography>
              <Typography variant='body2'>Active</Typography>
            </Card>
            <Card sx={cardStyles}>
              <Typography variant='h6'>Finished</Typography>
              <Typography variant='body2'>0</Typography>
            </Card>
          </React.Fragment>
        ))}
      </Grid2>

      <Typography variant='caption' sx={sectionTitleStyles}>
        Preference
      </Typography>
      <Box
        component={Paper}
        sx={{
          borderRadius: "20px",
          m: 1,
          p: { xs: 1, md: 2 },
        }}
      >
        <List>
          {/* Account Settings */}
          <ListItem
            onClick={() => navigate("/settings")}
            sx={listItemStyles(false)}
          >
            <Settings
              sx={{
                mr: 1,
              }}
            />
            <ListItemText primary='Account Settings' />
            <ListItemIcon sx={{ minWidth: "auto" }}>
              <ArrowForwardIos fontSize='small' />
            </ListItemIcon>
          </ListItem>

          {/* Privacy Settings (Disabled with Hover Effect) */}
          <ListItem
            disabled
            sx={{
              opacity: 0.5,
              cursor: "not-allowed",
              "&:hover": {
                backgroundColor: "inherit",
              },
            }}
          >
            <PrivacyTip sx={{ mr: 1 }} />
            <ListItemText primary='Privacy Settings' />
            <ListItemIcon sx={{ minWidth: "auto" }}>
              <ArrowForwardIos fontSize='small' />
            </ListItemIcon>
          </ListItem>

          {/* Help & Support (Disabled with Hover Effect) */}
          <ListItem
            disabled
            sx={{
              opacity: 0.5,
              cursor: "not-allowed",
              "&:hover": {
                backgroundColor: "inherit",
              },
            }}
          >
            <HelpOutline sx={{ mr: 1 }} />
            <ListItemText primary='Help & Support' />
            <ListItemIcon sx={{ minWidth: "auto" }}>
              <ArrowForwardIos fontSize='small' />
            </ListItemIcon>
          </ListItem>
        </List>
      </Box>

      <Typography variant='caption' sx={sectionTitleStyles}>
        Link Accounts
      </Typography>
      <Card sx={{ borderRadius: "20px", m: 1, p: { xs: 1, md: 2 } }}>
        <List>
          {/* Link Email */}
          <ListItem
            onClick={handleLinkEmail}
            disabled={linkedAccounts.includes("password")}
            sx={listItemStyles(linkedAccounts.includes("password"))}
          >
            <MailOutline sx={{ mr: 1 }} />
            <ListItemText
              primary={
                linkedAccounts.includes("password")
                  ? "Linked to Email"
                  : "Link Email"
              }
            />
          </ListItem>

          {/* Link Google */}
          <ListItem
            onClick={handleLinkGoogle}
            disabled={linkedAccounts.includes("google.com")}
            sx={listItemStyles(linkedAccounts.includes("google.com"))}
          >
            <Google sx={{ mr: 1 }} />
            <ListItemText
              primary={
                linkedAccounts.includes("google.com")
                  ? "Linked to Google"
                  : "Link Google"
              }
            />
          </ListItem>
        </List>
      </Card>

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
