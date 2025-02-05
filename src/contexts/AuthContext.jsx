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
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const provider = new GoogleAuthProvider();

  // Register with email/password and link if anonymous
  async function register(email, password, displayName) {
    if (auth.currentUser?.isAnonymous) {
      // Link anonymous account to email/password
      const credential = EmailAuthProvider.credential(email, password);
      try {
        const userCredential = await linkWithCredential(
          auth.currentUser,
          credential
        );
        await userCredential.user.updateProfile({
          displayName: displayName,
          photoURL: "https://cdn-icons-png.flaticon.com/256/9230/9230519.png",
        });
      } catch (error) {
        console.error("Error linking anonymous account:", error);
      }
    } else {
      // Standard email/password registration
      return auth
        .createUserWithEmailAndPassword(email, password)
        .then((result) =>
          result.user.updateProfile({
            displayName: displayName,
            photoURL: "https://cdn-icons-png.flaticon.com/256/9230/9230519.png",
          })
        )
        .catch((error) => console.log(error));
    }
  }

  // Google login and link if anonymous
  async function googleLogin() {
    try {
      if (auth.currentUser?.isAnonymous) {
        // Link anonymous account to Google
        await linkWithPopup(auth.currentUser, provider);
      } else {
        // Standard Google login
        await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      }
    } catch (error) {
      console.error("Error linking Google account:", error);
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
    const unsubscribe = auth.onAuthStateChanged((user) => {
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
