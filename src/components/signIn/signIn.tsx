import React, { useState } from "react";
import axios from "axios";
import "./signin.scss";

const Signin = () => {
  const [formData, setFormData] = useState({
    username: "",
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

    try {
      const response = await axios.post(
        "https://z09zwi52qg.execute-api.eu-north-1.amazonaws.com/dev/auth/login", 
        formData
      );

      if (response.data.success) {
        setResponseMessage("Successfully logged in!");
        console.log("Token:", response.data.token); 
      } else {
        setResponseMessage(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setResponseMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form className="signin-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
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
      {responseMessage && (
        <p className="response-message">{responseMessage}</p>
      )}
    </div>
  );
};

export default Signin;
