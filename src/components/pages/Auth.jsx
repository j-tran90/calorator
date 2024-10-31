// src/components/pages/Auth.js
import React from "react";
import Login from "./Login";
import Register from "./Register";

const Auth = () => {
  return (
    <div>
      <h2>Login or Sign Up</h2>
      <Login />
      <Register />
    </div>
  );
};

export default Auth;
