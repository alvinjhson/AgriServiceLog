import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./signUp/index";
import Signin from "./signIn/index";
import ResetPassword from "./resetPassword/index";
import RequestResetPassword from "./requestPassword/index";
import HomePage from "./home/index";
import { UserProvider } from "../contexts/UserContext";

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/request-password-reset"
          element={<RequestResetPassword />}
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </UserProvider>
  );
};

export default App;
