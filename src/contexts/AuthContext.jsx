import React, { useContext, useEffect, useState } from "react";
import { auth } from "../config/Firebase";
import {
  getAuth,
  deleteUser,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  browserPopupRedirectResolver,
  EmailAuthProvider,
  linkWithCredential,
  updateProfile,
  onAuthStateChanged,
  linkWithRedirect,
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const provider = new GoogleAuthProvider();

  async function register(email, password, displayName) {
    try {
      let userCredential;

      if (auth.currentUser?.isAnonymous) {
        // Link anonymous account to email/password
        const credential = EmailAuthProvider.credential(email, password);
        userCredential = await linkWithCredential(auth.currentUser, credential);

        // Update profile after linking
        await updateProfile(userCredential.user, {
          displayName: displayName,
          photoURL: null, // Set to a valid URL or leave as null
        });
      } else {
        // Standard email/password registration
        userCredential = await auth.createUserWithEmailAndPassword(
          email,
          password
        );

        // Update profile after creating the user
        await updateProfile(userCredential.user, {
          displayName: displayName,
          photoURL: null, // Set to a valid URL or leave as null
        });
      }

      // Ensure user is signed in and updated profile is reflected
      setCurrentUser(userCredential.user); // Ensure current user is updated
    } catch (error) {
      console.error("Registration error:", error);
    }
  }

  // Google login and link if anonymous
  async function googleLogin() {
    try {
      const provider = new GoogleAuthProvider();

      if (auth.currentUser) {
        // Check if user already exists and wants to link Google
        try {
          const result = await linkWithPopup(
            auth.currentUser,
            provider,
            browserPopupRedirectResolver
          );
          console.log("Google account linked successfully:", result.user);
        } catch (error) {
          if (error.code === "auth/credential-already-in-use") {
            console.log(
              "This Google account is already linked to another user."
            );
          } else {
            console.error("Error linking Google account:", error);
          }
        }
      } else {
        // Standard Google sign-in if no user is logged in
        await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  }

  async function guestLogin() {
    const auth = getAuth();
    await signInAnonymously(auth);
  }

  function logout() {
    return auth.signOut();
  }

  function deleteAccount() {
    const user = auth.currentUser;
    deleteUser(user)
      .then(() => {})
      .catch((error) => {
        console.log("Deletion Failed", error);
      });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login: (email, password) =>
      auth.signInWithEmailAndPassword(email, password),
    register,
    logout,
    deleteAccount,
    googleLogin,
    guestLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
