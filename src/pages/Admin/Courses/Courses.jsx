import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses, createCourse, updateCourse, updateCourseStatus, deleteCourse, createLesson, updateLesson, deleteLesson, enrollUserToCourse, revokeUserFromCourse } from '../../../store/slices/adminSlice';
import { fetchCourseLessons } from '../../../store/slices/lessonSlice';
import Swal from 'sweetalert2';
import './Courses.css';

const Courses = () => {
    const dispatch = useDispatch();
    const { courses, loading, error } = useSelector((state) => state.admin);
    const { sections: courseSections, loading: lessonsLoading, error: lessonsError } = useSelector(state => state.lessons);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [showEditLessonModal, setShowEditLessonModal] = useState(false);
    const [showLessonsListModal, setShowLessonsListModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [openActionMenuId, setOpenActionMenuId] = useState(null);
    const [creatingCourse, setCreatingCourse] = useState(false);
    const [updatingCourse, setUpdatingCourse] = useState(false);
    const [creatingLesson, setCreatingLesson] = useState(false);
    const [updatingLesson, setUpdatingLesson] = useState(false);
    const [deletingCourseId, setDeletingCourseId] = useState(null);
    const [grantingAccessId, setGrantingAccessId] = useState(null);
    const [revokingAccessId, setRevokingAccessId] = useState(null);
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        image: {
            url: '',
            public_id: ''
        },
        category: 'Featured',
        currentPrice: '',
        oldPrice: '',
        instructor: null
    });
    const [newLesson, setNewLesson] = useState({
        title: '',
        description: '',
        videoUrl: '',
        duration: '',
        order: 1,
        isPrivate: true
    });
    const [editLesson, setEditLesson] = useState({
        title: '',
        description: '',
        videoUrl: '',
        duration: '',
        order: 1,
        isPrivate: true
    });

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch courses when debounced search term changes
    useEffect(() => {
        dispatch(fetchAllCourses({ page: currentPage, search: debouncedSearchTerm }));
    }, [dispatch, currentPage, debouncedSearchTerm]);

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            if (creatingCourse) return;
            setCreatingCourse(true);
            const courseData = {
                ...newCourse,
                currentPrice: parseFloat(newCourse.currentPrice),
                oldPrice: newCourse.oldPrice ? parseFloat(newCourse.oldPrice) : undefined,
                image: newCourse.image.file ? { file: newCourse.image.file } : undefined
            };
            await dispatch(createCourse(courseData)).unwrap();
            setShowCreateModal(false);
            setNewCourse({
                title: '',
                description: '',
                image: {
                    url: '',
                    public_id: ''
                },
                category: 'Featured',
                currentPrice: '',
                oldPrice: '',
                instructor: null
            });
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Course created successfully!',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Failed to create course:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to create course',
            });
        }
        finally {
            setCreatingCourse(false);
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        try {
            if (updatingCourse) return;
            setUpdatingCourse(true);
            const courseData = {
                ...selectedCourse,
                currentPrice: parseFloat(selectedCourse.currentPrice),
                oldPrice: selectedCourse.oldPrice ? parseFloat(selectedCourse.oldPrice) : undefined,
                image: selectedCourse.image?.file ? { file: selectedCourse.image.file } : undefined
            };
                 await dispatch(updateCourse({
                courseId: selectedCourse._id,
                courseData: courseData
            })).unwrap();
            setShowEditModal(false);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Course updated successfully!',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Failed to update course:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to update course',
            });
        }
        finally {
            setUpdatingCourse(false);
        }
    };

    const handleCreateLesson = async (e) => {
        e.preventDefault();
        try {
            if (creatingLesson) return;
            setCreatingLesson(true);
            const lessonData = {
                ...newLesson,
                duration: parseFloat(newLesson.duration),
                order: parseInt(newLesson.order)
            };
            await dispatch(createLesson({
                courseId: selectedCourse._id,
                lessonData: lessonData
            })).unwrap();
            setShowLessonModal(false);
            setNewLesson({
                title: '',
                description: '',
                videoUrl: '',
                duration: '',
                order: 1,
                isPrivate: true
            });
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Lesson added successfully!',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Failed to create lesson:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to create lesson',
            });
        }
        finally {
            setCreatingLesson(false);
        }
    };

    const handleUpdateLesson = async (e) => {
        e.preventDefault();
        try {
            if (updatingLesson) return;
            setUpdatingLesson(true);
            const lessonData = {
                ...editLesson,
                duration: parseFloat(editLesson.duration),
                order: parseInt(editLesson.order)
            };
            await dispatch(updateLesson({
                lessonId: selectedLesson._id,
                lessonData: lessonData
            })).unwrap();
            setShowEditLessonModal(false);
            setShowLessonsListModal(false);
            setSelectedLesson(null);
            setEditLesson({
                title: '',
                description: '',
                videoUrl: '',
                duration: '',
                order: 1,
                isPrivate: true
            });
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Lesson updated successfully!',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Failed to update lesson:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to update lesson',
            });
        }
        finally {
            setUpdatingLesson(false);
        }
    };

    const handleManageLessons = async (course) => {
        try {
            setSelectedCourse(course);
            await dispatch(fetchCourseLessons(course._id)).unwrap();
            setShowLessonsListModal(true);
        } catch (error) {
            console.error('Failed to fetch lessons:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to load lessons',
            });
        }
    };

    const handleEditLesson = (lesson) => {
        setSelectedLesson(lesson);
        setEditLesson({
            title: lesson.title,
            description: lesson.description,
            videoUrl: lesson.videoUrl,
            duration: lesson.duration || '',
            order: lesson.order || 1,
            isPrivate: lesson.isPrivate !== undefined ? lesson.isPrivate : true
        });
        setShowEditLessonModal(true);
    };

    const handleDeleteLesson = async (lessonId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                await dispatch(deleteLesson({ lessonId, courseId: selectedCourse._id })).unwrap();
                
                // Refresh lessons list
                const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/courses/${selectedCourse._id}/lessons`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setCourseLessons(data.data.lessons);
                }

                Swal.fire(
                    'Deleted!',
                    'Lesson has been deleted.',
                    'success'
                );
            }
        } catch (error) {
            console.error('Failed to delete lesson:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to delete lesson',
            });
        }
    };

    const handleStatusChange = async (courseId, newStatus) => {
        try {
            await dispatch(updateCourseStatus({ courseId, status: newStatus })).unwrap();
        } catch (error) {
            console.error('Failed to update course status:', error);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                if (deletingCourseId) return;
                setDeletingCourseId(courseId);
                await dispatch(deleteCourse(courseId)).unwrap();
            } catch (error) {
                console.error('Failed to delete course:', error);
            }
            finally {
                setDeletingCourseId(null);
            }
        }
    };

    const handleGrantAccess = async (course) => {
        if (grantingAccessId) return;
        const { value: email } = await Swal.fire({
            title: 'Grant Access',
            input: 'email',
            inputLabel: 'User email',
            inputPlaceholder: 'user@example.com',
            confirmButtonText: 'Grant',
            showCancelButton: true
        });
        if (!email) return;
        try {
            setGrantingAccessId(course._id);
            await dispatch(enrollUserToCourse({ courseId: course._id, email })).unwrap();
            Swal.fire({ icon: 'success', title: 'Access granted', timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Failed', text: err || 'Could not grant access' });
        }
        finally {
            setGrantingAccessId(null);
        }
    };

    const handleRevokeAccess = async (course) => {
        if (revokingAccessId) return;
        const { value: email } = await Swal.fire({
            title: 'Revoke Access',
            input: 'email',
            inputLabel: 'User email',
            inputPlaceholder: 'user@example.com',
            confirmButtonText: 'Revoke',
            showCancelButton: true
        });
        if (!email) return;
        try {
            setRevokingAccessId(course._id);
            await dispatch(revokeUserFromCourse({ courseId: course._id, email })).unwrap();
            Swal.fire({ icon: 'success', title: 'Access revoked', timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Failed', text: err || 'Could not revoke access' });
        }
        finally {
            setRevokingAccessId(null);
        }
    };

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-courses">
            <div className="header">
                <h1>Course Management</h1>
                <button
                    className="create-btn btn btn-primary mb-1"
                    onClick={() => setShowCreateModal(true)}
                >
                    Create New Course
                </button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {loading && <span className="search-loading">Searching...</span>}
            </div>

            <div className="courses-table">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Current Price</th>
                            <th>Old Price</th>
                            <th>Total Lessons</th>
                            <th>Total Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && !courses?.list ? (
                            <tr>
                                <td colSpan="7" className="loading-cell">Loading courses...</td>
                            </tr>
                        ) : courses?.courses?.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="no-data-cell">No courses found</td>
                            </tr>
                        ) : (
                            courses?.list?.map(course => (
                                <tr key={course._id}>
                                    <td data-label="Title">{course.title}</td>
                                    <td data-label="Category">{course.category}</td>
                                    <td data-label="Current Price">${course.currentPrice}</td>
                                    <td data-label="Old Price">{course.oldPrice ? `$${course.oldPrice}` : '-'}</td>
                                    <td data-label="Total Lessons">{course.totalLessons || 0}</td>
                                    <td data-label="Total Duration">{course.totalDuration || 0} min</td>
                                    <td data-label="Actions">
                                        <div className="actions-menu">
                                            <button
                                                className="actions-toggle"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenActionMenuId(openActionMenuId === course._id ? null : course._id);
                                                }}
                                                aria-haspopup="menu"
                                                aria-expanded={openActionMenuId === course._id}
                                            >
                                                Actions ▾
                                            </button>
                                            {openActionMenuId === course._id && (
                                                <div className="actions-dropdown" role="menu">
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setOpenActionMenuId(null);
                                                            handleManageLessons(course);
                                                        }}
                                                    >
                                                        Manage Lessons
                                                    </button>
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setOpenActionMenuId(null);
                                                            setSelectedCourse(course);
                                                            setShowLessonModal(true);
                                                        }}
                                                    >
                                                        Add Lesson
                                                    </button>
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setOpenActionMenuId(null);
                                                            setSelectedCourse(course);
                                                            setShowEditModal(true);
                                                        }}
                                                    >
                                                        Edit Course
                                                    </button>
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setOpenActionMenuId(null);
                                                            handleGrantAccess(course);
                                                        }}
                                                    >
                                                        Grant Access
                                                    </button>
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setOpenActionMenuId(null);
                                                            handleRevokeAccess(course);
                                                        }}
                                                    >
                                                        Revoke Access
                                                    </button>
                                                    <button
                                                        className="dropdown-item danger"
                                                        onClick={() => {
                                                            setOpenActionMenuId(null);
                                                            handleDeleteCourse(course._id);
                                                        }}
                                                    >
                                                        Delete Course
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    disabled={!courses?.pagination?.hasPreviousPage}
                    onClick={() => setCurrentPage(p => p - 1)}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {courses?.pagination?.totalPages || 1}</span>
                <button
                    disabled={!courses?.pagination?.hasNextPage}
                    onClick={() => setCurrentPage(p => p + 1)}
                >
                    Next
                </button>
            </div>

            {/* Create Course Modal */}
            {showCreateModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Create New Course</h2>
                        <form onSubmit={handleCreateCourse}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={newCourse.title}
                                    onChange={(e) => setNewCourse({
                                        ...newCourse,
                                        title: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={newCourse.description}
                                    onChange={(e) => setNewCourse({
                                        ...newCourse,
                                        description: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        setNewCourse({
                                            ...newCourse,
                                            image: file ? { file } : { url: '', public_id: '' }
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={newCourse.category}
                                    onChange={(e) => setNewCourse({
                                        ...newCourse,
                                        category: e.target.value
                                    })}
                                    required
                                >
                                    <option value="Featured">Featured</option>
                                    <option value="ScholarX">ScholarX</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Current Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={newCourse.currentPrice}
                                    onChange={(e) => setNewCourse({
                                        ...newCourse,
                                        currentPrice: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Old Price ($) - Optional</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={newCourse.oldPrice}
                                    onChange={(e) => setNewCourse({
                                        ...newCourse,
                                        oldPrice: e.target.value
                                    })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn" disabled={creatingCourse}>{creatingCourse ? 'Creating...' : 'Create Course'}</button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Course Modal */}
            {showEditModal && selectedCourse && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Course</h2>
                        <form onSubmit={handleUpdateCourse}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={selectedCourse.title}
                                    onChange={(e) => setSelectedCourse({
                                        ...selectedCourse,
                                        title: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={selectedCourse.description}
                                    onChange={(e) => setSelectedCourse({
                                        ...selectedCourse,
                                        description: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        setSelectedCourse({
                                            ...selectedCourse,
                                            image: file ? { file } : { url: '', public_id: '' }
                                        });
                                    }}
                                />
                                {selectedCourse.image?.url && !selectedCourse.image.file && (
                                    <img src={selectedCourse.image.url} alt="Course" style={{ maxWidth: 100, marginTop: 8 }} />
                                )}
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={selectedCourse.category}
                                    onChange={(e) => setSelectedCourse({
                                        ...selectedCourse,
                                        category: e.target.value
                                    })}
                                    required
                                >
                                    <option value="Featured">Featured</option>
                                    <option value="ScholarX">ScholarX</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Current Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={selectedCourse.currentPrice}
                                    onChange={(e) => setSelectedCourse({
                                        ...selectedCourse,
                                        currentPrice: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Old Price ($) - Optional</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={selectedCourse.oldPrice || ''}
                                    onChange={(e) => setSelectedCourse({
                                        ...selectedCourse,
                                        oldPrice: e.target.value
                                    })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn" disabled={updatingCourse}>{updatingCourse ? 'Saving...' : 'Save Changes'}</button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Lesson Modal */}
            {showLessonModal && selectedCourse && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Lesson to "{selectedCourse.title}"</h2>
                        <form onSubmit={handleCreateLesson}>
                            <div className="form-group">
                                <label>Lesson Title</label>
                                <input
                                    type="text"
                                    value={newLesson.title}
                                    onChange={(e) => setNewLesson({
                                        ...newLesson,
                                        title: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={newLesson.description}
                                    onChange={(e) => setNewLesson({
                                        ...newLesson,
                                        description: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>YouTube Video URL</label>
                                <input
                                    type="url"
                                    value={newLesson.videoUrl}
                                    onChange={(e) => setNewLesson({
                                        ...newLesson,
                                        videoUrl: e.target.value
                                    })}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Duration (minutes)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={newLesson.duration}
                                    onChange={(e) => setNewLesson({
                                        ...newLesson,
                                        duration: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Order</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={newLesson.order}
                                    onChange={(e) => setNewLesson({
                                        ...newLesson,
                                        order: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={newLesson.isPrivate}
                                        onChange={(e) => setNewLesson({
                                            ...newLesson,
                                            isPrivate: e.target.checked
                                        })}
                                    />
                                    Private Lesson (requires subscription)
                                </label>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn" disabled={creatingLesson}>{creatingLesson ? 'Adding...' : 'Add Lesson'}</button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowLessonModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lessons List Modal */}
            {showLessonsListModal && selectedCourse && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Manage Lessons for "{selectedCourse.title}"</h2>
                        <div className="lessons-list">
                            {lessonsLoading ? (
                                <p>Loading lessons...</p>
                            ) : lessonsError ? (
                                <p style={{ color: 'red' }}>{lessonsError}</p>
                            ) : !courseSections || courseSections.length === 0 ? (
                                <p>No lessons found for this course.</p>
                            ) : (
                                courseSections.map(section => (
                                    <div key={section.title}>
                                        <h4>{section.title}</h4>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Order</th>
                                                    <th>Title</th>
                                                    <th>Duration</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {section.lessons.map(lesson => (
                                                    <tr key={lesson._id}>
                                                        <td>{lesson.order}</td>
                                                        <td>{lesson.title}</td>
                                                        <td>{lesson.duration || 0} min</td>
                                                        <td>
                                                            <span className={`status-badge ${lesson.isPrivate ? 'private' : 'public'}`}>
                                                                {lesson.isPrivate ? 'Private' : 'Public'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="edit-btn"
                                                                onClick={() => handleEditLesson(lesson)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="delete-btn"
                                                                onClick={() => handleDeleteLesson(lesson._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="modal-actions">
                            <button
                                className="lesson-btn"
                                onClick={() => {
                                    setShowLessonsListModal(false);
                                    setShowLessonModal(true);
                                }}
                            >
                                Add New Lesson
                            </button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setShowLessonsListModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Lesson Modal */}
            {showEditLessonModal && selectedLesson && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Lesson</h2>
                        <form onSubmit={handleUpdateLesson}>
                            <div className="form-group">
                                <label>Lesson Title</label>
                                <input
                                    type="text"
                                    value={editLesson.title}
                                    onChange={(e) => setEditLesson({
                                        ...editLesson,
                                        title: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={editLesson.description}
                                    onChange={(e) => setEditLesson({
                                        ...editLesson,
                                        description: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>YouTube Video URL</label>
                                <input
                                    type="url"
                                    value={editLesson.videoUrl}
                                    onChange={(e) => setEditLesson({
                                        ...editLesson,
                                        videoUrl: e.target.value
                                    })}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Duration (minutes)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={editLesson.duration}
                                    onChange={(e) => setEditLesson({
                                        ...editLesson,
                                        duration: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Order</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={editLesson.order}
                                    onChange={(e) => setEditLesson({
                                        ...editLesson,
                                        order: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editLesson.isPrivate}
                                        onChange={(e) => setEditLesson({
                                            ...editLesson,
                                            isPrivate: e.target.checked
                                        })}
                                    />
                                    Private Lesson (requires subscription)
                                </label>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn" disabled={updatingLesson}>{updatingLesson ? 'Updating...' : 'Update Lesson'}</button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowEditLessonModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Courses; 