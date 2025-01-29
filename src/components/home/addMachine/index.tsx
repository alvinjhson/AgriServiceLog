import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.scss";

interface Tractor {
  id: number;
  name: string;
  model: string;
}

interface TractorModalProps {
  onClose: () => void; 
  onMachineAdded: (tractor: Tractor) => void; 
  userId: string; 
}

const TractorModal: React.FC<TractorModalProps> = ({ onClose, onMachineAdded, userId }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tractors, setTractors] = useState<Tractor[]>([]);
  const [filteredTractors, setFilteredTractors] = useState<Tractor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const API_MACHINES = import.meta.env.VITE_API_MACHINES;
  const API_MACHINE_USER = import.meta.env.VITE_API_MACHINE_USER; 


  useEffect(() => {
    const fetchTractors = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get<Tractor[]>(API_MACHINES);
        setTractors(response.data);
        setFilteredTractors(response.data);
      } catch (err) {
        setError("Failed to load tractors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTractors();
  }, []);

  const timestamp = new Date().toISOString();
 
  useEffect(() => {
    const results = tractors.filter((tractor) =>
      tractor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTractors(results);
  }, [searchQuery, tractors]);

  const handleSelectTractor = async (tractor: Tractor) => {
    try {
      const response = await axios.post(API_MACHINE_USER, {
        userId,
        machineId: tractor.id.toString(),
        timestamp, 
      });
  
      if (response.status === 200) {
        onMachineAdded(tractor); 
      } else {
        console.error("Failed to associate tractor with user");
      }
    } catch (error) {
      console.error("Error associating tractor with user:", error);
    } finally {
      onClose(); 
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Select a Tractor</h2>

        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loading && <p>Loading tractors...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <div className="tractor-list">
            {filteredTractors.map((tractor) => (
              <div
                key={tractor.id}
                className="tractor-item"
                onClick={() => handleSelectTractor(tractor)} 
              >
                <p>{tractor.name}</p>
                <small>{tractor.model}</small>
              </div>
            ))}
            {filteredTractors.length === 0 && <p>No tractors found</p>}
          </div>
        )}

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TractorModal;

