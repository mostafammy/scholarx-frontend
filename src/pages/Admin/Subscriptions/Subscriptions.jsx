import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubscriptions, updateSubscription } from '../../../store/slices/adminSlice';
import './Subscriptions.css';

const Subscriptions = () => {
    const dispatch = useDispatch();
    const { subscriptions, loading, error } = useSelector((state) => state.admin);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const subscriptionList = Array.isArray(subscriptions?.list)
        ? subscriptions.list
        : Array.isArray(subscriptions)
            ? subscriptions
            : [];

    const formatUserName = (user) => {
        if (!user) return 'Unknown user';
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
        return fullName || user.email || 'Unknown user';
    };

    const formatDate = (value) => {
        if (!value) return 'N/A';
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? 'N/A' : parsed.toLocaleDateString();
    };

    const formatAmount = (value) => {
        if (value === undefined || value === null) return 'N/A';
        const numericValue = Number(value);
        return Number.isNaN(numericValue) ? value : `$${numericValue.toFixed(2)}`;
    };

    useEffect(() => {
        dispatch(fetchSubscriptions());
    }, [dispatch]);

    const handleStatusChange = async (subscriptionId, newStatus) => {
        try {
            await dispatch(updateSubscription({
                subscriptionId,
                subscriptionData: { status: newStatus }
            })).unwrap();
        } catch (error) {
            console.error('Failed to update subscription status:', error);
        }
    };

    const handleEditSubscription = (subscription) => {
        setSelectedSubscription(subscription);
        setShowEditModal(true);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-subscriptions">
            <h1>Subscription Management</h1>

            <div className="subscriptions-table">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Course</th>
                            <th>Start Date</th>
                            {/* <th>End Date</th> */}
                            <th>Amount</th>
                            {/* <th>Status</th> */}
                            {/* <th>Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptionList.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="empty-state">No subscriptions found.</td>
                            </tr>
                        ) : (
                            subscriptionList.map(subscription => (
                                <tr key={subscription._id}>
                                    <td data-label="User">{formatUserName(subscription.user)}</td>
                                    <td data-label="Course">{subscription.course?.title || 'Unknown course'}</td>
                                    <td data-label="Start Date">{formatDate(subscription.startDate)}</td>
                                    {/* <td>{new Date(subscription.endDate).toLocaleDateString()}</td> */}
                                    <td data-label="Amount">{formatAmount(subscription.amount)}</td>
                                {/* <td>
                                    <select
                                        value={subscription.status}
                                        onChange={(e) => handleStatusChange(subscription._id, e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="expired">Expired</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td> */}
                                {/* <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEditSubscription(subscription)}
                                    >
                                        Edit
                                    </button>
                                </td> */}
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showEditModal && selectedSubscription && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Subscription</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            dispatch(updateSubscription({
                                subscriptionId: selectedSubscription._id,
                                subscriptionData: selectedSubscription
                            }));
                            setShowEditModal(false);
                        }}>
                            <div className="form-group">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={new Date(selectedSubscription.startDate).toISOString().split('T')[0]}
                                    onChange={(e) => setSelectedSubscription({
                                        ...selectedSubscription,
                                        startDate: new Date(e.target.value)
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    value={new Date(selectedSubscription.endDate).toISOString().split('T')[0]}
                                    onChange={(e) => setSelectedSubscription({
                                        ...selectedSubscription,
                                        endDate: new Date(e.target.value)
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Amount</label>
                                <input
                                    type="number"
                                    value={selectedSubscription.amount}
                                    onChange={(e) => setSelectedSubscription({
                                        ...selectedSubscription,
                                        amount: e.target.value
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={selectedSubscription.status}
                                    onChange={(e) => setSelectedSubscription({
                                        ...selectedSubscription,
                                        status: e.target.value
                                    })}
                                >
                                    <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                    <option value="cancelled">Cancelled</option>
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
        </div>
    );
};

export default Subscriptions; 