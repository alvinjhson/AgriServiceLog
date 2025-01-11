import React, { useState } from "react";
import axios from "axios";
import "./signin.scss";

const Signin = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form submission started...");
    console.log("Form data being submitted:", formData);
    console.log("API Endpoint:", "https://z09zwi52qg.execute-api.eu-north-1.amazonaws.com/auth/login");

    try {
      const response = await axios.post(
        "https://z09zwi52qg.execute-api.eu-north-1.amazonaws.com/auth/login",
        {
          identifier: formData.identifier,
          password: formData.password,
        }
      );

      if (response.data.success) {
        console.log("API Response:", response.data);
        setResponseMessage("Successfully logged in!");
        console.log("Token:", response.data.token);
      } else {
        console.error("Login failed:", response.data.message);
        setResponseMessage(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred during login:");
      if (error.response) {
        console.error("Status Code:", error.response.status);
        console.error("Response Data:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }

      setResponseMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
      console.log("Form submission ended.");
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form className="signin-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="identifier">Username or Email</label>
          <input
            id="identifier"
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </div>
  );
};

export default Signin;

