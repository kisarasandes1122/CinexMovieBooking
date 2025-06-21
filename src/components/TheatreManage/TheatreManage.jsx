import React, { useState, useEffect } from "react";
import "./TheatreManage.css";
import { apiService } from "../../utils/axios";
import { handleApiError } from "../../utils/errorHandler";

function TheatreManage() {
  const [theatreData, setTheatreData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [popup, setPopup] = useState({ type: null, data: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;

  useEffect(() => {
      const fetchTheatres = async () => {
          setLoading(true)
          setError(null);
          try{
             const response = await apiService.theatres.getWithScreens();
             setTheatreData(response.data)
          }
          catch(err){
               const errorMessage = handleApiError(err, 'Failed to fetch theatres');
               setError(errorMessage);
          }
          finally{
              setLoading(false)
          }
      };
       fetchTheatres();
    }, []);

    const handleAddTheatre = async (newTheatre) => {
          setSubmitting(true)
          setError(null);
      try {
        const response = await apiService.theatres.create(newTheatre);
         setTheatreData((prevData) => [...prevData, response.data]);
         setPopup({ type: null, data: null });
      } catch (error) {
          const errorMessage = handleApiError(error, 'Failed to add theatre');
          setError(errorMessage);
      }
      finally{
          setSubmitting(false)
      }
    };

    const handleAddScreen = async (newScreen) => {
         setSubmitting(true)
         setError(null);
      try {
        const response = await apiService.screens.create(newScreen);
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
          const errorMessage = handleApiError(error, 'Failed to add screen');
          setError(errorMessage);
      }
      finally{
           setSubmitting(false);
      }
    };

    const deleteTheatre = async(theatreId) =>{
        if (!window.confirm('Are you sure you want to delete this theatre? This will also delete all associated screens.')) {
            return;
        }
        
        setLoading(true)
         setError(null);
        try{
           await apiService.theatres.delete(theatreId);
          setTheatreData((prevData) => prevData.filter((t) => t._id !== theatreId))
        }
        catch(err){
            const errorMessage = handleApiError(err, 'Failed to delete theatre');
            setError(errorMessage);
        }
       finally{
          setLoading(false)
       }
    }

    const filteredTheatres = theatreData.filter(theatre =>
      theatre.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTheatres = filteredTheatres.slice(
      startIndex,
      startIndex + itemsPerPage
    );
     const totalPages = Math.ceil(filteredTheatres.length / itemsPerPage);

   if(loading){
       return (
           <div className="tm-loading-container">
               <div className="tm-loading-spinner"></div>
               <p>Loading theatres...</p>
           </div>
       );
   }

    if (error && !popup.type) {
       return (
           <div className="tm-error-container">
               <div className="tm-error-icon">⚠️</div>
               <h2>Error Loading Data</h2>
               <p>{error}</p>
               <button onClick={() => window.location.reload()} className="tm-retry-btn">
                   Retry
               </button>
           </div>
       );
      }

    return (
      <div className="tm-container">
        <div className="tm-header">
          <div className="tm-header-content">
            <h1>Theatre Management</h1>
            <p>Manage theatres and screens</p>
          </div>
          <div className="tm-actions">
            <button
              className="tm-add-btn"
              onClick={() => setPopup({ type: "addTheatre", data: null })}
            >
              <span className="tm-btn-icon">🏛️</span>
              Add Theatre
            </button>
            <button
              className="tm-add-btn secondary"
              onClick={() => setPopup({ type: "addScreen", data: null })}
            >
              <span className="tm-btn-icon">📺</span>
              Add Screen
            </button>
          </div>
        </div>

        <div className="tm-search-container">
          <div className="tm-search-wrapper">
            <span className="tm-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search theatres by location..."
              className="tm-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="tm-content">
          <div className="tm-table-header">
            <h2>Theatre List ({filteredTheatres.length})</h2>
          </div>

          {currentTheatres.length === 0 ? (
            <div className="tm-empty-state">
              <div className="tm-empty-icon">🏛️</div>
              <h3>No Theatres Found</h3>
              <p>{searchTerm ? 'No theatres match your search criteria' : 'Start by adding your first theatre'}</p>
            </div>
          ) : (
            <>
              <div className="tm-table-container">
                <table className="tm-table">
                  <thead>
                    <tr>
                      <th>Theatre Location</th>
                      <th>Screens & Details</th>
                      <th>Total Capacity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTheatres.map((theatre) => {
                      const totalCapacity = theatre.screens?.reduce((total, screen) => 
                        total + (screen.rowCount * screen.seatPerRow), 0) || 0;
                      
                      return (
                        <tr key={theatre._id}>
                          <td className="tm-location-cell">
                            <div className="tm-location-info">
                              <span className="tm-location-name">{theatre.location}</span>
                              <span className="tm-location-badge">
                                {theatre.screens?.length || 0} Screen{theatre.screens?.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </td>
                          <td className="tm-screens-cell">
                            {theatre.screens && theatre.screens.length > 0 ? (
                              <div className="tm-screens-list">
                                {theatre.screens.map((screen, index) => (
                                  <div key={index} className="tm-screen-item">
                                    <span className="tm-screen-number">Screen {screen.screenNumber}</span>
                                    <span className="tm-screen-format">{screen.format}</span>
                                    <span className="tm-screen-capacity">
                                      {screen.rowCount}×{screen.seatPerRow} ({screen.rowCount * screen.seatPerRow} seats)
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="tm-no-screens">No screens configured</span>
                            )}
                          </td>
                          <td>
                            <span className="tm-capacity-badge">
                              {totalCapacity} seats
                            </span>
                          </td>
                          <td>
                            <button
                              className="tm-delete-btn"
                              onClick={() => deleteTheatre(theatre._id)}
                              title="Delete theatre"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="tm-pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="tm-page-btn"
                  >
                    ← Previous
                  </button>
                  <span className="tm-page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="tm-page-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {popup.type === "addTheatre" && (
          <AddTheatrePopup
            onSubmit={handleAddTheatre}
            onClose={() => setPopup({ type: null, data: null })}
            submitting={submitting}
            error={error}
          />
        )}
        {popup.type === "addScreen" && (
          <AddScreenPopup
            theatres={theatreData}
            onSubmit={handleAddScreen}
            onClose={() => setPopup({ type: null, data: null })}
            submitting={submitting}
            error={error}
          />
        )}
      </div>
    );
  }

  function AddTheatrePopup({ onSubmit, onClose, submitting, error }) {
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
      <div className="tm-modal-overlay">
        <div className="tm-modal-content">
          <div className="tm-modal-header">
            <h2>Add New Theatre</h2>
            <button className="tm-modal-close" onClick={onClose}>×</button>
          </div>

          {error && (
            <div className="tm-error-message">
              <span className="tm-error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="tm-form">
            <div className="tm-form-group">
              <label className="tm-label">Theatre Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="tm-input"
                placeholder="Enter theatre location"
                required
              />
            </div>

            <div className="tm-form-actions">
              <button 
                type="button" 
                onClick={onClose}
                className="tm-cancel-btn"
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="tm-save-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="tm-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="tm-btn-icon">💾</span>
                    Save Theatre
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  function AddScreenPopup({ theatres, onSubmit, onClose, submitting, error }) {
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
      <div className="tm-modal-overlay">
        <div className="tm-modal-content">
          <div className="tm-modal-header">
            <h2>Add New Screen</h2>
            <button className="tm-modal-close" onClick={onClose}>×</button>
          </div>

          {error && (
            <div className="tm-error-message">
              <span className="tm-error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="tm-form">
            <div className="tm-form-group">
              <label className="tm-label">Theatre *</label>
              <select
                name="theatreId"
                value={formData.theatreId}
                onChange={handleChange}
                className="tm-select"
                required
              >
                <option value="">Select a Theatre</option>
                {theatres.map((theatre) => (
                  <option key={theatre._id} value={theatre._id}>
                    {theatre.location}
                  </option>
                ))}
              </select>
            </div>

            <div className="tm-form-row">
              <div className="tm-form-group">
                <label className="tm-label">Screen Number *</label>
                <input
                  type="text"
                  name="screenNumber"
                  value={formData.screenNumber}
                  onChange={handleChange}
                  className="tm-input"
                  placeholder="e.g., 1, 2, 3"
                  required
                />
              </div>
              <div className="tm-form-group">
                <label className="tm-label">Format *</label>
                <input
                  type="text"
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  className="tm-input"
                  placeholder="e.g., 2D, 3D, IMAX"
                  required
                />
              </div>
            </div>

            <div className="tm-form-row">
              <div className="tm-form-group">
                <label className="tm-label">Row Count *</label>
                <input
                  type="number"
                  min="1"
                  name="rowCount"
                  value={formData.rowCount}
                  onChange={handleChange}
                  className="tm-input"
                  placeholder="Number of rows"
                  required
                />
              </div>
              <div className="tm-form-group">
                <label className="tm-label">Seats Per Row *</label>
                <input
                  type="number"
                  min="1"
                  name="seatPerRow"
                  value={formData.seatPerRow}
                  onChange={handleChange}
                  className="tm-input"
                  placeholder="Seats per row"
                  required
                />
              </div>
            </div>

            <div className="tm-capacity-preview">
              {formData.rowCount && formData.seatPerRow && (
                <div className="tm-capacity-info">
                  <span className="tm-capacity-label">Total Capacity:</span>
                  <span className="tm-capacity-value">
                    {formData.rowCount * formData.seatPerRow} seats
                  </span>
                </div>
              )}
            </div>

            <div className="tm-form-actions">
              <button 
                type="button" 
                onClick={onClose}
                className="tm-cancel-btn"
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="tm-save-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="tm-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="tm-btn-icon">💾</span>
                    Save Screen
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  export default TheatreManage;