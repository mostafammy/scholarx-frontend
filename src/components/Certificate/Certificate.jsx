import React, { useRef, useEffect, useState } from "react";
import styles from "./Certificate.module.css";
import api from "../../services/api";
import { formatDate } from "../../utils/dateUtils";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker using react-pdf's version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Certificate = ({ certificate, course, useTemplate = false }) => {
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfError, setPdfError] = useState(false);
  const [pageWidth, setPageWidth] = useState(0);

  // Fetch PDF from server for preview
  const fetchPdfPreview = async () => {
    const courseId = certificate?.courseId || course?._id;
    if (!courseId) {
      setPdfError(true);
      return;
    }

    setPdfLoading(true);
    try {
      const response = await api.get(`/certificates/${courseId}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(response.data);
      setPdfUrl(url);
      setImageLoaded(true);
    } catch (error) {
      console.error("Failed to load PDF preview:", error);
      setPdfError(true);
    } finally {
      setPdfLoading(false);
    }
  };

  // Generate certificate as actual image using Canvas (fallback)
  const generateCertificateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Set canvas size to match the SVG template aspect ratio (A4 landscape)
    canvas.width = 1123;
    canvas.height = 794;

    // Load the SVG template image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Draw the SVG template as background
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // --- Dynamic text overlays ---
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Student Name — prominent, centered
      ctx.fillStyle = "#5a5c6b";
      ctx.font = 'bold 36px "Helvetica", "Arial", sans-serif';
      ctx.fillText(
        certificate.studentName,
        canvas.width / 2,
        canvas.height * 0.46,
      );

      // Completion Date — near the signature line
      ctx.fillStyle = "#737373";
      ctx.font = '14px "Helvetica", "Arial", sans-serif';
      ctx.fillText(
        formatDate(certificate.completedAt),
        canvas.width / 2,
        canvas.height * 0.78,
      );

      // Certificate ID — small text near bottom
      ctx.fillStyle = "#a0a0a0";
      ctx.font = '11px "Helvetica", "Arial", sans-serif';
      ctx.fillText(
        `Certificate ID: ${certificate.certificateId}`,
        canvas.width / 2,
        canvas.height * 0.9,
      );

      // Verification URL — below Certificate ID
      ctx.fillStyle = "#6b7280";
      ctx.font = '11px "Helvetica", "Arial", sans-serif';
      const verifyUrl = `${window.location.origin}/verify/${certificate.certificateId}`;
      ctx.fillText(
        `Verify at: ${verifyUrl}`,
        canvas.width / 2,
        canvas.height * 0.93,
      );

      setImageLoaded(true);
    };
    img.src = "/certificate-template.svg";
  };

  useEffect(() => {
    if (useTemplate) {
      // Try to fetch PDF first, fallback to canvas if it fails
      fetchPdfPreview();
    }
  }, [useTemplate, certificate]);

  // If PDF fails, generate canvas fallback
  useEffect(() => {
    if (pdfError && useTemplate) {
      generateCertificateImage();
    }
  }, [pdfError, useTemplate]);

  // Cleanup PDF URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Download the generated certificate
  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `Certificate_${certificate.studentName.replace(/\s+/g, "_")}_${certificate.courseName.replace(/\s+/g, "_")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Download PDF from server
  const downloadPdf = async () => {
    const courseId = certificate?.courseId || course?._id;
    if (!courseId) {
      console.error("Course ID not available for PDF download");
      downloadCertificate(); // Fallback to PNG
      return;
    }

    setPdfLoading(true);
    try {
      const response = await api.get(`/certificates/${courseId}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ScholarX_Certificate_${certificate.studentName.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      downloadCertificate(); // Fallback to PNG
    } finally {
      setPdfLoading(false);
    }
  };

  // If using template image, render PDF preview or fallback to canvas
  if (useTemplate) {
    return (
      <div className={styles.certificateContainer}>
        <div className={styles.canvasCertificate}>
          {/* Loading state */}
          {pdfLoading && !pdfUrl && (
            <div className={styles.loadingMessage}>
              Loading your professional certificate...
            </div>
          )}

          {/* PDF Preview - Clean rendering without browser controls */}
          {pdfUrl && !pdfError && (
            <div className={styles.pdfContainer}>
              <Document
                file={pdfUrl}
                onLoadError={(error) => {
                  console.error("Error loading PDF:", error);
                  setPdfError(true);
                }}
                loading={
                  <div className={styles.loadingMessage}>
                    Rendering certificate...
                  </div>
                }
              >
                <Page
                  pageNumber={1}
                  width={Math.min(window.innerWidth * 0.9, 1000)}
                  className={styles.certificatePdfPage}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
          )}

          {/* Canvas fallback if PDF fails */}
          {pdfError && (
            <>
              <canvas
                ref={canvasRef}
                className={styles.certificateCanvas}
                style={{ display: imageLoaded ? "block" : "none" }}
              />
              {!imageLoaded && (
                <div className={styles.loadingMessage}>
                  Generating fallback certificate...
                </div>
              )}
            </>
          )}

          {/* Download buttons */}
          {(pdfUrl || imageLoaded) && (
            <div className={styles.downloadSection}>
              <button
                className={styles.downloadBtn}
                onClick={downloadPdf}
                disabled={pdfLoading}
              >
                {pdfLoading ? "⏳ Generating..." : "📄 Download PDF"}
              </button>
              <button
                className={styles.downloadBtnSecondary}
                onClick={downloadCertificate}
                title="Download as image"
              >
                🖼️ Download PNG
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Original certificate design
  return (
    <div className={styles.certificateContainer}>
      <div className={styles.certificate}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <img src="/ScholarX-Logo.png" alt="ScholarX Logo" />
          </div>
          <h1 className={styles.title}>Certificate of Completion</h1>
          <p className={styles.subtitle}>This is to certify that</p>
        </div>

        <div className={styles.content}>
          <h2 className={styles.studentName}>{certificate.studentName}</h2>
          <p className={styles.completionText}>
            has successfully completed the course
          </p>
          <h3 className={styles.courseName}>{certificate.courseName}</h3>

          <div className={styles.details}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Completion Date:</span>
              <span className={styles.value}>
                {formatDate(certificate.completedAt)}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Certificate ID:</span>
              <span className={styles.value}>{certificate.certificateId}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Completion Rate:</span>
              <span className={styles.value}>
                {certificate.completionPercentage}%
              </span>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.signature}>
            <div className={styles.signatureLine}></div>
            <p className={styles.signatureText}>ScholarX Team</p>
          </div>
          <div className={styles.date}>
            <p>Issued on {formatDate(certificate.completedAt)}</p>
          </div>
        </div>

        <div className={styles.verification}>
          <p>
            Verify this certificate at: scholar-x.org/certificates/verify/
            {certificate.certificateId}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
