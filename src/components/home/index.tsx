import React from "react";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext"; 
import "./style.scss";
import Logo from "../../asset/test.png";


const HomePage: React.FC = () => {
  
  const { userEmail } = useContext(UserContext);

  const handleAddMachine = () => {
    console.log("Add Machine button clicked!");
  };

  return (
    <div className="home-page">
      <div className="top-bar">
        <div className="logo-section">
          <img src={Logo} alt="Agriservicelog logo" />
          <div className="app-name">Agriservicelog</div>
        </div>

        <div className="user-info">
          <div className="user-email">
            {userEmail || "Guest"}
          </div>
          <div className="user-icon">D</div>
        </div>
      </div>

      <div className="main-content">
        <h1>Welcome to Agriservicelog</h1>
        <div className="divider" />

        <div className="machine-list-header">
          <h2>Machine list</h2>
          <button className="add-machine-btn" onClick={handleAddMachine}>
            Add Machine
          </button>
        </div>

        <div className="machine-list-content">
          <p>Your machine data goes here...</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
