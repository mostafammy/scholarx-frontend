import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports } from '../../../store/slices/adminSlice';
import './Reports.css';

const Reports = () => {
    const dispatch = useDispatch();
    const { reports, loading, error } = useSelector((state) => state.admin);
    const [reportType, setReportType] = useState('revenue');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            dispatch(fetchReports({
                type: reportType,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            }));
        }
    }, [dispatch, reportType, dateRange]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-reports">
            <h1>Reports & Analytics</h1>

            <div className="report-controls">
                <div className="report-type">
                    <label>Report Type:</label>
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="revenue">Revenue Report</option>
                        <option value="users">User Report</option>
                        <option value="courses">Course Report</option>
                    </select>
                </div>

                <div className="date-range">
                    <div className="form-group">
                        <label>Start Date:</label>
                        <input
                            type="date"
                            name="startDate"
                            value={dateRange.startDate}
                            onChange={handleDateChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>End Date:</label>
                        <input
                            type="date"
                            name="endDate"
                            value={dateRange.endDate}
                            onChange={handleDateChange}
                        />
                    </div>
                </div>
            </div>

            <div className="report-content">
                {reportType === 'revenue' && reports.revenue && (
                    <div className="revenue-report">
                        <h2>Revenue Report</h2>
                        <div className="report-card">
                            <h3>Total Revenue</h3>
                            <p className="amount">${reports.revenue.revenue}</p>
                        </div>
                    </div>
                )}

                {reportType === 'users' && reports.users && (
                    <div className="user-report">
                        <h2>User Report</h2>
                        <div className="report-grid">
                            <div className="report-card">
                                <h3>Total Users</h3>
                                <p className="number">{reports.users.totalUsers}</p>
                            </div>
                            <div className="report-card">
                                <h3>Active Users</h3>
                                <p className="number">{reports.users.activeUsers}</p>
                            </div>
                            <div className="report-card">
                                <h3>New Users (Last 30 Days)</h3>
                                <p className="number">{reports.users.newUsers}</p>
                            </div>
                        </div>
                    </div>
                )}

                {reportType === 'courses' && reports.courses && (
                    <div className="course-report">
                        <h2>Course Report</h2>
                        <div className="report-grid">
                            <div className="report-card">
                                <h3>Total Courses</h3>
                                <p className="number">{reports.courses.totalCourses}</p>
                            </div>
                            <div className="report-card">
                                <h3>Active Courses</h3>
                                <p className="number">{reports.courses.activeCourses}</p>
                            </div>
                        </div>

                        <div className="popular-courses">
                            <h3>Popular Courses</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Course Title</th>
                                        <th>Enrollments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.courses.popularCourses.map(course => (
                                        <tr key={course._id}>
                                            <td data-label="Course Title">{course.title}</td>
                                            <td data-label="Enrollments">{course.enrollments}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports; 