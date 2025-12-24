import React from 'react';
import styles from './BlockedUserMessage.module.css';

const BlockedUserMessage = ({ blockReason, blockedAt }) => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.icon}>
                    🚫
                </div>
                <h2 className={styles.title}>Account Blocked</h2>
                <p className={styles.message}>
                    Your account has been blocked and you cannot access course content at this time.
                </p>
                
                {blockReason && (
                    <div className={styles.reason}>
                        <strong>Reason:</strong> {blockReason}
                    </div>
                )}
                
                {blockedAt && (
                    <div className={styles.date}>
                        <strong>Blocked on:</strong> {new Date(blockedAt).toLocaleDateString()}
                    </div>
                )}
                
                <div className={styles.contact}>
                    <p>If you believe this is an error or have questions, please contact our support team:</p>
                    <div className={styles.contactInfo}>
                        <p>📧 Email: support@scholarx.com</p>
                        <p>📞 Phone: +1 (555) 123-4567</p>
                    </div>
                </div>
                
                <div className={styles.actions}>
                    <button 
                        className={styles.contactSupportBtn}
                        onClick={() => window.location.href = 'mailto:support@scholarx.com'}
                    >
                        Contact Support
                    </button>
                    <button 
                        className={styles.goHomeBtn}
                        onClick={() => window.location.href = '/'}
                    >
                        Go to Homepage
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlockedUserMessage;
