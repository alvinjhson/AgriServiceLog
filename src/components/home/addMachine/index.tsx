import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.scss";

interface Tractor {
  id: number;
  name: string;
  model: string;
}

interface TractorModalProps {
  onClose: () => void; // Function to close the modal
}

const TractorModal: React.FC<TractorModalProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tractors, setTractors] = useState<Tractor[]>([]);
  const [filteredTractors, setFilteredTractors] = useState<Tractor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch tractors from the API
  useEffect(() => {
    const fetchTractors = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get<Tractor[]>("https://j0bgnztiza.execute-api.eu-north-1.amazonaws.com/machinery");
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

  // Filter tractors based on search query
  useEffect(() => {
    const results = tractors.filter((tractor) =>
      tractor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTractors(results);
  }, [searchQuery, tractors]);

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
              <div key={tractor.id} className="tractor-item">
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

