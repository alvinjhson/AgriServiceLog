import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import "./style.scss";
import Logo from "../../asset/test.png";
import TractorModal from "./addMachine/index";

interface Machine {
  id: number;
  name: string;
  model: string;
}

const HomePage: React.FC = () => {
  const { userEmail, userId } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userMachines, setUserMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const API_GET_USER_MACHINES = import.meta.env.VITE_API_GET_USER_MACHINES; 

  
  useEffect(() => {
    const fetchUserMachines = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError("");
        const response = await axios.get(`${API_GET_USER_MACHINES}?userId=${userId}`);
        if (response.data.success) {
          setUserMachines(response.data.machines);
        } else {
          setError("Failed to load machines");
        }
      } catch (error) {
        console.error("Error fetching user machines:", error);
        setError("Error fetching machines. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserMachines();
  }, [userId]); 

  const handleAddMachine = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleMachineAdded = (machine: Machine) => {
    setUserMachines((prevMachines) => [...prevMachines, machine]);
    setIsModalOpen(false);
  };

  if (!userId) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="home-page">
      <div className="top-bar">
        <div className="logo-section">
          <img src={Logo} alt="Agriservicelog logo" />
          <div className="app-name">Agriservicelog</div>
        </div>

        <div className="user-info">
          <div className="user-email">{userEmail || "Guest"}</div>
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
          {loading ? (
            <p>Loading machines...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : userMachines.length > 0 ? (
            <div className="machine-cards">
              {userMachines.map((machine) => (
                <div key={machine.id} className="machine-card">
                  <h3>{machine.model}</h3>
                  <p>Last service: 14/05/2025</p>
                  <p>Upcoming service: 14/10/2025</p>
                  <p>Latest hours done: 5500 hours</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No machines added yet. Click "Add Machine" to get started!</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <TractorModal
          onClose={handleCloseModal}
          onMachineAdded={handleMachineAdded}
          userId={userId}
        />
      )}
    </div>
  );
};

export default HomePage;

