import React, { useState } from 'react';
import './ChangePassword.css';

function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        setError('Your Pssword dosent match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Your password should be at least 6 ');
return;
    }
    setError('');

    try {
      const response = await fetch("put your url", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: newPassword
        }),
      });

      if (!response.ok) {
        throw new Error('فشل في إرسال البيانات');
      }

      const data = await response.json();
      setNewPassword('');
      setConfirmPassword('');
      setError('Pssword was Changed successfully');
    } catch (err) {
      console.error( err);
      setError('somthing went wronf');
    }
  };



  return (
    <div className="change-password-container">
        <h2 className="title">Change Your Password!</h2>
      <div className="change-password-box">
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              required
            />
          </div>
          <div className="input-group">
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Your Password"
              required
            />
          </div>
          <button type="submit" className="submit-button">
                Login to Your Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;