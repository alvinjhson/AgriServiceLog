import React, { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import "./style.scss";
import Logo from "../../asset/test.png";
import TractorModal from "./serviceHistoryModal";

interface ServiceHistory {
  date: string;
  hours: number;
}

interface Machine {
  id: number;
  name: string;
  model: string;
  serialNumber: string;
  lastService: string;
  nextService: string;
  latestHours: number;
  serviceHistory: ServiceHistory[];
}

const HomePage: React.FC = () => {
  const { userEmail } = useContext(UserContext);
  const [selectedTractor, setSelectedTractor] = useState<Machine | null>(null);

  const mockTractors: Machine[] = [
    {
      id: 1,
      name: "Deutz 6215P",
      model: "6215P",
      serialNumber: "14129310410231",
      lastService: "14/05/2025",
      nextService: "14/10/2025",
      latestHours: 5500,
      serviceHistory: [
        { date: "14/05/2025", hours: 5500 },
        { date: "14/05/2024", hours: 4500 },
      ],
    },
    {
      id: 2,
      name: "Deutz 7250 TTV",
      model: "7250 TTV",
      serialNumber: "98371923847192",
      lastService: "20/08/2024",
      nextService: "20/02/2025",
      latestHours: 6200,
      serviceHistory: [
        { date: "20/08/2024", hours: 6200 },
        { date: "20/02/2024", hours: 5100 },
      ],
    },
  ];

  const handleOpenModal = (tractor: Machine) => {
    setSelectedTractor(tractor);
  };

  const handleCloseModal = () => {
    setSelectedTractor(null);
  };

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
        </div>

        <div className="machine-list-content">
          <div className="machine-cards">
            {mockTractors.map((machine) => (
              <div key={machine.id} className="machine-card" onClick={() => handleOpenModal(machine)}>
                <h3>{machine.name}</h3>
                <p>Last service: {machine.lastService}</p>
                <p>Upcoming service: {machine.nextService}</p>
                <p>Latest hours done: {machine.latestHours} hours</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedTractor && <TractorModal tractor={selectedTractor} onClose={handleCloseModal} />}
    </div>
  );
};

export default HomePage;

