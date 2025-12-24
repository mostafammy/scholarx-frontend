import React from 'react';
import './MentorshipModal.css';
import { FaPencilAlt } from 'react-icons/fa';
import { FaGraduationCap } from 'react-icons/fa';
import { BsBriefcase } from 'react-icons/bs';
import { BsChatDots } from 'react-icons/bs';

const MentorshipModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="mentorship-modal">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>&times;</button>
          
          <div className="services-grid">
            <div className="service-item">
              <div className="service-icon essay-icon">
                <FaPencilAlt />
              </div>
              <h4>Personal Statement & Essay Writing</h4>
              <p>Get expert guidance on crafting compelling essays</p>
            </div>
            
            <div className="service-item">
              <div className="service-icon career-icon">
                <BsBriefcase />
              </div>
              <h4>Career Planning</h4>
              <p>Strategic guidance for your professional development</p>
            </div>
            
            <div className="service-item">
              <div className="service-icon scholarship-icon">
                <FaGraduationCap />
              </div>
              <h4>Scholarship & University Selection</h4>
              <p>Find the perfect match for your academic journey</p>
            </div>
            
            <div className="service-item">
              <div className="service-icon interview-icon">
                <BsChatDots />
              </div>
              <h4>Interview Coaching</h4>
              <p>Prepare for success with mock interviews</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-groupp">
              <label htmlFor="goals">What are your academic and career goals, and how can mentorship help you achieve them?</label>
              <textarea 
                id="goals" 
                name="goals" 
                rows="4" 
                required
              />
            </div>

            <div className="form-groupp">
              <label>Which areas do you need the most support in?</label>
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input type="checkbox" id="essay" name="supportAreas" value="Essay Writing" />
                  <label htmlFor="essay">Essay Writing</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="career" name="supportAreas" value="Career Planning" />
                  <label htmlFor="career">Career Planning</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="interviews" name="supportAreas" value="Interviews" />
                  <label htmlFor="interviews">Interviews</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="university" name="supportAreas" value="University Selection" />
                  <label htmlFor="university">University Selection</label>
                </div>
              </div>
            </div>

            <div className="form-groupp">
              <label htmlFor="experience">Have you previously received any mentorship or career guidance? If yes, what was your experience?</label>
              <textarea 
                id="experience" 
                name="experience" 
                rows="4" 
                required
              />
            </div>

            <div className="form-groupp">
              <label htmlFor="expectations">What do you hope to gain from being matched with a mentor in your field?</label>
              <textarea 
                id="expectations" 
                name="expectations" 
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

export default MentorshipModal; 