import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/api';
import Swal from 'sweetalert2';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import "./Signup.css";

const signupSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters'),
    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    phoneNumber: Yup.string()
        .required('Phone number is required')
        .test('is-egypt-number', 'invalid Phone number ', value => {
            if (!value) return false;
            // Remove any non-digit characters
            const digitsOnly = value.replace(/\D/g, '');
            // Check if it's exactly 11 digits
            return digitsOnly.length === 11;
        }),
});

const PasswordRequirement = ({ met, text }) => (
    <div className={`password-requirement ${met ? 'met' : ''}`}>
        <span className="requirement-icon">{met ? '✓' : '○'}</span>
        <span className="requirement-text">{text}</span>
    </div>
);

const Signup = () => {
 const navigate = useNavigate();
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');

    const checkPasswordRequirement = (requirement) => {
        switch (requirement) {
            case 'length':
                return password.length >= 8;
            case 'uppercase':
                return /[A-Z]/.test(password);
            case 'lowercase':
                return /[a-z]/.test(password);
            case 'number':
                return /[0-9]/.test(password);
            case 'special':
                return /[!@#$%^&*]/.test(password);
            default:
                return false;
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setEmailError(''); // Clear any previous email errors
            const response = await authService.register(values);
            if (response.status === 'success') {
                await Swal.fire({
                    title: 'Registration Successful!',
                    html: `
                        <p>Please check your email to confirm your account.</p>
                    `,
                    icon: 'success',
                    showConfirmButton: true,
                    customClass: {
                        popup: 'animated fadeInDown'
                    }
                });

                navigate('/login');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.data?.message;
            if (errorMessage?.toLowerCase().includes('email')) {
                setEmailError(errorMessage);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: errorMessage || 'An error occurred during registration',
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            }
        } finally {
            setSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="image">
          <div className="imageContainer">
            <div className="socialProof"></div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-title">Create Your Account</h2>
                    <Formik
                        initialValues={{
                            firstName: '',
                            lastName: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                            phoneNumber: '',
                        }}
                        validationSchema={signupSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, setFieldValue, values }) => (
                            <Form className="signup-form">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <Field
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        className="form-input"
                                    />
                                    <ErrorMessage name="firstName" component="small" className="error" />
                                </div>

            <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <Field
                type="text" 
                                        id="lastName"
                                        name="lastName"
                                        className="form-input"
                                    />
                                    <ErrorMessage name="lastName" component="small" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
                                    <Field
                type="email" 
                id="email" 
                                        name="email"
                                        className={`form-input ${emailError ? 'error-input' : ''}`}
                                    />
                                    <ErrorMessage name="email" component="small" className="error" />
                                    {emailError && <small className="error">{emailError}</small>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <PhoneInput
                                        country={'eg'}
                                        value={values.phoneNumber}
                                        onChange={phone => {
                                            // Only allow exactly 11 digits for Egypt
                                            if (phone.length <= 11) {
                                                setFieldValue('phoneNumber', phone);
                                            }
                                        }}
                                        inputClass="form-input"
                                        containerClass="phone-input-container"
                                        buttonClass="phone-input-button"
                                        dropdownClass="phone-input-dropdown"
                                        searchClass="phone-input-search"
                                        enableSearch={true}
                                        searchPlaceholder="Search country..."
                                        inputProps={{
                                            name: 'phoneNumber',
                                            id: 'phoneNumber',
                                            required: true,
                                            maxLength: 16
                                        }}
                                        isValid={(value, country) => {
                                            if (country.countryCode === 'eg') {
                                                return value.length === 11;
                                            }
                                            return true;
                                        }}
                                        countryCodeEditable={false}
                                        preferredCountries={['eg']}
                                        onlyCountries={['eg']}
                                    />
                                    <ErrorMessage name="phoneNumber" component="small" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
                                    <Field
                type="password" 
                id="password" 
                                        name="password"
                                        className="form-input"
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setFieldValue('password', e.target.value);
                                        }}
                                    />
                                    <ErrorMessage name="password" component="small" className="error" />
                                    {/* <div className="password-requirements">
                                        <PasswordRequirement 
                                            met={checkPasswordRequirement('length')} 
                                            text="At least 8 characters"
                                        />
                                        <PasswordRequirement 
                                            met={checkPasswordRequirement('uppercase')} 
                                            text="At least one uppercase letter"
                                        />
                                        <PasswordRequirement 
                                            met={checkPasswordRequirement('lowercase')} 
                                            text="At least one lowercase letter"
                                        />
                                        <PasswordRequirement 
                                            met={checkPasswordRequirement('number')} 
                                            text="At least one number"
                                        />
                                        <PasswordRequirement 
                                            met={checkPasswordRequirement('special')} 
                                            text="At least one special character (!@#$%^&*)"
                                        />
                                    </div> */}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
                                    <Field
                type="password" 
                id="confirmPassword" 
                                        name="confirmPassword"
                                        className="form-input"
              />
                                    <ErrorMessage name="confirmPassword" component="small" className="error" />
            </div>

                                <button
                                    type="submit"
                                    className="signup-button"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                                </button>

                                <div className="linkk">
                                    Have an account? <Link className="login-link" to="/login">Login</Link>
            </div>

            <div className="divider">
              <span>Or Sign Up with</span>
            </div>

                                <button
                                    type="button"
                                    className="google-signup"
                                    onClick={() => authService.initiateGoogleLogin()}
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

export default Signup;

