import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/api';
import './PasswordUpdate.css';

const PasswordUpdate = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please confirm your password')
  });

  const handleSubmit = async (values, { setStatus, setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const response = await authService.updatePassword(
        values.currentPassword,
        values.newPassword
      );
      
      if (response.status === 'success') {
        setStatus({ success: 'Password updated successfully!' });
        // Clear form
        values.currentPassword = '';
        values.newPassword = '';
        values.confirmPassword = '';
        // Call success callback if provided
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      } else {
        setStatus({ error: response.message || 'Failed to update password' });
      }
    } catch (error) {
      setStatus({ 
        error: error?.response?.data?.message || 
               error?.message || 
               'Failed to update password' 
      });
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="sx-password-update-container">
      <h3>Change Password</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ status, isSubmitting: formikSubmitting }) => (
          <Form className="sx-password-update-form">
            <div className="sx-password-field">
              <label htmlFor="currentPassword">Current Password</label>
              <Field
                name="currentPassword"
                type="password"
                id="currentPassword"
                placeholder="Enter your current password"
              />
              <ErrorMessage name="currentPassword" component="div" className="sx-password-error" />
            </div>

            <div className="sx-password-field">
              <label htmlFor="newPassword">New Password</label>
              <Field
                name="newPassword"
                type="password"
                id="newPassword"
                placeholder="Enter your new password"
              />
              <ErrorMessage name="newPassword" component="div" className="sx-password-error" />
            </div>

            <div className="sx-password-field">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <Field
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                placeholder="Confirm your new password"
              />
              <ErrorMessage name="confirmPassword" component="div" className="sx-password-error" />
            </div>

            <div className="sx-password-actions">
              <button 
                type="submit" 
                disabled={isSubmitting || formikSubmitting}
                className="sx-password-save-btn"
              >
                {isSubmitting || formikSubmitting ? 'Updating...' : 'Update Password'}
              </button>
              
              {onCancel && (
                <button 
                  type="button" 
                  onClick={onCancel}
                  className="sx-password-cancel-btn"
                  disabled={isSubmitting || formikSubmitting}
                >
                  Cancel
                </button>
              )}
            </div>

            {status && status.success && (
              <div className="sx-password-success">{status.success}</div>
            )}
            {status && status.error && (
              <div className="sx-password-error">{status.error}</div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PasswordUpdate;
