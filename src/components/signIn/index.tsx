import React, { useState, useContext } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";


import { UserContext } from "../../contexts/UserContext";



const Signin = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUserEmail, setUserId } = useContext(UserContext);


  const navigate = useNavigate();

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
  
    const API_LOGIN = import.meta.env.VITE_API_LOGIN;
  
    try {
      const response = await axios.post(
        `${API_LOGIN}`,
        {
          identifier: formData.identifier,
          password: formData.password,
        }
      );
  
      if (response.data.success) {
        console.log("API Response:", response.data);
        setResponseMessage("Successfully logged in!");
  
        
        if (response.data.success) {
          setUserEmail(response.data.email || formData.identifier);
          setUserId(response.data.userId); 
          navigate("/home");
        }
       
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
    <div className="login-page">
      <div className="left-panel">
        <h1>Welcome to Website</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam
          nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
          volutpat.
        </p>
      </div>
  
      <div className="right-panel">
        <h2>User Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="identifier">
              <FontAwesomeIcon icon={faUser} className="icon" />
            </label>
            <input
              id="identifier"
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Username or Email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} className="icon" />
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <div className="options">
            <Link to="/signup">Sign Up</Link>
            <Link to="/request-password-reset">Forgot password?</Link>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>
        {responseMessage && <p className="response-message">{responseMessage}</p>}
      </div>
    </div>
  );
  
};

export default Signin;


