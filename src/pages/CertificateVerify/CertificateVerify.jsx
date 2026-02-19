import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { formatDate } from "../../utils/dateUtils";
import styles from "./CertificateVerify.module.css";

/**
 * Public Certificate Verification Page
 * Allows anyone to verify the authenticity of a ScholarX certificate
 * No authentication required
 */
const CertificateVerify = () => {
  const { certificateId } = useParams();
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyCertificate = async () => {
      if (!certificateId) {
        setError("No certificate ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/certificates/verify/${certificateId}`);
        setVerificationResult(response.data.data.verification);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to verify certificate. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };

    verifyCertificate();
  }, [certificateId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>
          <div className={styles.spinner}></div>
          <h2>Verifying Certificate...</h2>
          <p>Please wait while we verify this certificate.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>❌</div>
          <h2>Verification Error</h2>
          <p>{error}</p>
          <Link to="/" className={styles.homeLink}>
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.verificationCard}>
        {verificationResult?.valid ? (
          <>
            <div className={styles.validBadge}>
              <span className={styles.checkIcon}>✓</span>
              <span>VERIFIED</span>
            </div>
            <h1 className={styles.title}>Certificate is Valid</h1>
            <p className={styles.subtitle}>
              This certificate has been verified as authentic and was issued by
              ScholarX.
            </p>

            <div className={styles.certificateDetails}>
              <div className={styles.detailRow}>
                <span className={styles.label}>Certificate ID</span>
                <span className={styles.value}>
                  {verificationResult.certificateId}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Recipient</span>
                <span className={styles.value}>
                  {verificationResult.studentName}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Course</span>
                <span className={styles.value}>
                  {verificationResult.courseName}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Completion Date</span>
                <span className={styles.value}>
                  {formatDate(verificationResult.completedAt)}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Completion Rate</span>
                <span className={styles.value}>
                  {verificationResult.completionPercentage}%
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.invalidBadge}>
              <span className={styles.xIcon}>✕</span>
              <span>NOT FOUND</span>
            </div>
            <h1 className={styles.title}>Certificate Not Found</h1>
            <p className={styles.subtitle}>
              We could not find a certificate with the ID:{" "}
              <strong>{certificateId}</strong>
            </p>
            <p className={styles.helpText}>
              Please check the certificate ID and try again. If you believe this
              is an error, please contact support.
            </p>
          </>
        )}

        <div className={styles.footer}>
          <Link to="/" className={styles.homeLink}>
            Visit ScholarX
          </Link>
          <Link to="/courses" className={styles.coursesLink}>
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerify;
