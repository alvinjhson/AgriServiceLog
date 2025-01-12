import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./signUp/signup";
import Signin from "./signIn/signIn";
import ResetPassword from "./resetPassword/resetPassword";
import RequestResetPassword from "./requestPassword/requestPassword";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/request-password-reset" element={<RequestResetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
};

export default App;
