import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="error-code">404</h1>
                <h2 className="error-title">Page Not Found</h2>
                <p className="error-message">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="action-buttons">
                    <Link to="/" className="btn btn-primary home-btn">
                        Go to Homepage
                    </Link>
                    <button 
                        onClick={() => window.history.back()} 
                        className="btn btn-outline-primary back-btn"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound; 