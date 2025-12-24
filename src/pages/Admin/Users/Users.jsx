import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUser, updateUserStatus, deleteUser, blockUser, unblockUser } from '../../../store/slices/adminSlice';
import './Users.css';

const Users = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [blockReason, setBlockReason] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch users when debounced search term changes
    useEffect(() => {
        dispatch(fetchAllUsers({ page: currentPage, search: debouncedSearchTerm }));
    }, [dispatch, currentPage, debouncedSearchTerm]);

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await dispatch(updateUserStatus({ userId, status: newStatus })).unwrap();
        } catch (error) {
            console.error('Failed to update user status:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await dispatch(deleteUser(userId)).unwrap();
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        try {
            await dispatch(updateUser({
                userId: selectedUser._id,
                userData: {
                    role: selectedUser.role
                }
            })).unwrap();
            
            setUpdateMessage('User role updated successfully!');
            setTimeout(() => setUpdateMessage(''), 3000);
            setShowEditModal(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Failed to update user:', error);
            setUpdateMessage('Failed to update user role');
            setTimeout(() => setUpdateMessage(''), 3000);
        }
    };

    const handleBlockUser = (user) => {
        setSelectedUser(user);
        setShowBlockModal(true);
        setBlockReason('');
    };

    const handleUnblockUser = async (userId) => {
        if (window.confirm('Are you sure you want to unblock this user?')) {
            try {
                await dispatch(unblockUser(userId)).unwrap();
                setUpdateMessage('User unblocked successfully!');
                setTimeout(() => setUpdateMessage(''), 3000);
            } catch (error) {
                console.error('Failed to unblock user:', error);
                setUpdateMessage('Failed to unblock user');
                setTimeout(() => setUpdateMessage(''), 3000);
            }
        }
    };

    const handleConfirmBlock = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        try {
            await dispatch(blockUser({
                userId: selectedUser._id,
                reason: blockReason
            })).unwrap();
            
            setUpdateMessage('User blocked successfully!');
            setTimeout(() => setUpdateMessage(''), 3000);
            setShowBlockModal(false);
            setSelectedUser(null);
            setBlockReason('');
        } catch (error) {
            console.error('Failed to block user:', error);
            setUpdateMessage('Failed to block user');
            setTimeout(() => setUpdateMessage(''), 3000);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-users">
            <h1>User Management</h1>
            
            {updateMessage && (
                <div className={`update-message ${updateMessage.includes('successfully') ? 'success' : 'error'}`}>
                    {updateMessage}
                </div>
            )}

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {loading && <span className="search-loading">Searching...</span>}
            </div>

            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.users?.map(user => (
                            <tr key={user._id}>
                                <td data-label="Name">{user.firstName} {user.lastName}</td>
                                <td data-label="Email">{user.email}</td>
                                <td data-label="Role">{user.role}</td>
                                <td data-label="Status">
                                    <span className={`status-badge ${user.isBlocked ? 'blocked' : 'active'}`}>
                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                    {user.isBlocked && user.blockReason && (
                                        <div className="block-reason" title={user.blockReason}>
                                            Reason: {user.blockReason}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEditUser(user)}
                                    >
                                        Edit
                                    </button>
                                    {user.isBlocked ? (
                                        <button
                                            className="unblock-btn"
                                            onClick={() => handleUnblockUser(user._id)}
                                        >
                                            Unblock
                                        </button>
                                    ) : (
                                        <button
                                            className="block-btn"
                                            onClick={() => handleBlockUser(user)}
                                        >
                                            Block
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    disabled={!users.pagination.hasPreviousPage}
                    onClick={() => setCurrentPage(p => p - 1)}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {users.pagination.totalPages}</span>
                <button
                    disabled={!users.pagination.hasNextPage}
                    onClick={() => setCurrentPage(p => p + 1)}
                >
                    Next
                </button>
            </div>

            {showEditModal && selectedUser && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit User</h2>
                        <form onSubmit={handleUpdateUser}>
                            {/* <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={selectedUser.firstName}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        firstName: e.target.value
                                    })}
                                />
                            </div> */}
                            {/* <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={selectedUser.lastName}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        lastName: e.target.value
                                    })}
                                />
                            </div> */}
                            {/* <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={selectedUser.email}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        email: e.target.value
                                    })}
                                />
                            </div> */}
                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={selectedUser.role}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        role: e.target.value
                                    })}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn">Save Changes</button>
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

            {showBlockModal && selectedUser && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Block User</h2>
                        <p>Are you sure you want to block <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>?</p>
                        <form onSubmit={handleConfirmBlock}>
                            <div className="form-group">
                                <label>Reason for blocking (optional)</label>
                                <textarea
                                    value={blockReason}
                                    onChange={(e) => setBlockReason(e.target.value)}
                                    placeholder="Enter reason for blocking this user..."
                                    rows="3"
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="block-confirm-btn">Block User</button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => {
                                        setShowBlockModal(false);
                                        setSelectedUser(null);
                                        setBlockReason('');
                                    }}
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

export default Users; 