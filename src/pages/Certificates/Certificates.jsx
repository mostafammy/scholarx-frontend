import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompletedCourses } from '../../store/slices/certificateSlice';
import Certificate from '../../components/Certificate/Certificate';
import styles from './Certificates.module.css';

const Certificates = () => {
    const { user } = useUser();
    const dispatch = useDispatch();
    const { completedCourses, loading, error } = useSelector(state => state.certificates);
    const [selectedCertificate, setSelectedCertificate] = useState(null);

    useEffect(() => {
        if (user) {
            dispatch(fetchCompletedCourses());
        }
    }, [dispatch, user]);

    const handleViewCertificate = (courseCompletion) => {
        setSelectedCertificate(courseCompletion);
    };

    const handleCloseCertificate = () => {
        setSelectedCertificate(null);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading your certificates...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error}>
                <h2>Error Loading Certificates</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Certificates</h1>
                <p className={styles.subtitle}>
                    Congratulations on completing your courses! Here are your certificates of completion.
                </p>
            </div>

            {completedCourses.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🏆</div>
                    <h2>No Certificates Yet</h2>
                    <p>Complete your first course to earn your first certificate!</p>
                    <button 
                        className={styles.browseButton}
                        onClick={() => window.location.href = '/courses'}
                    >
                        Browse Courses
                    </button>
                </div>
            ) : (
                <div className={styles.certificatesGrid}>
                    {completedCourses.map((courseCompletion) => (
                        <div key={courseCompletion._id} className={styles.certificateCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.courseImage}>
                                    {courseCompletion.course.image?.url ? (
                                        <img 
                                            src={courseCompletion.course.image.url} 
                                            alt={courseCompletion.course.title}
                                        />
                                    ) : (
                                        <div className={styles.defaultImage}>📚</div>
                                    )}
                                </div>
                                <div className={styles.courseInfo}>
                                    <h3 className={styles.courseTitle}>{courseCompletion.course.title}</h3>
                                    <p className={styles.completionDate}>
                                        Completed on {formatDate(courseCompletion.completedAt)}
                                    </p>
                                </div>
                            </div>
                            
                            <div className={styles.cardContent}>
                                <div className={styles.stats}>
                                    <div className={styles.stat}>
                                        <span className={styles.statValue}>{courseCompletion.completedLessons}</span>
                                        <span className={styles.statLabel}>Lessons</span>
                                    </div>
                                    <div className={styles.stat}>
                                        <span className={styles.statValue}>{courseCompletion.completionPercentage}%</span>
                                        <span className={styles.statLabel}>Complete</span>
                                    </div>
                                </div>
                                
                              
                            </div>
                            
                            <div className={styles.cardActions}>
                                <button 
                                    className={styles.viewButton}
                                    onClick={() => handleViewCertificate(courseCompletion)}
                                >
                                    View Certificate
                                </button>
                              
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedCertificate && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <button 
                            className={styles.closeButton}
                            onClick={handleCloseCertificate}
                        >
                            ✕
                        </button>
                        <Certificate 
                            certificate={{
                                studentName: `${user.firstName} ${user.lastName}`,
                                courseName: selectedCertificate.course.title,
                                completedAt: selectedCertificate.completedAt,
                                certificateId: selectedCertificate.certificateId,
                                completionPercentage: selectedCertificate.completionPercentage
                            }}
                            course={selectedCertificate.course}
                            useTemplate={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificates;

