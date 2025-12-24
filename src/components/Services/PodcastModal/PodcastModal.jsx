import React from 'react';
import './PodcastModal.css';
import { FaPlay } from 'react-icons/fa';

const PodcastModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const episodes = [
    {
      id: 1,
      number: 23,
      title: 'From Scholar to CEO',
      description: "Listen to Sarah Chen's journey from scholarship recipient to successful entrepreneur.",
      host: "Sarah Chen"
    },
    {
      id: 2,
      number: 22,
      title: 'Global Opportunities',
      description: "Discover international scholarship opportunities with Dr. James Wilson.",
      host: "Dr. James Wilson"
    }
  ];

  const handleListen = (episodeId) => {
    // Handle play episode logic here
  };

  return (
    <div className="modal-overlay">
      <div className="podcast-modal">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>&times;</button>
          
          <div className="podcast-episodes">
            {episodes.map(episode => (
              <div key={episode.id} className="episode-card">
                <div className="episode-header">
                  <div className="episode-icon">
                    <span className="wave-icon">🎤</span>
                  </div>
                  <div className="episode-title">
                    <h4>Episode {episode.number}: {episode.title}</h4>
                  </div>
                </div>
                
                <div className="episode-description">
                  <p>{episode.description}</p>
                </div>
                
                <button 
                  className="listen-button" 
                  onClick={() => handleListen(episode.id)}
                >
                  <FaPlay className="play-icon" /> Listen Now
                </button>
              </div>
            ))}
          </div>
          
          <div className="podcast-info">
            <h3>ScholarX Podcast</h3>
            <p>
              Join us for inspiring conversations with scholarship recipients, educational experts, 
              and successful alumni. Get practical advice for your academic journey and connect with 
              a community of like-minded individuals.
            </p>
            <p>
              New episodes are released every Monday. Subscribe to our podcast on 
              Spotify, Apple Podcasts, or your favorite podcast platform to stay updated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastModal; 