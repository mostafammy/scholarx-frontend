import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { programService } from '../../../../services/api';
import Swal from 'sweetalert2';
import './AmbassadorModal.css';

const AmbassadorModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    motivation: '',
    promotionPlan: '',
    experience: '',
    questions: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await programService.submitAmbassadorApplication(formData);
      
      if (response.status === 'success') {
        await Swal.fire({
          title: 'Application Submitted!',
          html: `
            <p>Thank you for applying to become a ScholarX Ambassador!</p>
            <p>We have sent a confirmation email with your application details.</p>
            <p>We will review your application and get back to you soon.</p>
          `,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        
        onClose();
        navigate('/services'); 
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.data?.message || 'Failed to submit application. Please try again.',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Ambassador Program Application</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="program-description">
            <p>
              We empower students to become ScholarX Ambassadors in their universities and schools. Ambassadors serve as 
              leaders in their communities, spreading awareness about scholarships, mentoring peers, and organizing events that 
              connect students with life-changing opportunities.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-groupp">
              <label htmlFor="motivation">What motivates you to become a ScholarX Ambassador?</label>
              <textarea 
                id="motivation" 
                name="motivation" 
                value={formData.motivation}
                onChange={handleChange}
                required
                // minLength={100}
                placeholder="Tell us why you want to become an ambassador and what drives you..."
              />
            </div>

            <div className="form-groupp">
              <label htmlFor="promotionPlan">How would you promote scholarship opportunities within your school or university?</label>
              <textarea 
                id="promotionPlan" 
                name="promotionPlan" 
                value={formData.promotionPlan}
                onChange={handleChange}
                required
                // minLength={100}
                placeholder="Describe your strategy for promoting scholarships..."
              />
            </div>

            <div className="form-groupp">
              <label htmlFor="experience">Do you have any previous experience in leadership, mentoring, or event organization?</label>
              <textarea 
                id="experience" 
                name="experience" 
                value={formData.experience}
                onChange={handleChange}
                required
                // minLength={100}
                placeholder="Share your relevant experience..."
              />
            </div>

            <div className="form-groupp">
              <label htmlFor="questions">How would you handle questions or concerns from students about scholarship applications?</label>
              <textarea 
                id="questions" 
                name="questions" 
                value={formData.questions}
                onChange={handleChange}
                required
                // minLength={100}
                placeholder="Explain your approach to helping students..."
              />
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorModal;