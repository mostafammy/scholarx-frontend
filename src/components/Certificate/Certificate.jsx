import React, { useRef, useEffect, useState } from 'react';
import styles from './Certificate.module.css';

const Certificate = ({ certificate, course, useTemplate = false }) => {
    const canvasRef = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Generate certificate as actual image using Canvas
    const generateCertificateImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match the template image
        canvas.width = 1200;
        canvas.height = 900;

        // Load the template image
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Allow cross-origin images
        img.onload = () => {
            // Draw the template image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Set text properties
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Draw Student Name
            ctx.fillStyle = '#1a365d';
            ctx.font = 'bold 48px "Times New Roman", serif';
            ctx.fillText(certificate.studentName, canvas.width / 2, canvas.height * 0.55);

            // Draw Course Name
            ctx.font = '20px "Times New Roman", serif';
            ctx.fillText(certificate.courseName, canvas.width / 2 + 50, canvas.height * 0.65);

            // Draw Completion Date
            ctx.textAlign = 'left';
            ctx.font = '20px "Times New Roman", serif';
            ctx.fillText(formatDate(certificate.completedAt), canvas.width * 0.3, canvas.height * 0.88);

           
            setImageLoaded(true);
        };
        img.src = '/certificate-template.png';
    };

    useEffect(() => {
        if (useTemplate) {
            generateCertificateImage();
        }
    }, [useTemplate, certificate]);

    // Download the generated certificate
    const downloadCertificate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `Certificate_${certificate.studentName.replace(/\s+/g, '_')}_${certificate.courseName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    // If using template image, render the canvas-based certificate
    if (useTemplate) {
        return (
            <div className={styles.certificateContainer}>
                <div className={styles.canvasCertificate}>
                    <canvas 
                        ref={canvasRef}
                        className={styles.certificateCanvas}
                        style={{ display: imageLoaded ? 'block' : 'none' }}
                    />
                    {!imageLoaded && (
                        <div className={styles.loadingMessage}>
                            Generating your certificate...
                        </div>
                    )}
                    {imageLoaded && (
                        <div className={styles.downloadSection}>
                            <button 
                                className={styles.downloadBtn}
                                onClick={downloadCertificate}
                            >
                                📥 Download Certificate
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
                            <span className={styles.value}>{formatDate(certificate.completedAt)}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Certificate ID:</span>
                            <span className={styles.value}>{certificate.certificateId}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Completion Rate:</span>
                            <span className={styles.value}>{certificate.completionPercentage}%</span>
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
                    <p>Verify this certificate at: scholarx.com/verify/{certificate.certificateId}</p>
                </div>
            </div>
        </div>
    );
};

export default Certificate;

