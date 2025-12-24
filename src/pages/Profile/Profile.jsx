import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import defaultAvatar from '../../assets/Images/image.png';
import './Profile.css';
import { useUser } from '../../context/UserContext';
import { authService } from '../../services/api';
import PasswordUpdate from '../../components/PasswordUpdate/PasswordUpdate';
import ForgotPasswordModal from '../../components/ForgotPasswordModal/ForgotPasswordModal';
import { getUserAvatarUrl } from '../../utils/imageUtils';

const Profile = () => {
  const { user, setUser, loading } = useUser();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const initialImage = getUserAvatarUrl(user, defaultAvatar);
  const [preview, setPreview] = useState(initialImage);
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  const initialValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    image: user?.image?.url || '',
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phoneNumber: Yup.string(),
    // Email is not editable
  });

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue('image', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const formData = new FormData();
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('phoneNumber', values.phoneNumber);
      if (values.image) {
        formData.append('image', values.image);
      }
      const response = await authService.updateProfile(formData);
      if (response.status === 'success') {
        setUser(response.data.user);
        // Update preview to new image from backend
        const newImage = getUserAvatarUrl(response.data.user, defaultAvatar);
        setPreview(newImage);
        setStatus({ success: 'Profile updated successfully!' });
      } else {
        setStatus({ error: response.message || 'Failed to update profile' });
      }
    } catch (error) {
      setStatus({ error: error?.message || 'Failed to update profile' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sx-profile-container">
      <h2>My Profile</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, isSubmitting, status }) => (
          <Form className="sx-profile-form">
            <div className="sx-profile-avatar-section">
              <img src={preview} alt="Profile" className="sx-profile-avatar" />
              <label className="sx-profile-upload-btn">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => handleImageChange(e, setFieldValue)}
                />
              </label>
            </div>
            <div className="sx-profile-fields">
              <label>First Name</label>
              <Field name="firstName" type="text" />
              <ErrorMessage name="firstName" component="div" className="sx-profile-error" />

              <label>Last Name</label>
              <Field name="lastName" type="text" />
              <ErrorMessage name="lastName" component="div" className="sx-profile-error" />

              <label>Email</label>
              <Field name="email" type="email" disabled />

              <label>Phone Number</label>
              <Field name="phoneNumber" type="text" />
              <ErrorMessage name="phoneNumber" component="div" className="sx-profile-error" />
            </div>
            <div className="sx-profile-actions">
              <button type="submit" disabled={isSubmitting || loading} className="sx-profile-save-btn">
                {isSubmitting || loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowPasswordUpdate(!showPasswordUpdate)}
                className="sx-profile-password-btn"
                disabled={isSubmitting || loading}
              >
                {showPasswordUpdate ? 'Cancel Password Change' : 'Change Password'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowForgotPassword(true)}
                className="sx-profile-forgot-password-btn"
                disabled={isSubmitting || loading}
              >
                Forgot Password?
              </button>
            </div>
            {status && status.success && <div className="sx-profile-success">{status.success}</div>}
            {status && status.error && <div className="sx-profile-error">{status.error}</div>}
          </Form>
        )}
      </Formik>
      
      {showPasswordUpdate && (
        <PasswordUpdate 
          onSuccess={() => setShowPasswordUpdate(false)}
          onCancel={() => setShowPasswordUpdate(false)}
        />
      )}
      
      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        userEmail={user?.email}
      />
    </div>
  );
};

export default Profile; 