import React, { useState } from 'react';
import './PodcastModal.css';
import { FaSpotify, FaApple, FaGoogle, FaYoutube } from 'react-icons/fa';

const PodcastModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission for podcast subscription
    console.log('Podcast subscription submitted:', email);
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container podcast-modal">
        <div className="modal-header">
          <h2>ScholarX Podcast</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="program-description">
            <p>
              The ScholarX Podcast features conversations with scholarship recipients, education experts, 
              and industry professionals who share their insights, experiences, and advice on navigating 
              the scholarship application process and building a successful career.
            </p>
          </div>

          <div className="podcast-platforms">
            <h3>Listen on your favorite platform</h3>
            <div className="platform-buttons">
              <a href="#" className="platform-button spotify">
                <FaSpotify /> Spotify
              </a>
              <a href="#" className="platform-button apple">
                <FaApple /> Apple Podcasts
              </a>
              <a href="#" className="platform-button google">
                <FaGoogle /> Google Podcasts
              </a>
              <a href="#" className="platform-button youtube">
                <FaYoutube /> YouTube
              </a>
            </div>
          </div>

          <div className="podcast-subscribe">
            <h3>Get notified about new episodes</h3>
            <form onSubmit={handleSubmit}>
              <div className="subscribe-form">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="subscribe-button">
                  {subscribed ? "Subscribed!" : "Subscribe"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastModal;