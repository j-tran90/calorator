import React, { useContext, useEffect, useState } from "react";
import { auth } from "../config/Firebase";
import {
  getAuth,
  deleteUser,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Initialize with null
  const [loading, setLoading] = useState(true);
  const provider = new GoogleAuthProvider();

  function register(email, password) {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then(function (result) {
        return result.user.updateProfile({
          displayName: document
            .getElementById("name")
            .value.replace(/(^\w{1})|(\s+\w{1})/g, (value) =>
              value.toUpperCase()
            ),
          photoURL: "https://cdn-icons-png.flaticon.com/256/9230/9230519.png",
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  const googleLogin = () => {
    const googleAuth = getAuth();
    signInWithPopup(googleAuth, provider);
  };

  async function guestLogin() {
    const auth = getAuth();
    await signInAnonymously(auth);
  }

  function logout() {
    return auth.signOut();
  }

  function deleteAccount() {
    const googleAuth = getAuth();
    const user = googleAuth.currentUser;

    deleteUser(user || currentUser)
      .then(() => {})
      .catch((error) => {
        console.log("Deletion Failed", error);
      });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user); // Log user object
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    deleteAccount,
    googleLogin,
    guestLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}{" "}
      {/* Ensure children are rendered only when loading is false */}
    </AuthContext.Provider>
  );
}
