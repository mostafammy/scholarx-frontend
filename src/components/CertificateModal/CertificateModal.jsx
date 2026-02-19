import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import api from "../../services/api";
import { formatDate } from "../../utils/dateUtils";

const CertificateModal = ({ isOpen, onClose, certificateData }) => {
  const overlayRef = useRef(null);
  const canvasRef = useRef(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !certificateData) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";

    const renderFallback = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#1a365d";
      ctx.textAlign = "center";
      ctx.font = 'bold 40px "Times New Roman", serif';
      ctx.fillText("Certificate", canvas.width / 2, canvas.height / 2 - 40);
      ctx.font = '24px "Times New Roman", serif';
      ctx.fillText(
        certificateData?.studentName || "ScholarX Student",
        canvas.width / 2,
        canvas.height / 2 + 20,
      );
    };

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // --- Dynamic text overlays ---
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Student Name — prominent, centered
      ctx.fillStyle = "#5a5c6b";
      ctx.font = 'bold 36px "Helvetica", "Arial", sans-serif';
      ctx.fillText(
        certificateData.studentName,
        canvas.width / 2,
        canvas.height * 0.46,
      );

      // Completion Date — near the signature line
      ctx.fillStyle = "#737373";
      ctx.font = '14px "Helvetica", "Arial", sans-serif';
      ctx.fillText(
        formatDate(certificateData.completedAt),
        canvas.width / 2,
        canvas.height * 0.78,
      );

      // Certificate ID — small text near bottom
      ctx.fillStyle = "#a0a0a0";
      ctx.font = '11px "Helvetica", "Arial", sans-serif';
      ctx.fillText(
        `Certificate ID: ${certificateData.certificateId}`,
        canvas.width / 2,
        canvas.height * 0.9,
      );

      // Verification URL — below Certificate ID
      ctx.fillStyle = "#6b7280";
      ctx.font = '11px "Helvetica", "Arial", sans-serif';
      const verifyUrl = `${window.location.origin}/verify/${certificateData.certificateId}`;
      ctx.fillText(
        `Verify at: ${verifyUrl}`,
        canvas.width / 2,
        canvas.height * 0.93,
      );
    };

    img.onerror = renderFallback;
    img.src = "/certificate-template.svg";
  }, [isOpen, certificateData]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !certificateData) {
    return null;
  }

  const handleDownload = () => {
    if (!canvasRef.current) {
      return;
    }
    const link = document.createElement("a");
    const sanitizedStudent = (certificateData.studentName || "student").replace(
      /\s+/g,
      "_",
    );
    const sanitizedCourse = (certificateData.courseName || "course").replace(
      /\s+/g,
      "_",
    );
    link.download = `Certificate_${sanitizedStudent}_${sanitizedCourse}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleDownloadPdf = async () => {
    if (!certificateData?.courseId) {
      console.error("Course ID not available for PDF download");
      return;
    }

    setPdfLoading(true);
    try {
      const response = await api.get(
        `/certificates/${certificateData.courseId}/download`,
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      const sanitizedStudent = (
        certificateData.studentName || "student"
      ).replace(/\s+/g, "_");
      link.href = url;
      link.download = `ScholarX_Certificate_${sanitizedStudent}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      // Fallback to PNG if PDF fails
      handleDownload();
    } finally {
      setPdfLoading(false);
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target === overlayRef.current) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="certificate-modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div
        className="certificate-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Course completion certificate"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="certificate-modal-close" onClick={onClose}>
          ✕
        </button>
        <h2>Your Certificate</h2>
        <p className="certificate-modal-subtitle">
          Congratulations {certificateData.studentName}! Download or share your
          achievement.
        </p>
        <div className="certificate-canvas-wrapper">
          <canvas ref={canvasRef} width={1200} height={900} />
        </div>
        <div className="certificate-modal-actions">
          <button
            className="certificate-modal-action"
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
          >
            {pdfLoading ? "⏳ Generating..." : "📄 Download PDF"}
          </button>
          <button
            className="certificate-modal-secondary"
            onClick={handleDownload}
            title="Download as image"
          >
            🖼️ Download PNG
          </button>
          <button className="certificate-modal-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

CertificateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  certificateData: PropTypes.shape({
    studentName: PropTypes.string,
    courseName: PropTypes.string,
    courseId: PropTypes.string, // Required for PDF download
    completedAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    certificateId: PropTypes.string,
    completionPercentage: PropTypes.number,
  }),
};

CertificateModal.defaultProps = {
  certificateData: null,
};

export default CertificateModal;
