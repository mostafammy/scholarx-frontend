import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css';
import CourseCards from '../../components/CourseCards/CourseCards';

function SearchResults() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setError('write something!');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.API_URL}/courses/search?searchTerm=${encodeURIComponent(query)}`
        );
        setCourses(response.data.data);
        
        if (response.data.data.length === 0) {
          setError('course not found');
        }
      } catch (err) {
        setError('some thing went wrong');
        console.error('Frontend error:', err); 
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="search-results">
      <h1 className="results-title">Results</h1>
      {loading && <p className="loading">Loading ....</p>}
      {error && <p className="error">{error}</p>}
      <div className="results-grid">
        {courses.map((course) => (
          <CourseCards key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default SearchResults;