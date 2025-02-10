import React from "react";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWrench } from "@fortawesome/free-solid-svg-icons";

interface ServiceHistory {
  date: string;
  hours: number;
}

interface Tractor {
  id: number;
  name: string;
  model: string;
  serialNumber: string;
  lastService: string;
  nextService: string;
  latestHours: number;
  serviceHistory: ServiceHistory[];
}

interface TractorModalProps {
  onClose: () => void;
  tractor: Tractor;
}

const TractorModal: React.FC<TractorModalProps> = ({ onClose, tractor }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{tractor.name} - {tractor.model}</h2>
        <p><strong>Last Service:</strong> {tractor.lastService}</p>
        <p><strong>Upcoming Service:</strong> {tractor.nextService}</p>
        <p><strong>Latest Hours Done:</strong> {tractor.latestHours} hours</p>
        <p><strong>Serial Number:</strong> {tractor.serialNumber}</p>

        <table className="service-history">
          <thead>
            <tr>
              <th>Date</th>
              <th>Hours</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tractor.serviceHistory.map((service, index) => (
              <tr key={index}>
                <td>{service.date}</td>
                <td>{service.hours} hours</td>
                <td>
                  <FontAwesomeIcon icon={faWrench} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TractorModal;
