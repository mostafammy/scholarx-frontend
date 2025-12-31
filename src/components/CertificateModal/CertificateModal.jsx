import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const CertificateModal = ({ isOpen, onClose, certificateData }) => {
  const overlayRef = useRef(null);
  const canvasRef = useRef(null);

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
        canvas.height / 2 + 20
      );
    };

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#1a365d";
      ctx.font = 'bold 48px "Times New Roman", serif';
      ctx.fillText(
        certificateData.studentName,
        canvas.width / 2,
        canvas.height * 0.55
      );

      ctx.font = '20px "Times New Roman", serif';
      ctx.fillText(
        certificateData.courseName,
        canvas.width / 2 + 50,
        canvas.height * 0.65
      );

      ctx.textAlign = "left";
      ctx.font = '20px "Times New Roman", serif';
      ctx.fillText(
        new Date(certificateData.completedAt || Date.now()).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        ),
        canvas.width * 0.3,
        canvas.height * 0.88
      );
    };

    img.onerror = renderFallback;
    img.src = "/certificate-template.png";
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
      "_"
    );
    const sanitizedCourse = (certificateData.courseName || "course").replace(
      /\s+/g,
      "_"
    );
    link.download = `Certificate_${sanitizedStudent}_${sanitizedCourse}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
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
          <button className="certificate-modal-action" onClick={handleDownload}>
            📥 Download Certificate
          </button>
          <button className="certificate-modal-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CertificateModal;
