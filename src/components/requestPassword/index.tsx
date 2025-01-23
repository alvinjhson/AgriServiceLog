import React, { useState } from "react";
import axios from "axios";
import "./style.scss";

const RequestResetPassword = () => {
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const API_REQUEST_PASSWORD_RESET = import.meta.env.VITE_API_REQUEST_PASSWORD_RESET;
    try {
      console.log("Sending request to reset password with email:", email);

      const response = await axios.post(
        `${API_REQUEST_PASSWORD_RESET}`,
        { email },
        {
          headers: {
            "Content-Type": "application/json", 
          },
        }
      );

      console.log("Response from API:", response.data);

      if (response.data.success) {
        setResponseMessage("A reset link has been sent to your email.");
      } else {
        setResponseMessage(response.data.message || "Failed to send reset link.");
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setResponseMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-reset-container">
      <h2>Reset Your Password</h2>
      {responseMessage && <p>{responseMessage}</p>}
      {!responseMessage.includes("reset link") && (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Request Reset"}
          </button>
        </form>
      )}
    </div>
  );
};

export default RequestResetPassword;



