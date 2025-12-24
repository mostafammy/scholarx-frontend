import React from 'react';
import { useState } from 'react';

import { FaStar, FaRegStar } from 'react-icons/fa';
import courseData from './CourseData';
import './CourseInfo.css';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { useUser } from '../../context/UserContext';
import BlockedUserMessage from '../../components/BlockedUserMessage/BlockedUserMessage';
import Swal from 'sweetalert2';

function CoursePage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user } = useUser();

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="star" />);
      } else if (i - rating < 1) {
        stars.push(<FaStar key={i} className="star half" />);
      } else {
        stars.push(<FaRegStar key={i} className="star" />);
      }
    }
    return stars;
  };

  const handleEnroll = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking enroll
    try {
      setIsLoading(true);
      
      // Check if user is blocked
      if (user && user.isBlocked) {
        Swal.fire({
          title: 'Account Blocked',
          text: 'Your account has been blocked. Please contact support for assistance.',
          icon: 'error',
          confirmButtonText: 'Contact Support'
        }).then(() => {
          window.location.href = 'mailto:support@scholarx.com';
        });
        return;
      }
      
      // Check if user is logged in
      if (!authService.isAuthenticated()) {
        Swal.fire({
          title: 'Login Required',
          text: 'Please login to enroll in this course',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Login',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
        return;
      }

      // Initiate payment
      const response = await authService.createPayment(courseId);
      
      if (response.data.status === 'success' && response.data.data.paymentUrl) {
        // Set flag for post-payment refresh
        localStorage.setItem('refreshUserAfterPayment', '1');
        // Redirect to payment page
        window.location.href = response.data.data.paymentUrl;
      } else {
        throw new Error('Failed to create payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Swal.fire({
        title: 'Payment Error',
        text: error.response?.data?.message || 'Failed to process payment',
        icon: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is blocked and show blocked message
  if (user && user.isBlocked) {
    return (
      <BlockedUserMessage 
        blockReason={user.blockReason}
        blockedAt={user.blockedAt}
      />
    );
  }

  return (
    <>
      <div className="course-container">
        <div
          className="course-header"
          style={{
            backgroundImage: `url("${courseData.headerImage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '570px',
            position: 'relative',
          }}
        >
          <img src="/Grouplogo.png" alt="Overlay" className="overlay-image" />
          <div className="overlaytext">
            <h1 className="course-title">{courseData.title}</h1>
            <p className="course-tagline">{courseData.tagline}</p>

            <div className="course-rating">
              {renderStars(courseData.rating)}
              <span className="rating-count">({courseData.totalRatings}/50)</span>
            </div>

            <button className="enroll-button" onClick={handleEnroll}>
              {isLoading ? 'Processing...' : 'Enroll Now'}
            </button>
          </div>
          <div className="course-stats">
            <div className="stat-item">
              <img src="/video-play.png" alt="Videos" className="stat-icon" />
              
              <div className="stat-info">
                <span className="stat-number">{courseData.videosCount}</span>
                <span className="stat-label">Videos</span>
              </div>
            </div>
            <div className="stat-item">
              <img src="/document-copy.png" alt="Quizzes" className="stat-icon" />
              <div className="stat-info">
                <span className="stat-number">{courseData.quizzesCount}</span>
                <span className="stat-label">Quizzes</span>
              </div>
            </div>
            <div className="stat-item">
              <img src="/edit.png" alt="PDFs" className="stat-icon" />
              <div className="stat-info">
                <span className="stat-number">{courseData.pdfCount}</span>
                <span className="stat-label">PDFs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="course-section course-description-section">
          <div className="section-header">
            <img src="/course-description.png" alt="Course Icon" className="section-icon" />
            <h2 className="section-title">Course Description</h2>
          </div>
          <p className="course-description">{courseData.description}</p>
        </div>

        <div className="course-section">
          <div className="section-header">
            <img src="/learn.png" alt="Learn Icon" className="section-icon" />
            <h2 className="section-title">What You'll Learn</h2>
          </div>
          <ul className="learning-list">
            {courseData.WhatYouWillLearn && courseData.WhatYouWillLearn.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="course-section">
          <div className="section-header">
            <img src="/target.png" alt="Target Icon" className="section-icon" />
            <h2 className="section-title">Target Audience</h2>
          </div>
          <ul className="audience-list">
            {courseData.targetAudience && courseData.targetAudience.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default CoursePage;
