import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  googleLogin,
  clearError,
  setUser as setReduxUser,
} from "../../store/slices/authSlice";
import {
  setSuccess,
  setError,
  clearMessages,
} from "../../store/slices/uiSlice";
import Swal from "sweetalert2";
import "./Login.css";
import { useUser } from "../../context/UserContext";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const { success } = useSelector((state) => state.ui);
  const { login: userContextLogin, refreshUser, user } = useUser();

  useEffect(() => {
    // Clear any existing messages
    dispatch(clearMessages());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      Swal.fire({
        title: "Success!",
        text: "Login successful!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        customClass: {
          popup: "animated fadeInDown",
        },
      });
      navigate("/");
    }
  }, [success, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(login(values)).unwrap();
      // Always refresh user from backend to get latest info
      const refreshed = await refreshUser();
      if (
        refreshed &&
        refreshed.status === "success" &&
        refreshed.data &&
        refreshed.data.user
      ) {
        // Update both Redux and UserContext with the latest user
        dispatch(setReduxUser(refreshed.data.user));
        userContextLogin(refreshed.data.user);
      }
      dispatch(setSuccess("Login successful!"));
    } catch (err) {
      // Ensure error message is a string for display
      const errorMessage =
        typeof err === "string"
          ? err
          : err?.message || "An error occurred during login. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#0d6efd",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    const baseApiUrl =
      import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    const googleAuthUrl = `${baseApiUrl}/users/google`;

    window.location.href = googleAuthUrl;
    console.log(googleAuthUrl);
    console.log(`${baseApiUrl} is used for Google login`);
  };

  return (
    <div className="login-container">
      {/* <div className="login-header">
                <img src="/ScholarX-Logo.png" alt="Logo" className="logo-img" />
            </div> */}
      <div className="login-content">
        <div className="image">
          <div className="imageContainer">
            <div className="socialProof"></div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-title">Login to Your Account</h2>
          {/* {error && <div className="error-message">{error}</div>} */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="login-form">
                <div className="form-group1">
                  <label htmlFor="email">Email address</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="email"
                    component="small"
                    className="error"
                  />
                </div>

                <div className="form-group1">
                  <label htmlFor="password">Password</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="password"
                    component="small"
                    className="error"
                  />
                </div>

                <div className="form-options">
                  <div className="remember-me">
                    <Field type="checkbox" id="remember" name="remember" />
                    <span>Remember me</span>
                  </div>
                  <Link to="/forget-password" className="forgot-password">
                    Forgot your password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="login-button"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? "Signing in..." : "Sign In"}
                </button>

                <div className="signup-link">
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </div>

                <div className="divider">
                  <span>Or Sign up with</span>
                </div>

                <button
                  type="button"
                  className="google-signup"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <img src="/google.png" alt="Google" className="google-icon" />
                  Continue with Google
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
