import React from 'react';
import './Courses.css';

const CourseCardSkeleton = () => {
  return (
    <div className="card h-100 shadow-sm">
      <div className="position-relative">
        <div className="card-img-top skeleton-image" style={{height: '180px'}}></div>
      </div>
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="skeleton-badge"></div>
          <div className="skeleton-badge"></div>
        </div>
        <div className="skeleton-title mb-2"></div>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="skeleton-button"></div>
          <div className="skeleton-price"></div>
        </div>
        <div className="d-flex align-items-center mb-2">
          <div className="skeleton-rating"></div>
        </div>
        <div className="d-flex align-items-center justify-content-between mt-4">
          <div className="skeleton-instructor"></div>
          <div className="skeleton-details"></div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton; 