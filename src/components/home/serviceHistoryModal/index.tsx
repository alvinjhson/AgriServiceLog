// import React, { useState } from "react";
// import axios from "axios";
// import "./style.scss";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faWrench } from "@fortawesome/free-solid-svg-icons";

// interface ServiceHistory {
//   date: string;
//   hours: number;
// }

// interface Tractor {
//     userMachineId: string; 
//     name: string;
//     model: string;
//     serialNumber: string;
//     lastService: string;
//     nextService: string;
//     latestHours: number;
//     serviceHistory: ServiceHistory[];
//   }
  
//   interface TractorModalProps {
//     onClose: () => void;
//     tractor: Tractor;
//     userId: string;
//   }
  
//   const TractorModal: React.FC<TractorModalProps> = ({ onClose, tractor, userId }) => {
//     const [lastService, setLastService] = useState<string>(tractor.lastService);
//     const [nextService, setNextService] = useState<string>(tractor.nextService);
//     const [isEditing, setIsEditing] = useState<string | null>(null);
//     const API_UPDATE_SERVICE = import.meta.env.VITE_API_UPDATE_SERVICE;
  
//     const handleEditClick = (field: "lastService" | "nextService") => {
//         setIsEditing(field);  // Set the field being edited
//       };
      
//       const handleChange = (event: React.ChangeEvent<HTMLInputElement>, field: "lastService" | "nextService") => {
//         if (field === "lastService") {
//           setLastService(event.target.value);
//         } else if (field === "nextService") {
//           setNextService(event.target.value);
//         }
//       };
  
//       const handleBlur = async (field: "lastService" | "nextService") => {
//         setIsEditing(null); // Reset editing state after finishing
      
//         if (!tractor.userMachineId) {
//           console.error("Error: userMachineId is undefined.");
//           return;
//         }
      
//         try {
//           // Create the data object dynamically based on the field
//           const data = {
//             userId,
//             userMachineId: tractor.userMachineId,
//             [field]: field === "lastService" ? lastService : nextService,
//           };
      
//           const response = await axios.put(API_UPDATE_SERVICE, data);
      
//           if (response.data.success) {
//             console.log("Service date updated successfully!");
//           } else {
//             console.error("Failed to update service date");
//           }
//         } catch (error) {
//           console.error("Error updating service date:", error);
//         }
//       };
      
  
//     return (
//       <div className="modal-backdrop">
//         <div className="modal">
//           <h2>
//             {tractor.name} - {tractor.model}
//           </h2>
  
//           <p>
//   <strong>Last Service:</strong>{" "}
//   {isEditing === "lastService" ? (
//     <input
//       type="date"
//       value={lastService}
//       onChange={(e) => setLastService(e.target.value)}
//       onBlur={() => handleBlur("lastService")} // Pass the field name
//       autoFocus
//     />
//   ) : (
//     <span onClick={() => handleEditClick("lastService")} className="editable">
//       {lastService}
//     </span>
//   )}
// </p>

// <p>
//   <strong>Upcoming Service:</strong>{" "}
//   {isEditing === "nextService" ? (
//     <input
//       type="date"
//       value={nextService}
//       onChange={(e) => setNextService(e.target.value)}
//       onBlur={() => handleBlur("nextService")} // Pass the field name
//       autoFocus
//     />
//   ) : (
//     <span onClick={() => handleEditClick("nextService")} className="editable">
//       {nextService}
//     </span>
//   )}
// </p>


//           <table className="service-history">
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Hours</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tractor.serviceHistory.map((service, index) => (
//                 <tr key={index}>
//                   <td>{service.date}</td>
//                   <td>{service.hours} hours</td>
//                   <td>
//                     <FontAwesomeIcon icon={faWrench} />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
  
//           <button className="close-btn" onClick={onClose}>
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   };
  
//   export default TractorModal;
  
import React, { useState } from "react";
import axios from "axios";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWrench, faPlus } from "@fortawesome/free-solid-svg-icons";
import type { Tractor,ServiceHistory,ChecklistItem  } from "@agriservicelog/types";


interface TractorModalProps {
  onClose: () => void;
  tractor: Tractor;
  userId: string;
}

