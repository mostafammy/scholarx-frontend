import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Cookies from 'js-cookie';
import './LessonPage.css';
import { useDispatch, useSelector } from 'react-redux';
import BlockedUserMessage from '../../components/BlockedUserMessage/BlockedUserMessage';

import { 
    fetchCourseLessons, 
    markLessonComplete,
    setCurrentLesson,
    checkCourseSubscription
} from '../../store/slices/lessonSlice';
import { 
    markLessonComplete as markLessonCompleteCertificate,
    getCompletedLessons,
    getCourseCompletionStatus
} from '../../store/slices/certificateSlice';

const LessonPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user, loading: userLoading } = useUser();
    const [currentLesson, setCurrentLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const iframeRef = useRef(null);
    const videoContainerRef = useRef(null);
    const dispatch = useDispatch();
    // Restore lessons state from Redux
    const {
        sections,
        currentLesson: reduxCurrentLesson,
        completedLessons: reduxCompletedLessons,
        course,
        isSubscribed,
        isBlocked,
        loading: reduxLoading,
        error: reduxError
    } = useSelector(state => state.lessons);

    // Get certificate state
    const {
        completedLessons: certificateCompletedLessons,
        courseCompletionStatus,
        completedCourses
    } = useSelector(state => state.certificates);
    const playerRef = useRef(null); // Store YT.Player instance
    const [playerReady, setPlayerReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showPauseOverlay, setShowPauseOverlay] = useState(false);
    const [progressInterval, setProgressInterval] = useState(null);
    const videoFrameId = 'yt-player-frame';
    const [showLessonOverlay, setShowLessonOverlay] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showCompletionNotification, setShowCompletionNotification] = useState(false);

    // Extract video ID from YouTube URL
    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Load YouTube IFrame API
    useEffect(() => {
        if (window.YT && window.YT.Player) {
            return;
        }
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
    }, []);

    // Detect mobile browser
    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
            const isMobileViewport = window.innerWidth <= 768;
            setIsMobile(isMobileDevice || isMobileViewport);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Inject CSS to hide YouTube UI elements
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            #${videoFrameId} iframe {
                pointer-events: none !important;
            }
            #${videoFrameId} .ytp-show-cards-title,
            #${videoFrameId} .ytp-title,
            #${videoFrameId} .ytp-chrome-top,
            #${videoFrameId} .ytp-pause-overlay,
            #${videoFrameId} .ytp-watermark,
            #${videoFrameId} .ytp-title-text,
            #${videoFrameId} .ytp-player-content,
            #${videoFrameId} .ytp-gradient-top,
            #${videoFrameId} .ytp-gradient-bottom,
            #${videoFrameId} .ytp-cued-thumbnail-overlay,
            #${videoFrameId} .ytp-cued-thumbnail-overlay-button,
            #${videoFrameId} .ytp-cued-thumbnail-overlay-button-arrow-icon {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
            }
            ${isMobile ? `
            /* Mobile-specific YouTube UI hiding */
            #${videoFrameId} .ytp-mobile,
            #${videoFrameId} .ytp-mobile .ytp-title,
            #${videoFrameId} .ytp-mobile .ytp-chrome-top,
            #${videoFrameId} .ytp-mobile .ytp-pause-overlay,
            #${videoFrameId} .ytp-mobile .ytp-watermark,
            #${videoFrameId} .ytp-mobile .ytp-show-cards-title,
            #${videoFrameId} .ytp-mobile .ytp-title-text,
            #${videoFrameId} .ytp-mobile .ytp-player-content {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
            }
            ` : ''}
        `;
        document.head.appendChild(style);
        
        return () => {
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        };
    }, [videoFrameId, isMobile]);

    // Create YT.Player when API is ready and videoId is available
    useEffect(() => {
        const videoId = getYouTubeId(currentLesson?.videoUrl);
        if (!videoId) return;
        function onYouTubeIframeAPIReady() {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
            playerRef.current = new window.YT.Player(videoFrameId, {
                height: '360',
                width: '640',
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    rel: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    iv_load_policy: 3,
                    playsinline: 1,
                    enablejsapi: 1,
                    origin: window.location.origin,
                    cc_load_policy: 0,
                    color: 'white',
                    hl: 'en',
                    loop: 0,
                    playlist: videoId,
                    start: 0,
                    end: 0,
                    mute: 0,
                    autohide: 1,
                    wmode: 'opaque',
                    host: 'https://www.youtube-nocookie.com'
                },
                events: {
                    onReady: (event) => {
                        setPlayerReady(true);
                        setDuration(event.target.getDuration());
                        setCurrentTime(event.target.getCurrentTime());
                        setIsPlaying(event.target.getPlayerState() === window.YT.PlayerState.PLAYING);
                        
                        // Hide YouTube UI elements programmatically
                        const iframe = document.querySelector(`#${videoFrameId} iframe`);
                        if (iframe) {
                            iframe.style.pointerEvents = 'none';
                        }
                        
                        // Force hide any YouTube UI that might appear
                        setTimeout(() => {
                            const ytElements = document.querySelectorAll(`#${videoFrameId} .ytp-title, #${videoFrameId} .ytp-chrome-top, #${videoFrameId} .ytp-pause-overlay`);
                            ytElements.forEach(el => {
                                if (el) {
                                    el.style.display = 'none';
                                    el.style.opacity = '0';
                                    el.style.visibility = 'hidden';
                                }
                            });
                        }, 100);
                    },
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            setIsPlaying(true);
                            setShowPauseOverlay(false);
                        } else if (event.data === window.YT.PlayerState.PAUSED) {
                            setIsPlaying(false);
                            setShowPauseOverlay(true);
                        } else if (event.data === window.YT.PlayerState.ENDED) {
                            setIsPlaying(false);
                            setShowPauseOverlay(true);
                            if (currentLesson && courseId) {
                                // Mark lesson as complete in the certificate system
                                dispatch(markLessonCompleteCertificate({
                                    lessonId: currentLesson._id,
                                    courseId: courseId,
                                    watchTime: duration,
                                    completionPercentage: 100
                                })).then(() => {
                                    // After marking complete, refresh the completion data
                                    dispatch(getCompletedLessons(courseId));
                                    dispatch(getCourseCompletionStatus(courseId));
                                });
                                
                                // Also update local state for immediate UI feedback
                                setCompletedLessons(prev => {
                                    if (!prev.includes(currentLesson._id)) {
                                        return [...prev, currentLesson._id];
                                    }
                                    return prev;
                                });
                                
                                // Show completion notification
                                setShowCompletionNotification(true);
                                setTimeout(() => setShowCompletionNotification(false), 5000);
                            }
                        }
                    },
                    onError: (event) => {
                        setError('YouTube Player Error: ' + event.data);
                    }
                }
            });
        }
        if (window.YT && window.YT.Player) {
            onYouTubeIframeAPIReady();
        } else {
            window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        }
        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [currentLesson]);

    // Progress update interval
    useEffect(() => {
        if (playerReady && isPlaying && playerRef.current) {
            const interval = setInterval(() => {
                setCurrentTime(playerRef.current.getCurrentTime());
                setDuration(playerRef.current.getDuration());
            }, 200);
            setProgressInterval(interval);
            return () => clearInterval(interval);
        } else {
            if (progressInterval) clearInterval(progressInterval);
        }
    }, [playerReady, isPlaying]);

    // Continuously hide YouTube UI elements
    useEffect(() => {
        if (!playerReady) return;
        
        const hideYouTubeUI = () => {
            const ytElements = document.querySelectorAll(`#${videoFrameId} .ytp-title, #${videoFrameId} .ytp-chrome-top, #${videoFrameId} .ytp-pause-overlay, #${videoFrameId} .ytp-watermark, #${videoFrameId} .ytp-show-cards-title, #${videoFrameId} .ytp-title-text, #${videoFrameId} .ytp-player-content`);
            ytElements.forEach(el => {
                if (el) {
                    el.style.display = 'none';
                    el.style.opacity = '0';
                    el.style.visibility = 'hidden';
                }
            });
        };
        
        const interval = setInterval(hideYouTubeUI, 100);
        return () => clearInterval(interval);
    }, [playerReady, videoFrameId]);

    // Reset player state when lesson changes
    useEffect(() => {
        setPlayerReady(false);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setShowPauseOverlay(false);
    }, [currentLesson]);

    // Fetch course data and check subscription using Redux
    useEffect(() => {
        if (!userLoading && courseId) {
            setLoading(true);
            dispatch(fetchCourseLessons(courseId))
                .then((result) => {
                    if (result.payload && result.payload.sections && result.payload.sections.length > 0) {
                        setCurrentLesson(result.payload.sections[0].lessons[0]);
                    }
                })
                .catch((error) => {
                    setError(error.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [dispatch, courseId, userLoading]);

    // Check subscription status
    useEffect(() => {
        if (user && courseId) {
            dispatch(checkCourseSubscription({ courseId, userId: user._id }));
            // Fetch completed lessons and course completion status
            dispatch(getCompletedLessons(courseId));
            dispatch(getCourseCompletionStatus(courseId));
        }
    }, [dispatch, courseId, user]);

    // Force refresh completion data when current lesson changes
    useEffect(() => {
        if (courseId && currentLesson) {
            dispatch(getCompletedLessons(courseId));
            dispatch(getCourseCompletionStatus(courseId));
        }
    }, [dispatch, courseId, currentLesson]);

    if (loading || userLoading || reduxLoading) return <div className="loading">Loading...</div>;
    if (error || reduxError) return <div className="error">{error || reduxError}</div>;
    
    // Check if user is blocked
    if (user && user.isBlocked) {
        return (
            <BlockedUserMessage 
                blockReason={user?.blockReason}
                blockedAt={user?.blockedAt}
            />
        );
    }
    
    if (!isSubscribed) {
        return (
            <div className="subscription-required">
                <h2>Subscription Required</h2>
                <p>You need to subscribe to this course to access its lessons.</p>
                <button className="btn btn-primary" onClick={() => navigate(`/courses/${courseId}`)}>View Course Details</button>
            </div>
        );
    }

    // Progress calculation - combine local state and Redux state for real-time updates
    const totalLessons = sections.reduce((acc, sec) => acc + sec.lessons.length, 0);
    const certificateCompleted = certificateCompletedLessons[courseId] || [];
    
    // Combine Redux state with local state for immediate UI updates
    const allCompletedLessons = [...new Set([...certificateCompleted, ...completedLessons])];
    const completedCount = allCompletedLessons.length;
    const progress = totalLessons ? (completedCount / totalLessons) * 100 : 0;
    
    // Check if course is completed
    const isCourseCompleted = completedCount >= totalLessons && totalLessons > 0;
    const courseCompletion = completedCourses.find(cc => cc.course._id === courseId);

    // Calculate current lesson number
    const getCurrentLessonNumber = () => {
        if (!currentLesson) return 0;
        let count = 0;
        for (const section of sections) {
            for (const lesson of section.lessons) {
                count++;
                if (lesson._id === currentLesson._id) {
                    return count;
                }
            }
        }
        return 0;
    };

    const handlePlayPause = () => {
        if (!playerRef.current) return;
        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const handleSeek = (amount) => {
        if (!playerRef.current) return;
        setIsSeeking(true);
        const newTime = Math.max(0, Math.min(duration, playerRef.current.getCurrentTime() + amount));
        playerRef.current.seekTo(newTime, true);
        // Hide the seeking overlay after a delay (longer for mobile)
        const seekTimeout = isMobile ? 2000 : 1500;
        setTimeout(() => setIsSeeking(false), seekTimeout);
    };

    const handleProgressClick = (e) => {
        if (!playerRef.current) return;
        const bar = e.target.closest('.progress-container');
        if (!bar) return;
        setIsSeeking(true);
        const rect = bar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const newTime = pos * duration;
        playerRef.current.seekTo(newTime, true);
        // Hide the seeking overlay after a delay (longer for mobile)
        const seekTimeout = isMobile ? 2000 : 1500;
        setTimeout(() => setIsSeeking(false), seekTimeout);
    };

    // Fullscreen handler
    const handleFullscreen = () => {
        const container = videoContainerRef.current;
        if (!container) return;
        if (!document.fullscreenElement) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    // Format time for display
    const formatTime = (t) => {
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // The overlay should show if paused, if lesson overlay is active, or if seeking
    const showImageOverlay = showPauseOverlay || showLessonOverlay || isSeeking;

    // --- Render ---
    const videoId = getYouTubeId(currentLesson?.videoUrl);
    // Instead of iframe, render a div for the YT.Player
    return (
        <div className="lesson-main-layout">
            <div className="lesson-left">
                <div className="lesson-video-container" ref={videoContainerRef}>
                    <div className="video-frame-wrapper">
                        <div id={videoFrameId} className="video-frame"></div>
                        {showImageOverlay && (
                            <img
                                src="/background.png"
                                alt="Overlay"
                                className="overlay-image"
                            />
                        )}
                        <div className={`pause-overlay${showPauseOverlay ? ' active' : ''}`}></div>
                        {isSeeking && (
                            <div className="seeking-overlay"></div>
                        )}
                        <div className="protective-layer"></div>
                    </div>
                    <div className="controls">
                        <button className="play-pause-btn" onClick={handlePlayPause}>{isPlaying ? '⏸' : '▶'}</button>
                        <button className="seek-btn" onClick={() => handleSeek(-10)}>-10</button>
                        <div className="progress-container" onClick={handleProgressClick}>
                            <div 
                                className="progress-bar" 
                                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0' }}
                            ></div>
                        </div>
                        <button className="seek-btn" onClick={() => handleSeek(10)}>+10</button>
                        <span className="time-display">{formatTime(currentTime)} / {formatTime(duration)}</span>
                        <button className="fullscreen-btn" title="Fullscreen" onClick={handleFullscreen}>⛶</button>
                    </div>
                </div>
                    <div className="lesson-title text-center">
                        {course?.title || 'Course'}
                        {currentLesson && (
                            <div className="lesson-subtitle">
                                {currentLesson.title} ({getCurrentLessonNumber()}/{totalLessons})
                            </div>
                        )}
                        
                        {/* Course Completion Certificate Section */}
                        {isCourseCompleted && (
                            <div className="course-completion-celebration">
                                <div className="celebration-icon">🎉</div>
                                <h3 className="celebration-title">
                                    Congratulations!
                                </h3>
                                <p className="celebration-message">
                                    You have successfully completed all lessons in this course!
                                </p>
                                <div className="celebration-actions">
                                    <button 
                                        className="view-certificate-btn"
                                        onClick={() => navigate('/certificates')}
                                    >
                                        🏆 View Certificate
                                    </button>
                                    <button 
                                        className="view-certificate-modal-btn"
                                        onClick={() => {
                                            // Generate and show certificate in modal
                                            if (courseCompletion) {
                                                // Show certificate modal
                                                const certificateData = {
                                                    studentName: `${user.firstName} ${user.lastName}`,
                                                    courseName: course.title,
                                                    completedAt: courseCompletion.completedAt,
                                                    certificateId: courseCompletion.certificateId,
                                                    completionPercentage: courseCompletion.completionPercentage
                                                };
                                                
                                                // Create a temporary modal to show certificate
                                                const modal = document.createElement('div');
                                                modal.style.cssText = `
                                                    position: fixed;
                                                    top: 0;
                                                    left: 0;
                                                    right: 0;
                                                    bottom: 0;
                                                    background: rgba(0,0,0,0.8);
                                                    z-index: 10000;
                                                    display: flex;
                                                    align-items: center;
                                                    justify-content: center;
                                                    padding: 2rem;
                                                `;
                                                
                                                // Create canvas for certificate
                                                const canvas = document.createElement('canvas');
                                                canvas.width = 1200;
                                                canvas.height = 900;
                                                canvas.style.cssText = `
                                                    max-width: 100%;
                                                    height: auto;
                                                    border-radius: 12px;
                                                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                                                    background: white;
                                                `;
                                                
                                                const ctx = canvas.getContext('2d');
                                                
                                                // Load template image and draw certificate
                                                const img = new Image();
                                                img.crossOrigin = 'anonymous';
                                                img.onload = () => {
                                                    // Draw template
                                                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                                    
                                                    // Set text properties
                                                    ctx.textAlign = 'center';
                                                    ctx.textBaseline = 'middle';
                                                    
                                                    // Draw Student Name
                                                    ctx.fillStyle = '#1a365d';
                                                    ctx.font = 'bold 48px "Times New Roman", serif';
                                                    ctx.fillText(certificateData.studentName, canvas.width / 2, canvas.height * 0.55);
                                                    
                                                    // Draw Course Name
                                                    ctx.font = '20px "Times New Roman", serif';
                                                    ctx.fillText(certificateData.courseName, canvas.width / 2 + 50, canvas.height * 0.65);
                                                    
                                                    // Draw Completion Date
                                                    ctx.textAlign = 'left';
                                                    ctx.font = '20px "Times New Roman", serif';
                                                    ctx.fillText(new Date(certificateData.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), canvas.width * 0.3, canvas.height * 0.88);
                                                    
                                                   
                                                };
                                                img.src = '/certificate-template.png';
                                                
                                                // Download function
                                                const downloadCertificate = () => {
                                                    const link = document.createElement('a');
                                                    link.download = `Certificate_${certificateData.studentName.replace(/\s+/g, '_')}_${certificateData.courseName.replace(/\s+/g, '_')}.png`;
                                                    link.href = canvas.toDataURL('image/png');
                                                    link.click();
                                                };
                                                
                                                modal.innerHTML = `
                                                    <div style="
                                                        background: white;
                                                        border-radius: 20px;
                                                        padding: 2rem;
                                                        max-width: 1000px;
                                                        width: 100%;
                                                        max-height: 90vh;
                                                        overflow-y: auto;
                                                        position: relative;
                                                        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                                                        display: flex;
                                                        flex-direction: column;
                                                        align-items: center;
                                                        gap: 1.5rem;
                                                    ">
                                                        <button onclick="this.parentElement.parentElement.remove()" style="
                                                            position: absolute;
                                                            top: 1rem;
                                                            right: 1rem;
                                                            background: rgba(0,0,0,0.5);
                                                            color: white;
                                                            border: none;
                                                            width: 40px;
                                                            height: 40px;
                                                            border-radius: 50%;
                                                            cursor: pointer;
                                                            font-size: 1.2rem;
                                                            z-index: 10001;
                                                        ">✕</button>
                                                        
                                                        <h2 style="margin: 0; color: #2d3748; font-size: 1.8rem;">Your Certificate</h2>
                                                        
                                                        <div id="certificate-canvas-container"></div>
                                                        
                                                        <button onclick="window.downloadCertificate()" style="
                                                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                                            color: white;
                                                            border: none;
                                                            padding: 1rem 2rem;
                                                            border-radius: 12px;
                                                            font-size: 1.1rem;
                                                            font-weight: 600;
                                                            cursor: pointer;
                                                            display: flex;
                                                            align-items: center;
                                                            gap: 0.5rem;
                                                            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                                                        ">
                                                            📥 Download Certificate
                                                        </button>
                                                    </div>
                                                `;
                                                
                                                // Add canvas to modal after it's created
                                                setTimeout(() => {
                                                    const container = modal.querySelector('#certificate-canvas-container');
                                                    if (container) {
                                                        container.appendChild(canvas);
                                                    }
                                                }, 100);
                                                
                                                // Make download function global
                                                window.downloadCertificate = downloadCertificate;
                                                
                                                document.body.appendChild(modal);
                                            }
                                        }}
                                    >
                                        📜 View Certificate
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
            </div>
            <div className="lesson-right">
                <div className="lesson-sections-card">
                    <div className="lesson-sections-title">
                        Course Sections
                        {isCourseCompleted && (
                            <span className="completed-badge">
                                ✅ Completed
                            </span>
                        )}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="progress-section">
                        <div className="progress-header">
                            <span className="progress-label">
                                Course Progress
                            </span>
                            <span className="progress-count">
                                {completedCount}/{totalLessons} lessons
                            </span>
                        </div>
                        <div className="progress-bar-container">
                            <div 
                                className={`progress-bar-fill ${isCourseCompleted ? 'completed' : 'in-progress'}`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="progress-percentage">
                            {Math.round(progress)}% Complete
                        </div>
                    </div>
                    <div className="lesson-sections-list">
                        {sections.map((section, sIdx) => (
                            <div className="lesson-section" key={section.title}>
                                <div className="lesson-section-title">
                                    {section.index}- {section.title}
                                </div>
                                <div className="lesson-section-lessons">
                                    {section.lessons.map((lesson, lIdx) => (
                                        <div
                                            key={lesson._id}
                                            className={`lesson-section-lesson${currentLesson && lesson._id === currentLesson._id ? ' active' : ''}`}
                                            onClick={() => {
                                                setCurrentLesson(lesson);
                                                setShowLessonOverlay(true);
                                                setTimeout(() => setShowLessonOverlay(false), 4000);
                                            }}
                                        >
                                            <span className="lesson-checkmark">
                                                {allCompletedLessons.includes(lesson._id) ? '✔️' : ''}
                                            </span>
                                            <span className="lesson-section-lesson-title">{lesson.title}</span>
                                            <span className="lesson-section-lesson-duration">{lesson.duration ? lesson.duration.toFixed(2) : '00:00'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Lesson Completion Notification */}
            {showCompletionNotification && (
                <div className="completion-notification">
                    <div className="notification-icon">✅</div>
                    <div className="notification-content">
                        <div className="notification-title">
                            Lesson Completed!
                        </div>
                        <div className="notification-message">
                            {completedCount}/{totalLessons} lessons completed
                            {completedCount >= totalLessons && (
                                <div className="course-complete-message">
                                    🎉 Course Complete! Check your certificate!
                                </div>
                            )}
                        </div>
                    </div>
                    <button 
                        className="notification-close-btn"
                        onClick={() => setShowCompletionNotification(false)}
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};

export default LessonPage; 