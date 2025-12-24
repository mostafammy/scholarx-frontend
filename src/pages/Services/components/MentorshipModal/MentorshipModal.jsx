import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { programService } from '../../../../services/api';
import Swal from 'sweetalert2';
import './MentorshipModal.css';

const MentorshipModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    goal: '',
    area: '',
    expectations: '',
    availability: ''
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
      const response = await programService.submitMentorshipRequest(formData);
      
      if (response.status === 'success') {
        await Swal.fire({
          title: 'Request Submitted!',
          html: `
            <p>Thank you for requesting a mentor!</p>
            <p>We have sent a confirmation email with your request details.</p>
            <p>We will review your request and match you with a suitable mentor soon.</p>
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
        text: error.response?.data?.data?.message || 'Failed to submit request. Please try again.',
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
          <h2>Request a Mentor</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="program-description">
            <p>
              Our mentorship program connects you with experienced professionals who can guide you through 
              scholarship applications, essay writing, interviews, and career planning. Get personalized 
              advice and support from mentors who've been in your shoes.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-groupp">
              <label htmlFor="goal">What are your main goals for seeking mentorship?</label>
              <textarea 
                id="goal" 
                name="goal" 
                value={formData.goal}
                onChange={handleChange}
                placeholder="E.g., Scholarship applications, career guidance, interview preparation..."
                required
                // minLength={100}
              />
            </div>

            <div className="form-groupp">
              <label htmlFor="area">What specific area or field are you interested in?</label>
              <textarea 
                id="area" 
                name="area" 
                value={formData.area}
                onChange={handleChange}
                placeholder="E.g., Engineering, Medicine, Business, Computer Science..."
                required
                // minLength={50}
              />
            </div>

            <div className="form-groupp">
              <label htmlFor="expectations">What do you expect to gain from this mentorship?</label>
              <textarea 
                id="expectations" 
                name="expectations" 
                value={formData.expectations}
                onChange={handleChange}
                placeholder="E.g., Industry insights, application review, career advice..."
                required
                // minLength={100}
              />
            </div>

            <div className="form-groupp">
              <label htmlFor="availability">What is your availability for mentorship sessions?</label>
              <textarea 
                id="availability" 
                name="availability" 
                value={formData.availability}
                onChange={handleChange}
                placeholder="E.g., Weekday evenings, weekend afternoons..."
                required
                // minLength={50}
              />
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorshipModal;