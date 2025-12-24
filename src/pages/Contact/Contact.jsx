import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import { BsTelephone } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import styles from './Contact.module.css';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  message: Yup.string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters')
});

const Contact = () => {
  const [succes, SetSucces] = useState(false);
  const [failed, SetFailed] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      SetSucces(true);
      resetForm();
      
      setTimeout(() => {
        SetSucces(false);
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      SetFailed(true);
      
      setTimeout(() => {
        SetFailed(false);
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="py-5">
        <div className="text-center mb-5">
          <h2 className={styles.header}>Get in Touch</h2>
          <p className="text-muted fw-bold">We'd love to hear from you. Please fill out this form or reach out via social media.</p>
        </div>

        <div className="row d-flex justify-content-evenly">
          <div className={`col-10 col-md-4 p-4 mb-4 ${styles.contactContainer}`}>
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                message: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName" className={styles.formLabel}>
                      First Name <span className={styles.required}>*</span>
                    </label>
                    <Field
                      type="text"
                      id="firstName"
                      name="firstName"
                      className={styles.formInput}
                      placeholder="Enter your first name"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="span"
                      className={styles.errorMessage}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="lastName" className={styles.formLabel}>
                      Last Name <span className={styles.required}>*</span>
                    </label>
                    <Field
                      type="text"
                      id="lastName"
                      name="lastName"
                      className={styles.formInput}
                      placeholder="Enter your last name"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="span"
                      className={styles.errorMessage}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.formLabel}>
                      Email Address <span className={styles.required}>*</span>
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className={styles.formInput}
                      placeholder="Enter your email"
                    />
                    <ErrorMessage
                      name="email"
                      component="span"
                      className={styles.errorMessage}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.formLabel}>
                      Message <span className={styles.required}>*</span>
                    </label>
                    <Field
                      as="textarea"
                      id="message"
                      name="message"
                      className={styles.formInput}
                      rows="4"
                      placeholder="Your message here..."
                    />
                    <ErrorMessage
                      name="message"
                      component="span"
                      className={styles.errorMessage}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>

                  {succes && (
                    <div className={styles.notification}>
                      <div className={`${styles.notificationContent} ${styles.success}`}>
                        Message sent successfully! ✓
                      </div>
                    </div>
                  )}
                  {failed && (
                    <div className={styles.notification}>
                      <div className={`${styles.notificationContent} ${styles.error}`}>
                        Failed to send message! ✕
                      </div>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>

          <div className={`col-10 col-md-4 p-4 mb-4 ${styles.contactContainer}`}>

            <h2 className="mb-4">Contact Information</h2>
            
            <div className={styles.infoItem}>
              <BsTelephone className={styles.icon} />
              <a 
                href="tel:+201012072516" 
                className={styles.phoneLink}
              >
                +(20) 1012072516
              </a>
            </div>

            <div className={`${styles.infoItem} mb-5`}>
              <MdEmail className={styles.icon} />
              <a 
                href="mailto:Info@scholar-x.com" 
                className={styles.emailLink}
              >
                Info@scholar-x.com
              </a>
            </div>

            <div className="mb-5">
              <h5 className="mb-3 fw-bolder">Follow Us</h5>
              <div className={styles.socialLinks}>
                <a href="https://www.facebook.com/@ScholarX.eg" target="_blank"  className={styles.socialLink}><FaFacebook size={25} /></a>
                <a href="https://twitter.com/scholarx" target="_blank"  className={styles.socialLink}><FaTwitter size={25} /></a>
                <a href="https://www.instagram.com/scholarx.eg" target="_blank"  className={styles.socialLink}><FaInstagram size={25} /></a>
                <a href="https://www.linkedin.com/company/bosla0" target="_blank"className={styles.socialLink}><FaLinkedin size={25} /></a>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;

