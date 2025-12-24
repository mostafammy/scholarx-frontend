import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../../store/slices/adminSlice";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useUser } from "../../../context/UserContext";
import { setUser as setReduxUser } from "../../../store/slices/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAdmin } = useSelector((state) => state.auth);
  const { dashboardStats, loading, error } = useSelector(
    (state) => state.admin
  );
  const { user, refreshUser } = useUser();

  useEffect(() => {
    // Refresh user state on mount (after admin change)
    const doRefresh = async () => {
      await refreshUser();
      if (user) dispatch(setReduxUser(user));
    };
    doRefresh();
  }, []);

  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/4b8c686f-b237-4ff5-a74e-1c2aac42233b", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H5",
        location: "Dashboard.jsx:useEffect",
        message: "Dashboard auth gate",
        data: { isAdmin },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    if (!isAdmin) {
      navigate("/");
      return;
    }
    dispatch(fetchDashboardStats());
  }, [dispatch, isAdmin, navigate]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!dashboardStats) return <div className="error">No data available</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{dashboardStats?.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Courses</h3>
          <p>{dashboardStats?.totalCourses || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${dashboardStats?.totalRevenue?.toFixed(2) || "0.00"}</p>
        </div>
        <div className="stat-card">
          <h3>Active Subscriptions</h3>
          <p>{dashboardStats?.activeSubscriptions || 0}</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button onClick={() => navigate("/admin/users")}>Manage Users</button>
          <button onClick={() => navigate("/admin/courses")}>
            Manage Courses
          </button>
          <button onClick={() => navigate("/admin/subscriptions")}>
            View Subscriptions
          </button>
          {/* <button onClick={() => navigate('/admin/reports')}>View Reports</button> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
