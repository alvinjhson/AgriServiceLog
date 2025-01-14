import React from 'react';
import './style.scss';
//import Logo from '../../asset/logo.png';



interface HomePageProps {
  userEmail: string;
}

const HomePage: React.FC<HomePageProps> = ({ userEmail }) => {
  const handleAddMachine = () => {
    
    console.log("Add Machine button clicked!");
  };

  return (
    <div className="home-page">
      <div className="top-bar">
        <div className="logo-section">
          {/* //<img src={Logo} alt="Agriservicelog logo" /> */}
          <div className="app-name">Agriservicelog</div>
        </div>

        <div className="user-info">
          <div className="user-email">{userEmail}</div>
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
          <p>machine data </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