const TractorModal: React.FC<TractorModalProps> = ({ onClose, tractor, userId }) => {
  const [lastService, setLastService] = useState<string>(tractor.lastService);
  const [nextService, setNextService] = useState<string>(tractor.nextService);
  const [showServiceForm, setShowServiceForm] = useState<boolean>(false);
  const [serviceHours, setServiceHours] = useState<number>(0);
  const [serviceDate, setServiceDate] = useState<string>("");
  const [serviceHistory, setServiceHistory] = useState<ServiceHistory[]>(tractor.serviceHistory);
  const [isEditing, setIsEditing] = useState<"lastService" | "nextService" | null>(null);


  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { label: "Felkoderkontroll", checked: false, notes: "" },
    { label: "Smörjpunkter", checked: false, notes: "" },
    { label: "Oljeservice", checked: false, notes: "" },
    { label: "Rekond i hytten", checked: false, notes: "" },
    { label: "Utvändig tvätt", checked: false, notes: "" },
  ]);

  const API_UPDATE_SERVICE = import.meta.env.VITE_API_UPDATE_SERVICE;

  const handleCheckboxChange = (index: number) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].checked = !updatedChecklist[index].checked;
    setChecklist(updatedChecklist);
  };

  const handleNotesChange = (index: number, value: string) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].notes = value;
    setChecklist(updatedChecklist);
  };

  const handleSaveEntry = async () => {
    const newEntry: ServiceHistory = {
      date: serviceDate,
      hours: serviceHours,
      checklist,
    };


      

    setServiceHistory([...serviceHistory, newEntry]);


    // Update last service and next service dates
    setLastService(serviceDate);
    const nextServiceDate = new Date(serviceDate);
    nextServiceDate.setMonth(nextServiceDate.getMonth() + 2); // Example: next service after 2 months
    setNextService(nextServiceDate.toISOString().split("T")[0]);

    setShowServiceForm(false);

    try {
      const response = await axios.post(API_UPDATE_SERVICE, {
        userId,
        userMachineId: tractor.userMachineId,
        lastService: serviceDate,
        nextService: nextServiceDate.toISOString().split("T")[0],
        serviceHours,
        checklist,
      });

      if (response.data.success) {
        console.log("Service data saved successfully!");
      } else {
        console.error("Failed to save service data");
      }
    } catch (error) {
      console.error("Error saving service data:", error);
    }
  };

  const handleEditClick = (field: "lastService" | "nextService") => {
    setIsEditing(field);
  };
  
  const handleBlur = async (field: "lastService" | "nextService") => {
    setIsEditing(null);
  
    try {
      await axios.post(API_UPDATE_SERVICE, {
        userId,
        userMachineId: tractor.userMachineId,
        lastService,
        nextService,
      });
      console.log("Updated service dates");
    } catch (error) {
      console.error("Failed to update service dates:", error);
    }
  };


  const handleCancelEntry = () => {
    setServiceDate("");
    setServiceHours(0);
    setShowServiceForm(false);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{tractor.name} - {tractor.model}</h2>

        
     <p>
   <strong>Last Service:</strong>{" "}
  {isEditing === "lastService" ? (
    <input
      type="date"
      value={lastService}
      onChange={(e) => setLastService(e.target.value)}
      onBlur={() => handleBlur("lastService")} // Pass the field name
      autoFocus
    />
  ) : (
    <span onClick={() => handleEditClick("lastService")} className="editable">
      {lastService}
    </span>
  )}
</p>

<p>
  <strong>Upcoming Service:</strong>{" "}
  {isEditing === "nextService" ? (
    <input
      type="date"
      value={nextService}
      onChange={(e) => setNextService(e.target.value)}
      onBlur={() => handleBlur("nextService")} // Pass the field name
      autoFocus
    />
  ) : (
    <span onClick={() => handleEditClick("nextService")} className="editable">
      {nextService}
    </span>
  )}
</p>

        <div className="service-history-header">
          <h3>Service History</h3>
          <button className="add-btn" onClick={() => setShowServiceForm(true)}>
            <FontAwesomeIcon icon={faPlus} /> Add Service Entry
          </button>
        </div>

        {showServiceForm && (
          <div className="service-form">
            <h4>New Service Entry</h4>
            <label>Servicetimmar (Service Hours):</label>
            <input
              type="number"
              value={serviceHours}
              onChange={(e) => setServiceHours(Number(e.target.value))}
            />

            <label>Service Date:</label>
            <input
              type="date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
            />

            <h4>Checklist</h4>
            {checklist.map((item, index) => (
              <div key={index} className="checklist-item">
                <label>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  {item.label}
                </label>
                <input
                  type="text"
                  placeholder="Notes/Comments"
                  value={item.notes}
                  onChange={(e) => handleNotesChange(index, e.target.value)}
                />
              </div>
            ))}

            <div className="entry-buttons">
              <button onClick={handleSaveEntry} className="save-btn">Save</button>
              <button onClick={handleCancelEntry} className="cancel-btn">Cancel</button>
            </div>
          </div>
        )}

        <table className="service-history">
          <tbody>
            {serviceHistory.map((service, index) => (
              <tr key={index}>
                <td>{service.date}</td>
                <td>{service.hours} hours</td>
                <td>{service.checklist.map(item => item.checked ? `${item.label}, ` : "").join("")}</td>
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


