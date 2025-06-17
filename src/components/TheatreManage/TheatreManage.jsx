import React, { useState, useEffect } from "react";
import "./TheatreManage.css";
import axios from "axios";

function TheatreManage() {
  const [theatreData, setTheatreData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [popup, setPopup] = useState({ type: null, data: null });
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchTheatres = async () => {
          setLoading(true)
          setError(null);
          try{
             const response = await axios.get('https://0735-2402-4000-2300-2930-744c-1b57-deb8-3da0.ngrok-free.app/api/theatres/with-screens');
             setTheatreData(response.data)
          }
          catch(err){
               setError(err.message);
          }
          finally{
              setLoading(false)
          }
      };
       fetchTheatres();
    }, []);

    const handleAddTheatre = async (newTheatre) => {
          setLoading(true)
          setError(null);
      try {
        const response = await axios.post("http://localhost:27017/api/theatres", newTheatre);
         setTheatreData((prevData) => [...prevData, response.data]);
         setPopup({ type: null, data: null });
      } catch (error) {
          setError(error.message)
      }
      finally{
          setLoading(false)
      }
    };

    const handleAddScreen = async (newScreen) => {
         setLoading(true)
         setError(null);
      try {
        const response = await axios.post("http://localhost:27017/api/screens", newScreen);
         // Update theatreData to reflect newly added screen.
        const updatedTheatreData = theatreData.map(theatre => {
            if(theatre._id === newScreen.theatreId){
                return {...theatre, screens: [...(theatre.screens || []), response.data]}
            }
           return theatre;
       })
        setTheatreData(updatedTheatreData)
         setPopup({ type: null, data: null });
      } catch (error) {
          setError(error.message)
      }
      finally{
           setLoading(false);
      }
    };


    const deleteTheatre = async(theatreId) =>{
        setLoading(true)
         setError(null);
        try{
           await axios.delete(`http://localhost:27017/api/theatres/${theatreId}`)
          setTheatreData((prevData) => prevData.filter((t) => t._id !== theatreId))
        }
        catch(err){
            setError(err.message);
        }
       finally{
          setLoading(false)
       }
    }


    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTheatres = theatreData.slice(
      startIndex,
      startIndex + itemsPerPage
    );
     const totalPages = Math.ceil(theatreData.length / itemsPerPage);


   if(loading){
       return <p>Loading....</p>
   }

    if (error) {
       return <p>Error: {error}</p>;
      }

    return (
      <div className="theater-page">
        <div className="theatre-container">
          <div className="theatre-header">
            <h2>Theatre Management</h2>
            <div className="button-container">
              <button
                className="button add-theatre"
                onClick={() => setPopup({ type: "addTheatre", data: null })}
              >
                Add Theatre
              </button>
              <button
                className="button add-screen"
                onClick={() => setPopup({ type: "addScreen", data: null })}
              >
                Add Screen
              </button>
            </div>
          </div>
          <div className="tm-table-wrapper">
            <table className="theatre-table">
              <thead>
                <tr>
                  <th>Theatre Name</th>
                  <th>Screen & Formats</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentTheatres.length > 0 ? (
                  currentTheatres.map((theatre) => (
                    <tr key={theatre._id}>
                      <td>{theatre.location}</td>
                       <td>
                        {theatre.screens && theatre.screens.length > 0 ? (
                          <ul>
                            {theatre.screens.map((screen, index) => (
                              <li key={index}>
                                Screen {screen.screenNumber}: {screen.format} (
                                {screen.rowCount} Rows x {screen.seatPerRow} Seats)
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "No Screens"
                        )}
                      </td>
                      <td>{theatre.location}</td>
                      <td>
                        <span className="action-icons">
                          <button
                            className="delete-icon"
                             onClick={() => deleteTheatre(theatre._id)}
                          >
                            ❌
                          </button>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No Theatres Added Yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="page-button"
            >
              {"<"}
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="page-button"
            >
              {">"}
            </button>
          </div>

          {popup.type === "addTheatre" && (
            <AddTheatrePopup
              onSubmit={handleAddTheatre}
              onClose={() => setPopup({ type: null, data: null })}
            />
          )}
          {popup.type === "addScreen" && (
            <AddScreenPopup
              theatres={theatreData}
              onSubmit={handleAddScreen}
              onClose={() => setPopup({ type: null, data: null })}
            />
          )}
        </div>
      </div>
    );
  }

  function AddTheatrePopup({ onSubmit, onClose }) {
    const [formData, setFormData] = useState({
      location: "",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="popup">
        <div className="popup-content">
          <h3>Add Theatre</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Location:
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </label>
            <div className="popup-buttons">
              <button type="button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  function AddScreenPopup({ theatres, onSubmit, onClose }) {
    const [formData, setFormData] = useState({
      theatreId: "",
      screenNumber: "",
      format: "",
      rowCount: "",
      seatPerRow: "",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      await onSubmit(formData);
    };

    return (
      <div className="popup">
        <div className="popup-content">
          <h3>Add Screen</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Theatre:
              <select
                name="theatreId"
                value={formData.theatreId}
                onChange={handleChange}
                required
              >
                <option value="">Select a Theatre</option>
                {theatres.map((theatre) => (
                  <option key={theatre._id} value={theatre._id}>
                    {theatre.location}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-row">
              <label>
                Screen Number:
                <input
                  type="text"
                  name="screenNumber"
                  value={formData.screenNumber}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Format:
                <input
                  type="text"
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Row Count:
                <input
                  type="number"
                  name="rowCount"
                  value={formData.rowCount}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Seat Per Row:
                <input
                  type="number"
                  name="seatPerRow"
                  value={formData.seatPerRow}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="popup-buttons">
              <button type="button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  export default TheatreManage;