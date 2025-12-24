import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';
import { CiSearch } from "react-icons/ci";
import { CiSquareChevDown } from "react-icons/ci";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/courses/search?title=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
  return (
    <div className="search-container">
      <div className="text-content">
        <span className="courses-span">Courses</span>
        <h1 className="discover-heading">Discover Our Courses</h1>
        <p className="description">Scholarships, Mentorship & Skill Development Opportunities</p>
      </div>

      <form onSubmit={handleSearch} className="search-bar">
        <div className="input-group">
          <label htmlFor="course-name-1">Course name</label>
          <div className="input-wrapper">
            <CiSearch className="icon-left" />
            <input
              type="text"
              id="course-name-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by course title"
              className="search-input"
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="course-name-2">Category</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="course-name-2"
              placeholder="Select category"
              className="search-input"
              disabled
            />
            <CiSquareChevDown className="icon-right" />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="course-name-3">Price Range</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="course-name-3"
              placeholder="Select price range"
              className="search-input"
              disabled
            />
            <CiSquareChevDown className="icon-right" />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="course-name-4">Duration</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="course-name-4"
              placeholder="Select duration"
              className="search-input"
              disabled
            />
            <CiSquareChevDown className="icon-right" />
          </div>
        </div>

        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;