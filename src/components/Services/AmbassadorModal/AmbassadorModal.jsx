import React from 'react';
import './AmbassadorModal.css';

const AmbassadorModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="ambassador-modal">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>&times;</button>
          
          <div className="modal-description">
            <p>
              We empower students to become ScholarX Ambassadors in their universities and schools. 
              Ambassadors serve as leaders in their communities, spreading awareness about scholarships, 
              mentoring peers, and organizing events that connect students with life-changing opportunities.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-groupp">
              <label htmlFor="motivation">What motivates you to become a ScholarX Ambassador?</label>
              <textarea 
                id="motivation" 
                name="motivation" 
                rows="4" 
                required
              />
            </div>

            <div className="form-groupp">
              <label htmlFor="promotion">How would you promote scholarship opportunities within your school or university?</label>
              <textarea 
                id="promotion" 
                name="promotion" 
                rows="4" 
                required
              />
            </div>

            <div className="form-groupp">
              <label htmlFor="experience">Do you have any previous experience in leadership, mentoring, or event organization?</label>
              <textarea 
                id="experience" 
                name="experience" 
                rows="4" 
                required
              />
            </div>

            <div className="form-groupp">
              <label htmlFor="questions">How would you handle questions or concerns from students about scholarship applications?</label>
              <textarea 
                id="questions" 
                name="questions" 
                rows="4" 
                required
              />
            </div>

            <button type="submit" className="submit-button">Submit Application</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorModal; 