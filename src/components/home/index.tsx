import React, { useState, useContext } from "react";
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
    return <p>You must be logged in to add machines.</p>; 
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
          {userMachines.length > 0 ? (
            <ul>
              {userMachines.map((machine) => (
                <li key={machine.id}>
                  {machine.name} - {machine.model}
                </li>
              ))}
            </ul>
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
