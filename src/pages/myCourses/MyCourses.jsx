import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import CourseCard from '../Courses/CourseCard';
import api from '../../services/api';
import './MyCourses.css';
import { useDispatch } from 'react-redux';
import { setUser as setReduxUser } from '../../store/slices/authSlice';

const MyCourses = () => {
  const { user, refreshUser } = useUser();
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Refresh user state on mount (after payment redirect)
    const doRefresh = async () => {
      if (localStorage.getItem('refreshUserAfterPayment')) {
        await refreshUser();
        if (user) dispatch(setReduxUser(user));
        localStorage.removeItem('refreshUserAfterPayment');
      }
    };
    doRefresh();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      if (user && user.courses && user.courses.length > 0) {
        try {
          const response = await api.post('/courses/by-ids', { ids: user.courses });
          setCourses(response.data.data.courses);
        } catch (error) {
          setCourses([]);
        }
      }
      setLoading(false);
    };
    fetchCourses();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!courses.length) return <div>You have no courses yet.</div>;

  return (
    <div className="my-courses-page">
      <h2>My Courses</h2>
      <div className="courses-list">
        {courses.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default MyCourses; 